import { SentenceItem } from './sentence.types';

export const sortMode = {
  // Created time
  createdAsc: 'createdAsc',
  createdDesc: 'createdDesc',

  // Updated time
  updatedAsc: 'updatedAsc',
  updatedDesc: 'updatedDesc',

  // Last played time
  lastPlayedAsc: 'lastPlayedAsc',
  lastPlayedDesc: 'lastPlayedDesc',

  // Play count
  playCountAsc: 'playCountAsc',
  playCountDesc: 'playCountDesc',

  // Length (short/long)
  lengthAsc: 'lengthAsc', // shortFirst
  lengthDesc: 'lengthDesc', // longFirst

  // Alphabetical
  alphabeticalAsc: 'alphabeticalAsc', // A → Z
  alphabeticalDesc: 'alphabeticalDesc', // Z → A

  // Non-directional modes
  originalOrder: 'originalOrder',
  // random: 'random',
  // manual: 'manual',
} as const;

export type SortMode = keyof typeof sortMode;

export function getSortedSentences(
  sentences: SentenceItem[],
  sortMode: SortMode
) {
  // Implementation for sorting sentences based on the selected mode
}
