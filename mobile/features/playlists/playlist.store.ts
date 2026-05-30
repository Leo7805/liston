import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Playlist } from '@/features/playlists/playlist.types';
import * as playlistService from '@/features/playlists/playlist.service';
import { useSentenceStore } from '@/features/sentences/sentence.store';
import { validateId } from '@/global/utils/validation';
import { handleError } from '@/global/utils/helpers';
import { SentenceItem } from '@/features/sentences/sentence.types';

type PlaylistState = {
  playlists: Playlist[]; // List of all playlists
  currentPlaylistId: string; // ID of the currently selected playlist

  setPlaylists: (playlists: Playlist[]) => void; // Set the entire list of playlists (used for initialization and updates)

  setCurrentPlaylistId: (playlistId: string) => void; // Select a playlist by its ID
  createPlaylist: (name: string) => void;
  renameCurrentPlaylist: (newName: string) => void;
  deleteCurrentPlaylist: () => void;
  addSentencesToCurrentPlaylist: (sentenceIds: string[]) => void;
  removeSentencesFromCurrentPlaylist: (sentenceIds: string[]) => void;
  removeSentencesFromAllPlaylists: (
    sentenceIds: string[],
    sentences: SentenceItem[]
  ) => void;
};

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => {
      const defaultPlaylist = playlistService.createDefaultPlaylist();

      return {
        playlists: [defaultPlaylist],
        currentPlaylistId: defaultPlaylist.id,

        setPlaylists: (playlists: Playlist[]) => {
          set({ playlists });
        },

        setCurrentPlaylistId: (playlistId: string) => {
          try {
            validateId(playlistId, get().playlists);

            set({ currentPlaylistId: playlistId });
          } catch (error) {
            handleError(error);
          }
        },

        createPlaylist: (name: string) => {
          try {
            const { playlists } = get();

            const newPlaylist = playlistService.createPlaylist(name, playlists);

            set({
              playlists: [...playlists, newPlaylist],
              currentPlaylistId: newPlaylist.id, // Automatically select the newly created playlist
            });
          } catch (error) {
            handleError(error);
          }
        },

        renameCurrentPlaylist: (newName: string) => {
          try {
            const { playlists, currentPlaylistId } = get();

            const updatedPlaylists = playlistService.renamePlaylist(
              currentPlaylistId,
              newName,
              playlists
            );

            set({
              playlists: updatedPlaylists,
            });
          } catch (error) {
            handleError(error);
          }
        },

        deleteCurrentPlaylist: () => {
          try {
            const { playlists, currentPlaylistId } = get();

            const updatedPlaylists = playlistService.deletePlaylist(
              currentPlaylistId,
              playlists
            );

            set({
              playlists: updatedPlaylists,
              currentPlaylistId: updatedPlaylists[0]?.id || defaultPlaylist.id, // Select the first playlist or the default if none left
            });
          } catch (error) {
            handleError(error);
          }
        },

        addSentencesToCurrentPlaylist: (sentenceIds: string[]) => {
          try {
            const { playlists, currentPlaylistId } = get();
            const { sentences } = useSentenceStore.getState(); // Get the list of sentences for validation

            const updatedPlaylists = playlistService.addSentencesToPlaylist(
              sentenceIds,
              currentPlaylistId,
              sentences, // Pass the list of sentences for validation
              playlists
            );

            set({ playlists: updatedPlaylists });
          } catch (error) {
            handleError(error);
          }
        },

        removeSentencesFromCurrentPlaylist: (sentenceIds: string[]) => {
          try {
            const { playlists, currentPlaylistId } = get();

            const { sentences } = useSentenceStore.getState(); // Get the list of sentences for validation

            const updatedPlaylists =
              playlistService.removeSentencesFromPlaylist(
                sentenceIds,
                currentPlaylistId,
                sentences,
                playlists
              );

            set({ playlists: updatedPlaylists });
          } catch (error) {
            handleError(error);
          }
        },

        removeSentencesFromAllPlaylists: (
          sentenceIds: string[],
          sentences: SentenceItem[]
        ) => {
          try {
            const { playlists } = get();

            const updatedPlaylists =
              playlistService.removeSentencesFromAllPlaylists(
                sentenceIds,
                sentences,
                playlists
              );

            set({ playlists: updatedPlaylists });
          } catch (error) {
            handleError(error);
          }
        },
      };
    },
    {
      name: 'liston:playlist-storage', // name of the item in storage
      storage: createJSONStorage(() => AsyncStorage), // use AsyncStorage for React Native
      partialize: (state) => ({
        playlists: state.playlists,
        currentPlaylistId: state.currentPlaylistId,
      }), // Only persist the playlists and currentPlaylistId
    }
  )
);
