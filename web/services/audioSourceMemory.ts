// Simple in-memory LRU cache for generated audio blobs.

const MAX_AUDIO_CACHE_SIZE = 200; // Max number of entries in memory cache
const audioCache = new Map<string, Blob>();

/**
 * Retrieves a cached audio blob and updates its LRU position in memory.
 *
 * When an audio is found, it's moved to the end (most recently used).
 * If not found, returns undefined.
 *
 * @param key - The cache key created by createAudioCacheKey()
 * @returns The cached Blob, or undefined if not found
 */
export function getSpeechFromMemory(key: string): Blob | undefined {
  const audio = audioCache.get(key);

  if (!audio) return undefined;

  // LRU cache
  audioCache.delete(key);
  audioCache.set(key, audio);
  return audio;
}

/**
 * Stores an audio blob in the memory cache.
 *
 * If the cache exceeds MAX_AUDIO_CACHE_SIZE (200 entries), the oldest entries
 * are automatically removed until size is within limit.
 *
 * @param key - The cache key created by createAudioCacheKey()
 * @param audioBlob - The audio Blob to cache
 */
export function setSpeechToMemory(key: string, audioBlob: Blob): void {
  audioCache.set(key, audioBlob);
  trimSpeechCache();
}

/**
 * Clears all cached audio blobs.
 *
 * Use this when reloading sentences, switching languages, or freeing memory.
 * This is a destructive operation and cannot be undone.
 */
export function clearSpeechMemory(): void {
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
export function getSpeechMemorySize(): number {
  return audioCache.size;
}

/**
 * Deletes a single cached audio entry by its key.
 *
 * Only removes the exact key match.
 *
 * @param key - The cache key to delete
 */
export function deleteSpeechFromMemory(key: string): void {
  audioCache.delete(key);
}

/**
 * Trims the audio cache to MAX_AUDIO_CACHE_SIZE by removing oldest entries.
 *
 * Called automatically after each setSpeechAudioToMemory() call.
 * Uses FIFO (First-In-First-Out) deletion: removes the oldest entry first.
 * Entries are re-ordered when accessed via getSpeechAudioFromMemory() (LRU behavior).
 *
 * The safety check for !oldestKey should theoretically never happen,
 * but is kept as a defensive measure.
 *
 * @internal This is a private function, not exported.
 */
function trimSpeechCache(): void {
  while (audioCache.size > MAX_AUDIO_CACHE_SIZE) {
    // Remove the oldest entry (first inserted)
    const oldestKey = audioCache.keys().next().value;

    if (!oldestKey) return; // Safety check

    audioCache.delete(oldestKey);
  }
}
