export type SentenceItem = {
  id: string;
  en: string;
  zh: string;
  playCount?: number; // Used by least-played and balanced playback modes.
};

export type PlaybackMode =
  | 'sequential'
  | 'shuffle'
  | 'least_played'
  | 'balanced';
