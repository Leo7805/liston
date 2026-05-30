import { type LanguageCodeType } from '@/global/constants/languages-codes';
import {
  type VoiceNameType,
  DefaultAzureTtsVoiceNames as voices,
} from '@/global/constants/azure-tts-voices';
import {
  createAudioCacheKey,
  getCachedAudioUri,
  saveAudioToCache,
} from './ttsAudioCache';
import { generateTtsSpeech } from './ttsClient';

/**
 * TTS Audio Resolver
 *
 * Resolves a TTS request into a playable local audio file URI.
 *
 * Responsibilities:
 * - generate audio cache keys
 * - check memory/file-system cache
 * - deduplicate concurrent requests
 * - fetch TTS audio from backend on cache miss
 * - save audio into local cache
 * - return playable local file URIs
 *
 * This layer orchestrates:
 * ttsClient + audioCache
 */

/**
 * @internal
 * Tracks an in-flight TTS request and the signal that can abort it.
 */
type PendingAudioRequest = {
  promise: Promise<string>;
  signal?: AbortSignal;
};

/**
 * @internal
 * Tracks pending fetch requests to avoid duplicate requests
 * */
const pendingRequests = new Map<string, PendingAudioRequest>();

/**
 * Maps language codes to configured TTS voice names and calls the TTS API.
 */
export function getVoiceName(lang: LanguageCodeType): VoiceNameType {
  return (
    voices[lang] ||
    (() => {
      throw new Error(`Unsupported language code: ${lang}`);
    })()
  );
}

/**
 * Get or create cached audio:
 *  - If exists in memory or file system → return it
 *  - If another request is already fetching → wait for it
 *  - Otherwise fetch audio, save to file, update caches
 */
export async function getAudioUri(
  lang: LanguageCodeType,
  text: string,
  signal?: AbortSignal
): Promise<string> {
  const normalizedText = text.trim();

  if (!normalizedText) {
    throw new Error('Text cannot be empty');
  }

  const voiceName = getVoiceName(lang);
  const cacheKey = createAudioCacheKey({
    lang,
    voiceName,
    text: normalizedText,
  });

  // 1. Check if audio is already cached (memory or file system)
  const audioUri = await getCachedAudioUri(cacheKey);

  if (audioUri) {
    return audioUri;
  }

  // 2. If another request is already fetching, wait for it
  const pendingRequest = pendingRequests.get(cacheKey);
  if (pendingRequest) {
    if (!pendingRequest.signal?.aborted) {
      return pendingRequest.promise;
    }

    pendingRequests.delete(cacheKey); // Clean up aborted request
  }

  // 3. Otherwise, fetch the audio and save it to cache
  let audioUriPromise: Promise<string> | undefined = undefined;
  try {
    audioUriPromise = fetchAudioAndCache(
      cacheKey,
      voiceName,
      normalizedText,
      signal
    );

    pendingRequests.set(cacheKey, {
      promise: audioUriPromise,
      signal,
    });

    return await audioUriPromise;
  } finally {
    if (pendingRequests.get(cacheKey)?.promise === audioUriPromise) {
      pendingRequests.delete(cacheKey);
    }
  }
}

/**
 * @internal
 * Fetch TTS audio from backend and save to cache, returning the local file URI.
 * @param cacheKey The unique cache key for this TTS request
 * @param voiceName The TTS voice name to use for generation
 * @param text The text to synthesize into speech
 * @param signal Optional AbortSignal to cancel the TTS request if needed
 * @returns Promise resolving to the local file URI of the cached audio
 */
async function fetchAudioAndCache(
  cacheKey: string,
  voiceName: VoiceNameType,
  text: string,
  signal?: AbortSignal
): Promise<string> {
  const audioBytes = await generateTtsSpeech({
    voiceName,
    text,
    signal,
  });

  return saveAudioToCache(cacheKey, audioBytes);
}
