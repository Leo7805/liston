export type SentenceItem = {
  id: string;

  original: string;
  translation: string;

  length?: number;

  playCount?: number; // max of original and translation play counts
  stars?: number;
  lastPlayedAt?: number;

  isFavorite?: boolean;

  groupId?: string;
  groupName?: string;
  tags?: string[];

  createdAt?: number;
  updatedAt?: number;
};
