// Retrieves generated speech audio using memory cache first, then TTS as fallback.

import {
  createAudioCacheKey,
  getCachedAudio,
  setCachedAudio,
} from '@/services/audioCache';
import { generateSpeech, getVoiceName } from '@/services/ttsService';
import type { LanguageCodeType } from '@/types/languages';

type GetSpeechAudioInput = {
  lang: LanguageCodeType;
  text: string;
  signal?: AbortSignal;
};

/**
 * Gets speech audio for a sentence part.
 *
 * Checks the in-memory cache first. If there is no cached audio, it requests
 * generated speech from the TTS service and stores the result in cache.
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

  const cacheKey = createAudioCacheKey({ lang, voiceName, text });

  const cachedAudio = getCachedAudio(cacheKey);

  if (cachedAudio) {
    console.debug('[speechAudio] cache hit', {
      lang,
      voiceName,
      text,
    });

    return cachedAudio;
  }

  console.debug('[speechAudio] cache miss, requesting TTS', {
    lang,
    voiceName,
    text,
  });

  const generatedAudio = await generateSpeech(voiceName, text, signal);
  setCachedAudio(cacheKey, generatedAudio);

  console.debug('[speechAudio] cached generated audio', {
    lang,
    voiceName,
    text,
    size: generatedAudio.size,
  });

  return generatedAudio;
}
