export type SentenceItem = {
  id: string; // UUID

  original: string;
  translation: string;

  length: number; // Length of the original sentence

  playCount: number; // max of original and translation play counts
  stars: number; // 0-5
  lastPlayedAt: number | null; // timestamp in ms, null means never played

  isFavorite: boolean;

  groupId: string;
  groupName?: string;
  tags?: string[];

  createdAt: number; // timestamp in ms
  updatedAt: number; // timestamp in ms

  // extend with more fields as needed
  originalIndex?: number; // Original index in the source material (e.g. book, article, etc.)
  orderIndex?: number; // Index in the current playlist order (if applicable)
  playbackSpeed?: number; // Optional custom playback speed for this sentence
  notes?: string; // Optional user notes about this sentence
  source?: string; // Optional source/context for the sentence (e.g. book, conversation, etc.)
  difficultyLevel?: 'easy' | 'medium' | 'hard'; // Optional difficulty level for the sentence
};

/**
 * Represents a group of sentences, which can be used for categorization or organization.
 * A sentence can belong to at most one group (indicated by groupId in SentenceItem).
 */
export type SentenceGroup = {
  id: string; // UUID
  name: string;
  isSystem?: boolean; // System groups cannot be deleted
  createdAt: number; // timestamp in ms
  updatedAt: number; // timestamp in ms
};

export type SentenceSortMode = 'original' | 'playlist' | 'random';
