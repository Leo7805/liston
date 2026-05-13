// Retrieves speech audio by checking memory cache first, then IndexedDB, and finally falling back to TTS generation.

import {
  getSpeechFromMemory,
  setSpeechToMemory,
} from '@/services/audioSourceMemory';
import {
  getSpeechFromIndexedDB,
  setSpeechToIndexedDB,
} from '@/services/audioSourceIndexedDB';
import { generateSpeech, getVoiceName } from '@/services/audioSourceTTS';
import type { LanguageCodeType } from '@/types/languages';

/**
 * Input for creating a unique cache key for an audio blob.
 */
type AudioCacheKeyInput = {
  lang: LanguageCodeType;
  voiceName: string;
  text: string;
};

/**
 * Input for resolving speech audio through the source chain.
 * The optional signal cancels the TTS request when audio must be generated.
 */
type GetSpeechAudioInput = {
  lang: LanguageCodeType;
  text: string;
  signal?: AbortSignal;
};

// Possible results from an audio playback attempt.
type PendingSpeechAudio = {
  promise: Promise<Blob>;
  signal?: AbortSignal;
};

// In-memory map to track pending TTS requests by their cache key.
// This prevents duplicate TTS requests for the same sentence part
// when multiple components request audio simultaneously.
const pendingSpeechAudio = new Map<string, PendingSpeechAudio>();

/**
 * Creates a unique cache key for an audio blob.
 * @param lang - The language code (e.g., 'en', 'zh')
 * @param voiceName - The name of the voice to be used for TTS (e.g., 'en-US-Wavenet-D')
 * @param text - The text to be synthesized
 * @returns A unique cache key in the format "lang:voiceName:text"
 */
export function createCacheKey({
  lang,
  voiceName,
  text,
}: AudioCacheKeyInput): string {
  return `${lang}:${voiceName}:${text.trim()}`;
}

/**
 * Gets speech audio for a sentence part.
 *
 * Checks the in-memory cache first, then IndexedDB. If there is no cached
 * audio, it requests generated speech from the TTS service and stores the
 * result in both cache layers.
 *
 * @param input.lang - Language code used to choose the TTS voice.
 * @param input.text - Text to synthesize.
 * @param input.signal - Optional abort signal for cancelling the TTS request.
 * @returns A Blob containing generated speech audio.
 */
export async function getSpeechAudio({
  lang,
  text,
  signal,
}: GetSpeechAudioInput): Promise<Blob> {
  const voiceName = getVoiceName(lang);
  const normalizedText = text.trim();

  const cacheKey = createCacheKey({ lang, voiceName, text: normalizedText });

  // 0. Check if there is already a pending TTS request for the same cache key.
  const pendingAudio = pendingSpeechAudio.get(cacheKey);

  if (pendingAudio && !pendingAudio.signal?.aborted) {
    console.debug('[speechAudio] pending request hit', {
      lang,
      voiceName,
      text: normalizedText,
    });

    return pendingAudio.promise;
  }

  // 1. Check memory cache for the audio blob.
  const memoryAudio = getSpeechFromMemory(cacheKey);

  if (memoryAudio) {
    console.debug('[speechAudio] memory cache hit', {
      lang,
      voiceName,
      text: normalizedText,
    });

    return memoryAudio;
  }

  try {
    // 2. Check IndexedDB for the audio blob.
    const indexedDBAudio = await getSpeechFromIndexedDB(cacheKey);

    if (indexedDBAudio) {
      console.debug('[speechAudio] indexedDB cache hit', {
        lang,
        voiceName,
        text: normalizedText,
      });

      setSpeechToMemory(cacheKey, indexedDBAudio);
      return indexedDBAudio;
    }
  } catch (error) {
    console.warn('[speechAudio] failed to read audio from IndexedDB cache', {
      error,
      lang,
      voiceName,
      text: normalizedText,
    });
  }

  console.debug('[speechAudio] cache miss, requesting TTS', {
    lang,
    voiceName,
    text: normalizedText,
  });

  // 3. No cache hit - request generated speech from TTS and cache the result.
  const generatedAudioPromise = generateAndCacheSpeech({
    cacheKey,
    voiceName,
    text: normalizedText,
    signal,
  });

  // Store the pending TTS request in the map
  pendingSpeechAudio.set(cacheKey, {
    promise: generatedAudioPromise,
    signal,
  });

  try {
    return await generatedAudioPromise;
  } finally {
    // Clean up the pending request from the map once it's resolved or rejected
    if (pendingSpeechAudio.get(cacheKey)?.promise === generatedAudioPromise) {
      pendingSpeechAudio.delete(cacheKey);
    }
  }
}

// Generates speech audio using TTS and caches it in both memory and IndexedDB. Returns the generated audio blob.
async function generateAndCacheSpeech({
  cacheKey,
  voiceName,
  text,
  signal,
}: {
  cacheKey: string;
  voiceName: string;
  text: string;
  signal?: AbortSignal;
}): Promise<Blob> {
  const generatedAudio = await generateSpeech({ voiceName, text, signal });
  setSpeechToMemory(cacheKey, generatedAudio);

  try {
    await setSpeechToIndexedDB(cacheKey, generatedAudio);
  } catch (error) {
    console.warn('[speechAudio] failed to cache generated audio in IndexedDB', {
      error,
      voiceName,
      text,
    });
  }

  console.debug('[speechAudio] cached generated audio', {
    voiceName,
    text,
    size: generatedAudio.size,
  });

  return generatedAudio;
}
