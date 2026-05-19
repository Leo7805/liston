import { create } from 'zustand';
import type { SentenceItem } from '@/types/sentences';
import {
  addSentenceToStorage,
  deleteSentenceFromStorage,
  getLastPlayingSentenceFromStorage,
  getSentencesFromStorage,
  isSentencesInitialized,
  markSentencesAsInitialized,
  saveLastPlayingSentenceToStorage,
  updateSentenceInStorage,
  saveSentencesToStorage,
} from '@/services/sentenceStore';
import { PlaybackState, type PlaybackStateType } from '@/types/player';
import { mockSentences } from '@/data/mockSentences';

type PlayerState = {
  playingItem: SentenceItem | null; // Currently playing sentence
  playingList: SentenceItem[]; // Currently playing list
  playbackState: PlaybackStateType; // Current playback state (idle, playing, paused, etc.)

  /* Derived state */
  isPlaying: boolean; // Whether audio is currently playing (derived from playbackState)

  playSentence: (sentence: SentenceItem | null) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  idle: () => void;

  /** Update a single item in the currently playing sentence list */
  updateItemInPlayingList: (
    id: string,
    patch: Partial<Omit<SentenceItem, 'id' | 'createdAt'>>
  ) => Promise<void>;

  /** Delete a sentence from the playback queue */
  deleteItemFromPlayingList: (id: string) => Promise<void>;

  /** Add a sentence to the playback queue */
  addItemToPlayingList: (sentence: SentenceItem) => Promise<void>;

  /**
   * Persistent using AsyncStorage
   * */
  loadLastPlayingSentence: () => Promise<void>; // Load last playing sentence from AsyncStorage
  saveLastPlayingSentence: (sentence: SentenceItem | null) => Promise<void>; // Save last playing sentence to AsyncStorage
  loadPlayingList: () => Promise<void>; // Load playing list from AsyncStorage
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  playingItem: null,
  playingList: [],
  playbackState: PlaybackState.Idle,
  isPlaying: false,

  playSentence: (sentence) => {
    set({
      playingItem: sentence,
      playbackState: PlaybackState.Playing,
      isPlaying: sentence !== null,
    });
  },

  togglePlay: () => {
    const { playbackState } = get();
    if (playbackState === PlaybackState.Playing) {
      set({ playbackState: PlaybackState.Paused, isPlaying: false });
    } else {
      set({ playbackState: PlaybackState.Playing, isPlaying: true });
    }
  },

  pause: () => {
    set({ playbackState: PlaybackState.Paused, isPlaying: false });
  },

  resume: () => {
    const { playingItem } = get();
    if (playingItem) {
      set({ playbackState: PlaybackState.Playing, isPlaying: true });
    }
  },

  stop: () => {
    set({
      playingItem: null,
      playbackState: PlaybackState.Stopped,
      isPlaying: false,
    });
  },

  idle: () => {
    set({
      playingItem: null,
      playbackState: PlaybackState.Idle,
      isPlaying: false,
    });
  },

  updateItemInPlayingList: async (id, patch) => {
    const updated = await updateSentenceInStorage(id, patch);

    set({ playingList: updated });
  },

  addItemToPlayingList: async (sentence) => {
    const updated = await addSentenceToStorage(sentence);

    set({ playingList: updated });
  },

  deleteItemFromPlayingList: async (id) => {
    const updated = await deleteSentenceFromStorage(id);

    set({ playingList: updated });
  },

  loadLastPlayingSentence: async () => {
    const lastPlayingSentence = await getLastPlayingSentenceFromStorage();

    if (lastPlayingSentence) {
      set({
        playingItem: lastPlayingSentence,
        playbackState: PlaybackState.Idle,
      });
    }
  },

  saveLastPlayingSentence: async (sentence) => {
    if (sentence) {
      await saveLastPlayingSentenceToStorage(sentence);
    }
  },

  loadPlayingList: async () => {
    const initialized = await isSentencesInitialized();

    if (!initialized) {
      await saveSentencesToStorage(mockSentences);

      set({ playingList: mockSentences });

      await markSentencesAsInitialized();

      return;
    }

    const playingList = await getSentencesFromStorage();

    set({ playingList });
  },
}));
