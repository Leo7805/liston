import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SentenceItem } from '@/types/sentences';

/**
 * Store sentence and its metadata in AsyncStorage
 * */

/**
 * @internal
 * Store a sentence list under this key (better for bulk operations, such as sorting)
 * */
const SENTENCE_STORAGE_KEY = 'liston:sentences';

/**
 * @internal
 * A flag to indicate whether sentences have been initialized in storage.
 * This can be used to determine whether to load mock sentences on first app launch.
 */
const SENTENCE_INITIALIZED_KEY = 'liston:sentences:initialized';

export async function hasInitializedSentences(): Promise<boolean> {
  const flag = await AsyncStorage.getItem(SENTENCE_INITIALIZED_KEY);
  return flag === 'true';
}

export async function setInitializedSentences(): Promise<void> {
  await AsyncStorage.setItem(SENTENCE_INITIALIZED_KEY, 'true');
}

/**
 * Load all sentences from AsyncStorage.
 *
 * Returns an empty array if:
 * - nothing is stored yet, or
 * - stored data is invalid JSON.
 */
export async function getSentencesFromStorage(): Promise<SentenceItem[]> {
  const raw = await AsyncStorage.getItem(SENTENCE_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SentenceItem[]) : [];
  } catch (e) {
    console.warn(
      'Failed to parse sentences from storage, returning empty list.',
      e
    );
    return [];
  }
}

/**
 * @internal
 * Persist the full sentence list to AsyncStorage.
 * This overwrites any previously stored sentences.
 */
export async function saveSentencesToStorage(
  sentences: SentenceItem[]
): Promise<void> {
  await AsyncStorage.setItem(SENTENCE_STORAGE_KEY, JSON.stringify(sentences));
}

/**
 * Add a new sentence to the beginning of the list and persist it.
 *
 * Returns the updated sentence list.
 */
export async function addSentenceToStorage(
  sentence: SentenceItem
): Promise<SentenceItem[]> {
  const sentences = await getSentencesFromStorage();
  const updated = [sentence, ...sentences];
  await saveSentencesToStorage(updated);
  return updated;
}

/**
 * Update a sentence by id with a partial patch and persist the result.
 *
 * Automatically updates the `updatedAt` timestamp.
 *
 * Returns the updated sentence list.
 */
export async function updateSentenceInStorage(
  id: string,
  patch: Partial<Omit<SentenceItem, 'id' | 'createdAt'>>
): Promise<SentenceItem[]> {
  const sentences = await getSentencesFromStorage();
  const updated = sentences.map((s) => {
    if (s.id === id) {
      return { ...s, ...patch, updatedAt: Date.now() };
    }
    return s;
  });
  await saveSentencesToStorage(updated);
  return updated;
}

/**
 * Delete a sentence by id and persist the result.
 *
 * Returns the updated sentence list.
 */
export async function deleteSentenceFromStorage(
  id: string
): Promise<SentenceItem[]> {
  const sentences = await getSentencesFromStorage();
  const updated = sentences.filter((s) => s.id !== id);
  await saveSentencesToStorage(updated);
  return updated;
}

/**
 * Clear all sentences from storage. Mainly for testing purposes.
 */
export async function clearSentencesFromStorage(): Promise<void> {
  await AsyncStorage.removeItem(SENTENCE_STORAGE_KEY);
}

/**
 * Clear all sentences and the initialized flag from storage. Mainly for testing purposes.
 */
export async function clearSentencesAndInitializedFlag(): Promise<void> {
  await AsyncStorage.removeItem(SENTENCE_STORAGE_KEY);
  await AsyncStorage.removeItem(SENTENCE_INITIALIZED_KEY);
}

/**
 *  Check if there are any sentences stored.
 */
export async function isSentenceStorageEmpty(): Promise<boolean> {
  const sentences = await getSentencesFromStorage();
  return sentences.length === 0;
}
