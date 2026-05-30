import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SentenceItem } from '@/features/sentences/sentence.types';

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

/**
 * @internal
 * Store the last playing sentence to persist playback state across app restarts.
 */
const LAST_PLAYING_SENTENCE_KEY = 'liston:lastPlayingSentence';

export async function isSentencesInitialized(): Promise<boolean> {
  const flag = await AsyncStorage.getItem(SENTENCE_INITIALIZED_KEY);
  return flag === 'true';
}

export async function markSentencesAsInitialized(): Promise<void> {
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

/**
 * Store the last playing sentence to persist playback state across app restarts.
 */
export async function saveLastPlayingSentenceToStorage(
  sentence: SentenceItem | null
): Promise<void> {
  if (sentence) {
    await AsyncStorage.setItem(
      LAST_PLAYING_SENTENCE_KEY,
      JSON.stringify(sentence)
    );
  } else {
    await AsyncStorage.removeItem(LAST_PLAYING_SENTENCE_KEY);
  }
}

export async function getLastPlayingSentenceFromStorage(): Promise<SentenceItem | null> {
  const raw = await AsyncStorage.getItem(LAST_PLAYING_SENTENCE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    return parsed as SentenceItem;
  } catch (e) {
    console.warn('Failed to parse last playing sentence from storage.', e);
    return null;
  }
}

export async function clearLastPlayingSentenceFromStorage(): Promise<void> {
  await AsyncStorage.removeItem(LAST_PLAYING_SENTENCE_KEY);
}
