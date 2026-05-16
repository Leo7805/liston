/**
 * This module provides:
 *  - Memory cache (fast lookup: key → fileUri)
 *  - File-system cache (persistent storage)
 *  - Stable cache keys for TTS audio
 *
 * It stores audio files under:
 *    Paths.cache + "liston-audio/"
 *
 * And returns a local file URI that can be used by expo-audio.
 */

import { Directory, File, Paths } from 'expo-file-system';
import { LanguageCodeType, VoiceNameType } from '@/types/tts';

/**
 * @internal
 * In-memory cache: key → fileUri
 * */
const memoryCache = new Map<string, string>();

/**
 * @internal
 * Directory where audio files will be stored (File cache directory)
 * */
const fileCacheDir = new Directory(Paths.cache, 'liston-audio');

/**
 * @internal
 * Input shape for generating a unique audio cache key
 * */
type CreateAudioCacheKeyParams = {
  lang: LanguageCodeType;
  voiceName: VoiceNameType;
  text: string;
};

/**
 * Create a stable cache key for TTS audio.
 * Example: "en-US:Jenny:Hello world"
 */
export function createAudioCacheKey({
  lang,
  voiceName,
  text,
}: CreateAudioCacheKeyParams): string {
  return `${lang}:${voiceName}:${text.trim()}`;
}

/**
 * @internal
 * Ensure the cache directory exists, create if not exists
 */
async function prepareCacheDir() {
  fileCacheDir.create({ idempotent: true, intermediates: true });
}

/**
 * @internal
 * Create a File object for a cached audio file
 */
function resolveAudioFile(key: string): File {
  const safeKey = encodeURIComponent(key);

  return new File(fileCacheDir, `${safeKey}.mp3`);
}

/**
 * Get cached audio file URI from:
 * memory cache --> file-system cache.
 */
export async function getCachedAudioUri(
  key: string
): Promise<string | undefined> {
  // 1. Check in-memory cache first
  const memoryUri = memoryCache.get(key);

  if (memoryUri) {
    return memoryUri;
  }

  // 2. Check file-system cache
  await prepareCacheDir(); // Ensure cache directory exists
  const file = resolveAudioFile(key);

  if (!file.exists) {
    return undefined;
  }

  // Cache hit: store the "file uri" in memory for faster future access
  memoryCache.set(key, file.uri);

  return file.uri;
}

/**
 * Save audio Blob into local file cache and return playable file URI.
 */
export async function saveAudioToCache(
  key: string,
  audioBytes: Uint8Array
): Promise<string> {
  await prepareCacheDir();

  const file = resolveAudioFile(key);

  file.write(audioBytes);

  memoryCache.set(key, file.uri);

  return file.uri;
}
