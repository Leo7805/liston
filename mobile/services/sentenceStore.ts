import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SentenceItem } from '@/types/sentences';

/**
 * Store sentence and its metadata in AsyncStorage
 * */

/** Store a sentence list under this key (better for bulk operations, such as sorting) */
const SENTENCE_STORAGE_KEY = 'liston:sentences';

/**
 * Load all sentences from AsyncStorage.
 *
 * Returns an empty array if:
 * - nothing is stored yet, or
 * - stored data is invalid JSON.
 */
export async function getSentences(): Promise<SentenceItem[]> {
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
 * Persist the full sentence list to AsyncStorage.
 *
 * This overwrites any previously stored sentences.
 */
export async function saveSentences(sentences: SentenceItem[]): Promise<void> {
  await AsyncStorage.setItem(SENTENCE_STORAGE_KEY, JSON.stringify(sentences));
}

/**
 * Add a new sentence to the beginning of the list and persist it.
 *
 * Returns the updated sentence list.
 */
export async function addSentence(
  sentence: SentenceItem
): Promise<SentenceItem[]> {
  const sentences = await getSentences();
  const updated = [sentence, ...sentences];
  await saveSentences(updated);
  return updated;
}

/**
 * Update a sentence by id with a partial patch and persist the result.
 *
 * Automatically updates the `updatedAt` timestamp.
 *
 * Returns the updated sentence list.
 */
export async function updateSentence(
  id: string,
  patch: Partial<Omit<SentenceItem, 'id' | 'createdAt'>>
): Promise<SentenceItem[]> {
  const sentences = await getSentences();
  const updated = sentences.map((s) => {
    if (s.id === id) {
      return { ...s, ...patch, updatedAt: Date.now() };
    }
    return s;
  });
  await saveSentences(updated);
  return updated;
}

/**
 * Delete a sentence by id and persist the result.
 *
 * Returns the updated sentence list.
 */
export async function deleteSentence(id: string): Promise<SentenceItem[]> {
  const sentences = await getSentences();
  const updated = sentences.filter((s) => s.id !== id);
  await saveSentences(updated);
  return updated;
}
