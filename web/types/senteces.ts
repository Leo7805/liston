export type SentenceItem = {
  id: string;
  en: string;
  zh: string;
  playCount?: number; // optional play count for tracking how many times this sentence has been played
};

export type PlaybackMode =
  | 'sequential'
  | 'shuffle'
  | 'repeat_one'
  | 'least_played'
  | 'balanced';
