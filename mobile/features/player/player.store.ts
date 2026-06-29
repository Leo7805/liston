import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  PlaybackMode,
  PlaybackState,
  type PlaybackStateType,
} from '@/features/player/player.types';

type PlayerState = {
  playlistItemId: string | null; // ID of the currently playing playlist item (contains sentenceId + repeatCount)

  playbackState: PlaybackStateType; // Current playback state (idle, playing, paused, etc.)
  playbackMode: PlaybackMode; // Current playback mode (sequential, shuffle, etc.)

  /* Derived state */
  isPlaying: boolean; // Whether audio is currently playing (derived from playbackState)

  play: (itemId: string | null) => void; // Play a specific sentence by its ID, or null to stop playing
  togglePlay: () => void; // Toggle between play and pause
  pause: () => void;
  resume: () => void;
  stop: () => void;
  idle: () => void;
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      playlistItemId: null,
      playbackState: PlaybackState.Idle,
      playbackMode: 'sequential',
      isPlaying: false,

      play: (itemId) => {
        set({
          playlistItemId: itemId,
          playbackState: PlaybackState.Playing,
          isPlaying: itemId !== null,
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
        const { playlistItemId } = get();
        if (playlistItemId) {
          set({ playbackState: PlaybackState.Playing, isPlaying: true });
        }
      },

      stop: () => {
        set({
          playlistItemId: null,
          playbackState: PlaybackState.Stopped,
          isPlaying: false,
        });
      },

      idle: () => {
        set({
          playlistItemId: null,
          playbackState: PlaybackState.Idle,
          isPlaying: false,
        });
      },
    }),
    {
      name: 'liston:player-store', // name of the item in storage
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
      partialize: (state) => ({
        playlistItemId: state.playlistItemId,
        playbackMode: state.playbackMode,
      }),
    }
  )
);
