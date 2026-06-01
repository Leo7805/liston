import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SentenceItem, SentenceGroup } from './sentence.types';
import * as sentenceService from './sentence.service';
import { handleError } from '@/global/utils/helpers';
import { validateId } from '@/global/utils/validation';
import { usePlaylistStore } from '@/features/playlists/playlist.store';

type AddSentenceInputType = Omit<sentenceService.CreateSentenceInput, 'groups'>;

type UpdateSentenceInputType = Omit<
  sentenceService.UpdateSentenceInput,
  'sentences' | 'groups'
>;

type SentenceState = {
  sentences: SentenceItem[]; // List of all sentences
  groups: SentenceGroup[];
  currentGroupId: string | null; // ID of the currently selected group (not playing Item)

  /**
   * Add a new sentence to the store. This function takes an input object containing the original and translation text, as well as an optional groupId to specify which group the sentence belongs to. If groupId is not provided, the sentence will be added to the default group. The function creates a new SentenceItem using the createSentenceItem factory function and adds it to the sentences array in the store. It also sets the currentGroupId to the group of the newly added sentence.
   * @param input An object containing the original text, translation text, and an optional groupId for the new sentence.
   */
  addSentence: (input: AddSentenceInputType) => void;

  /**
   * Updates an existing sentence in the store. This function takes an input object containing the updated original and translation text, as well as the ID of the sentence to update. The function validates the input and updates the sentence in the sentences array in the store.
   * @param input An object containing the updated original text, translation text, and the ID of the sentence to update.
   */
  updateSentence: (input: UpdateSentenceInputType) => void;

  /**
   * Deletes sentences from the store. This function takes the IDs of the sentences to delete and removes them from the sentences array in the store. It also removes the sentences from any playlists they belong to and updates the groups & playlists accordingly.
   * @param sentenceIds The IDs of the sentences to delete.
   */
  deleteSentences: (sentenceIds: string[]) => void;

  // Move multiple sentences to a different group
  moveSentences: (sentenceIds: string[], targetGroupId: string) => void;

  selectGroup: (groupId: string | null) => void;
  deleteGroup: (groupId: string) => void;
  createGroup: (name: string) => void;
  renameGroup: (groupId: string, newName: string) => void;
};

export const useSentenceStore = create<SentenceState>()(
  persist(
    (set, get) => {
      const defaultSentenceGroup = sentenceService.createDefaultGroup();
      const mockSentences = sentenceService.loadMockSentences();

      return {
        sentences: mockSentences,
        groups: [defaultSentenceGroup],
        currentGroupId: null, // Start with "All Groups" view by default

        addSentence: (input) => {
          try {
            const { sentences, groups } = get();

            const updatedSentence = sentenceService.createSentence({
              ...input,
              groups,
            });

            set({
              sentences: [updatedSentence, ...sentences], // Add the new sentence to the beginning of the list for better visibility
              currentGroupId: updatedSentence.groupId,
            });
          } catch (error) {
            handleError(error);
          }
        },

        updateSentence: (input) => {
          try {
            const { sentences, groups } = get();

            const updatedSentences = sentenceService.updateSentence({
              ...input,
              sentences,
              groups,
            });

            set({
              sentences: updatedSentences,
              currentGroupId: input.groupId,
            });
          } catch (error) {
            handleError(error);
          }
        },

        deleteSentences: (sentenceIds: string[]) => {
          try {
            const { sentences, groups } = get();

            // Remove the sentences from the store and get the updated sentences and groups after deletion
            const { sentences: updatedSentences, groups: updatedGroups } =
              sentenceService.deleteSentences(sentenceIds, sentences, groups);

            // Also remove the sentences from any playlists it belongs to
            usePlaylistStore
              .getState()
              .removeSentencesFromAllPlaylists(sentenceIds, sentences);

            set({
              sentences: updatedSentences,
              groups: updatedGroups,
            });
          } catch (error) {
            handleError(error);
          }
        },

        moveSentences: (sentenceIds, targetGroupId) => {
          try {
            const { sentences, groups } = get();

            const updatedSentences = sentenceService.moveSentences(
              sentenceIds,
              targetGroupId,
              sentences,
              groups
            );

            set({
              sentences: updatedSentences,
              currentGroupId: targetGroupId,
            });
          } catch (error) {
            handleError(error);
          }
        },

        selectGroup: (groupId: string | null) => {
          try {
            if (groupId === null) {
              set({ currentGroupId: null });
              return;
            }

            validateId(groupId, get().groups);

            set({ currentGroupId: groupId });
          } catch (error) {
            handleError(error);
          }
        },

        deleteGroup: (groupId: string) => {
          try {
            const { sentences, groups } = get();

            const updatedGroups = sentenceService.deleteGroup(
              groupId,
              groups,
              sentences
            );

            set({
              groups: updatedGroups,
              currentGroupId:
                get().currentGroupId === groupId
                  ? updatedGroups[0].id
                  : get().currentGroupId, // If the deleted group is currently selected, switch to the first available group
            });
          } catch (error) {
            handleError(error);
          }
        },

        createGroup: (name: string) => {
          try {
            const { groups } = get();

            const newGroup = sentenceService.createGroup(name, groups);

            set({
              groups: [...groups, newGroup],
              currentGroupId: newGroup.id, // Automatically select the newly created group
            });
          } catch (error) {
            handleError(error);
          }
        },

        renameGroup: (groupId: string, newName: string) => {
          try {
            validateId(groupId, get().groups);

            const { groups } = get();

            const updatedGroups = sentenceService.renameGroup(
              groupId,
              newName,
              groups
            );

            set({
              groups: updatedGroups,
              currentGroupId: groupId, // Keep the renamed group selected
            });
          } catch (error) {
            handleError(error);
          }
        },
      };
    },

    {
      name: 'liston:sentence-store', // name of the item in storage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        sentences: state.sentences,
        groups: state.groups,
        currentGroupId: state.currentGroupId,
      }),
    }
  )
);
