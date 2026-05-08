import type { LanguageCodeType } from '@/types/languages';

// Simple in-memory LRU cache for generated audio blobs.

const MAX_AUDIO_CACHE_SIZE = 100; // Max number of entries in cache
const audioCache = new Map<string, Blob>();

type AudioCacheKeyInput = {
  lang: LanguageCodeType;
  voiceName: string;
  text: string;
};

/**
 * Creates a unique cache key for an audio blob.
 * @param lang - The language code (e.g., 'en', 'zh')
 * @param voiceName - The name of the voice to be used for TTS (e.g., 'en-US-Wavenet-D')
 * @param text - The text to be synthesized
 * @returns A unique cache key in the format "lang:voiceName:text"
 */
export function createAudioCacheKey({
  lang,
  voiceName,
  text,
}: AudioCacheKeyInput): string {
  return `${lang}:${voiceName}:${text.trim()}`;
}

/**
 * Retrieves a cached audio blob and updates its LRU position.
 *
 * When an audio is found, it's moved to the end (most recently used).
 * If not found, returns undefined.
 *
 * @param key - The cache key created by createAudioCacheKey()
 * @returns The cached Blob, or undefined if not found
 */
export function getCachedAudio(key: string): Blob | undefined {
  const audio = audioCache.get(key);

  if (!audio) return undefined;

  // LRU cache
  audioCache.delete(key);
  audioCache.set(key, audio);
  return audio;
}

/**
 * Stores an audio blob in the cache.
 *
 * If the cache exceeds MAX_AUDIO_CACHE_SIZE (100 entries), the oldest entries
 * are automatically removed until size is within limit.
 *
 * @param key - The cache key created by createAudioCacheKey()
 * @param audioBlob - The audio Blob to cache
 */
export function setCachedAudio(key: string, audioBlob: Blob): void {
  audioCache.set(key, audioBlob);
  trimAudioCache();
}

/**
 * Clears all cached audio blobs.
 *
 * Use this when reloading sentences, switching languages, or freeing memory.
 * This is a destructive operation and cannot be undone.
 */
export function clearAudioCache(): void {
  audioCache.clear();
}

/**
 * Returns the current number of entries in the audio cache.
 *
 * This is a non-mutating query - it does not affect LRU ordering.
 * Useful for debugging and monitoring cache usage.
 *
 * @returns The number of cached audio entries
 */
export function getAudioCacheSize(): number {
  return audioCache.size;
}

/**
 * Deletes a single cached audio entry by its key.
 *
 * Only removes the exact key match.
 *
 * @param key - The cache key to delete
 */
export function deleteCachedAudio(key: string): void {
  audioCache.delete(key);
}

/**
 * Trims the audio cache to MAX_AUDIO_CACHE_SIZE by removing oldest entries.
 *
 * Called automatically after each setCachedAudio() call.
 * Uses FIFO (First-In-First-Out) deletion: removes the oldest entry first.
 * Entries are re-ordered when accessed via getCachedAudio() (LRU behavior).
 *
 * The safety check for !oldestKey should theoretically never happen,
 * but is kept as a defensive measure.
 *
 * @internal This is a private function, not exported.
 */
function trimAudioCache(): void {
  while (audioCache.size > MAX_AUDIO_CACHE_SIZE) {
    // Remove the oldest entry (first inserted)
    const oldestKey = audioCache.keys().next().value;

    if (!oldestKey) return; // Safety check

    audioCache.delete(oldestKey);
  }
}
