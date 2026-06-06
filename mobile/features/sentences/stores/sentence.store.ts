import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SentenceItem,
  SentenceGroup,
} from '@/features/sentences/sentence.types';
import * as sentenceService from '@/features/sentences/sentence.service';
import { handleError } from '@/global/utils/helpers';
import { validateId } from '@/global/utils/validation';

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
   * Add a new sentence to the sentence library. The sentence will be added to the specified group or the default group if no groupId is provided.
   * @param input An object containing the original text, translation text, and an optional groupId for the new sentence.
   * @return void
   */
  addSentence: (input: AddSentenceInputType) => void;

  /**
   * Updates an existing sentence in the sentence library.
   * @param input An object containing the updated original text, translation text, and the ID of the sentence to update.
   * @return void
   */
  updateSentence: (input: UpdateSentenceInputType) => void;

  /**
   * Deletes sentences from the sentence library only. It will not delete the sentences from any playlists they belong to.
   * @param sentenceIds The IDs of the sentences to delete.
   * @return void
   */
  deleteSentencesFromLibrary: (sentenceIds: string[]) => void;

  /**
   * Move multiple sentences to a different group
   * @param sentenceIds The IDs of the sentences to move
   * @param targetGroupId The ID of the group to move the sentences to
   * @return void
   */
  moveSentences: (sentenceIds: string[], targetGroupId: string) => void;

  /**
   * Select a sentence group to view. Passing null will select the "All Groups" view which shows sentences from all groups.
   * @param groupId The ID of the group to select
   * @return void
   */
  selectGroup: (groupId: string | null) => void;

  /**
   * Delete a sentence group if it's empty and not the default group.
   * @param groupId The ID of the group to delete
   * @return void
   */
  deleteGroup: (groupId: string) => void;

  /**
   * Create a new sentence group with the given name if it's not the default group, it will check if the name is valid and not already taken by another group
   * @param name The name of the new group
   * @return void
   */
  createGroup: (name: string) => void;

  /**
   * Rename a sentence group if it's not the default group, it will check if the new name is valid and not already taken by another group
   * @param groupId The ID of the group to rename
   * @param newName The new name for the group
   * @returns void
   */
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

        deleteSentencesFromLibrary: (sentenceIds: string[]) => {
          try {
            const { sentences, groups } = get();

            // Remove the sentences from the store and get the updated sentences and groups after deletion
            const { sentences: updatedSentences, groups: updatedGroups } =
              sentenceService.deleteSentences(sentenceIds, sentences, groups);

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
