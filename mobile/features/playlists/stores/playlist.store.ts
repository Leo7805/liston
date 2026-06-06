import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Playlist } from '@/features/playlists/playlist.types';
import * as playlistService from '@/features/playlists/playlist.service';
import { validateId } from '@/global/utils/validation';
import { handleError } from '@/global/utils/helpers';
import { SentenceItem } from '@/features/sentences/sentence.types';

type PlaylistState = {
  playlists: Playlist[]; // List of all playlists
  currentPlaylistId: string | null; // ID of the currently selected playlist

  /**
   * Set the entire list of playlists (used for initialization and updates)
   * @param playlists
   */
  setPlaylists: (playlists: Playlist[]) => void;

  /**
   * Select a playlist by its ID. This will update the currentPlaylistId in the state
   * @param playlistId
   * @returns
   */
  selectPlaylist: (playlistId: string | null) => void;

  createPlaylist: (name: string) => void;
  renameCurrentPlaylist: (newName: string) => void;
  deleteCurrentPlaylist: () => void;
  // addSentencesToCurrentPlaylist: (
  //   sentenceIds: string[],
  //   sentences: SentenceItem[]
  // ) => void;
  addSentencesToPlaylist: (
    sentenceIds: string[],
    targetPlaylistId: string,
    sentences: SentenceItem[]
  ) => void;

  /**
   * Remove sentences from a playlist by their IDs. It will not delete the sentences from the sentence library, only from the specified playlist.
   * @param sentenceIds The IDs of the sentences to remove from the playlist
   * @param targetPlaylistId  The ID of the playlist to remove the sentences from
   * @param sentences  List of all sentences for validation
   * @returns
   */
  removeSentencesFromPlaylist: (
    sentenceIds: string[],
    targetPlaylistId: string,
    sentences: SentenceItem[]
  ) => void;

  /**
   * Remove playlist items from target playlist. It will not delete the sentences from the sentence library, only from the specified playlist.
   * @param playlistItemIds The IDs of the playlist items to remove from the playlist
   * @param targetPlaylistId The ID of the playlist to remove the playlist items from
   * @returns
   */
  removeItemsFromPlaylist: (
    playlistItemIds: string[],
    targetPlaylistId: string
  ) => void;

  /**
   * Remove sentences from all playlists. This is used when sentences are deleted from the sentence store, to ensure that they are also removed from any playlists they belong to. The function takes the IDs of the sentences to remove and updates all playlists accordingly.
   * @param sentenceIds  IDs of the sentences to remove from all playlists
   * @param sentences  List of all sentences for validation
   * @returns
   */
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

        selectPlaylist: (playlistId: string | null) => {
          try {
            if (playlistId) {
              validateId(playlistId, get().playlists);
            }

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

            if (!currentPlaylistId) {
              throw new Error('No playlist selected to rename');
            }

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

            if (!currentPlaylistId) {
              throw new Error('No playlist selected to delete');
            }

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

        // addSentencesToCurrentPlaylist: (
        //   sentenceIds: string[],
        //   sentences: SentenceItem[]
        // ) => {
        //   try {
        //     const { playlists, currentPlaylistId } = get();

        //     if (!currentPlaylistId) {
        //       throw new Error('No playlist selected to add sentences to');
        //     }

        //     const updatedPlaylists = playlistService.addSentencesToPlaylist(
        //       sentenceIds,
        //       currentPlaylistId,
        //       sentences, // Pass the list of sentences for validation
        //       playlists
        //     );

        //     set({ playlists: updatedPlaylists });
        //   } catch (error) {
        //     handleError(error);
        //   }
        // },

        addSentencesToPlaylist: (
          sentenceIds: string[],
          targetPlaylistId: string,
          sentences: SentenceItem[]
        ) => {
          try {
            const { playlists } = get();

            const updatedPlaylists = playlistService.addSentencesToPlaylist(
              sentenceIds,
              targetPlaylistId,
              sentences, // Pass the list of sentences for validation
              playlists
            );

            set({ playlists: updatedPlaylists });
          } catch (error) {
            handleError(error);
          }
        },

        removeSentencesFromPlaylist: (
          sentenceIds: string[],
          targetPlaylistId: string,
          sentences: SentenceItem[]
        ) => {
          try {
            const { playlists } = get();

            if (!targetPlaylistId) {
              throw new Error('No playlist selected to remove sentences from');
            }

            const updatedPlaylists =
              playlistService.removeSentencesFromPlaylist(
                sentenceIds,
                targetPlaylistId,
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

        removeItemsFromPlaylist(
          playlistItemIds: string[],
          targetPlaylistId: string
        ) {
          try {
            const { playlists } = get();

            if (!targetPlaylistId) {
              throw new Error('No playlist selected to remove items from');
            }

            const updatedPlaylists = playlistService.removeItemsFromPlaylist(
              playlistItemIds,
              targetPlaylistId,
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
