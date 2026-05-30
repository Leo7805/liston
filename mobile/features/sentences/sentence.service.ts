import type {
  SentenceItem,
  SentenceGroup,
} from '@/features/sentences/sentence.types';
import {
  validateId,
  validateNewName,
  validateItemChangeable,
  validateSentenceText,
} from '@/global/utils/validation';
import { getItemByIdOrThrow } from '@/global/utils/helpers';
import { normalizeText } from '@/global/utils/text';
import { AppError } from '@/global/errors/AppError';
import { t } from '@/global/i18n/t';
import { mockSentences } from '@/data/mockSentences';
import { createId } from '@/global/utils/id';

export const DEFAULT_GROUP_ID = 'default';

/**
 * Input type for adding a new sentence. This type includes the original and translation text, as well as an optional groupId to specify which group the sentence belongs to. If groupId is not provided, the sentence will be added to the default group.
 */
export type CreateSentenceInput = {
  original: string;
  translation: string;
  groupId: string;
  groups: SentenceGroup[]; // List of existing groups for validation when creating a new group
};

/**
 * Input type for updating an existing sentence. This type extends the CreateSentenceInput with an additional sentenceId property to identify which sentence is being updated, as well as a list of existing sentences for validation when updating.
 */
export type UpdateSentenceInput = CreateSentenceInput & {
  sentenceId: string;
  sentences: SentenceItem[]; // List of existing sentences for validation when updating
};

/**
 * Creates a new SentenceItem based on the provided input values. This function validates the original and translation text, as well as the groupId to ensure they are valid before creating the SentenceItem. The created SentenceItem includes properties such as id, original, translation, length, playCount, stars, lastPlayedAt, isFavorite, groupId, tags, createdAt, and updatedAt.
 * @param original The original sentence text to create.
 * @param translation The translated sentence text to create.
 * @param groupId The ID of the group to which the sentence belongs.
 * @param groups List of existing groups for validation when creating a new group.
 * @throws Will throw an error if the original or translation text is invalid, or if the specified groupId does not exist.
 * @returns The created SentenceItem.
 */
export function createSentence({
  original,
  translation,
  groupId,
  groups,
}: CreateSentenceInput): SentenceItem {
  const now = Date.now();
  const normalizedOriginal = normalizeText(original);
  const normalizedTranslation = normalizeText(translation);

  validateSentenceText(normalizedOriginal, normalizedTranslation);
  validateId(groupId, groups); // Ensure the groupId is valid

  const newSentence: SentenceItem = {
    id: createId(),

    original: normalizedOriginal,
    translation: normalizedTranslation,

    length: normalizedOriginal.length,

    playCount: 0,
    stars: 0,
    lastPlayedAt: null,

    isFavorite: false,

    groupId,

    tags: [],

    createdAt: now,
    updatedAt: now,
  };

  return newSentence;
}

/**
 * Load mock senetences
 */
export function loadMockSentences(): SentenceItem[] {
  const now = Date.now();

  const sentences = mockSentences.map((s) => {
    const normalizedOriginal = normalizeText(s.original);
    const normalizedTranslation = normalizeText(s.translation);

    validateSentenceText(normalizedOriginal, normalizedTranslation);

    return {
      id: createId(),

      original: normalizedOriginal,
      translation: normalizedTranslation,

      length: normalizedOriginal.length,

      playCount: 0,
      stars: 0,
      lastPlayedAt: null,

      isFavorite: false,

      groupId: DEFAULT_GROUP_ID,

      tags: [],

      createdAt: now,
      updatedAt: now,
    } as SentenceItem;
  });

  return sentences;
}

/**
 * Updates a sentence item with the provided input values.
 * @param param0 The input values for updating the sentence.
 * @throws Will throw an error if the original or translation text is invalid, or if the specified groupId does not exist.
 * @returns The updated sentences (not only the updated sentence).
 */
export function updateSentence({
  sentenceId,
  original,
  translation,
  groupId,
  sentences,
  groups,
}: UpdateSentenceInput): SentenceItem[] {
  const normalizedOriginal = normalizeText(original);
  const normalizedTranslation = normalizeText(translation);

  validateSentenceText(normalizedOriginal, normalizedTranslation);
  validateId(groupId, groups); // Ensure the groupId is valid

  const sentence = getItemByIdOrThrow(sentenceId, sentences);

  const updatedSentences = sentences.map((s) =>
    s.id === sentenceId
      ? {
          ...sentence,
          original: normalizedOriginal,
          translation: normalizedTranslation,
          length: normalizedOriginal.length,
          groupId,
          updatedAt: Date.now(),
        }
      : s
  );
  return updatedSentences;
}

/**
 * Delete sentences after validating that the sentence IDs exist. This function removes the specified sentences from the list of sentences and also updates the groups to reflect the deletion by updating the updatedAt timestamp of any groups that had sentences deleted from them.
 * @param sentenceIds The IDs of the sentences to delete.
 * @param sentences The list of existing sentences for validation and updating.
 * @param groups The list of existing groups for validation and updating.
 * @returns The updated list of sentences & groups after deletion.
 */
export function deleteSentences(
  sentenceIds: string[],
  sentences: SentenceItem[],
  groups: SentenceGroup[]
): { sentences: SentenceItem[]; groups: SentenceGroup[] } {
  sentenceIds.forEach((id) => validateId(id, sentences));

  const updatedSentences = sentences.filter((s) => !sentenceIds.includes(s.id));

  // Get the groupIds of the deleted sentences
  const affectedGroupIds = new Set(
    sentences.filter((s) => sentenceIds.includes(s.id)).map((s) => s.groupId)
  );

  const updatedGroups = groups.map((g) =>
    affectedGroupIds.has(g.id)
      ? {
          ...g,
          updatedAt: Date.now(),
        }
      : g
  );

  return { sentences: updatedSentences, groups: updatedGroups };
}

/**
 * Move sentences to a different group after validating the target group exists and the sentences to move exist.
 * @param sentenceIds sentences to move
 * @param targetGroupId
 * @returns The updated list of sentences after moving the specified sentences to the target group.
 */
export function moveSentences(
  sentenceIds: string[],
  targetGroupId: string,
  sentences: SentenceItem[],
  groups: SentenceGroup[]
): SentenceItem[] {
  // Validate that the target group exists
  validateId(targetGroupId, groups);

  // Validate that all sentence IDs exist
  sentenceIds.forEach((id) => validateId(id, sentences));

  const updatedSentences = sentences.map((s) =>
    sentenceIds.includes(s.id)
      ? {
          ...s,
          groupId: targetGroupId,
          updatedAt: Date.now(),
        }
      : s
  );

  return updatedSentences;
}

/**
 * Delete a sentence group after validating that the group exists, is not a system group, and does not contain any sentences.
 * @param groupId The ID of the group to delete.
 * @param groups The list of existing groups for validation and updating.
 * @param sentences The list of existing sentences for validation and updating.
 * @returns The updated list of groups after deletion and sentence reassignment.
 */
export function deleteGroup(
  groupId: string,
  groups: SentenceGroup[],
  sentences: SentenceItem[]
): SentenceGroup[] {
  validateId(groupId, groups);
  validateItemChangeable(groupId, groups);

  // Validate that the group is empty (has no sentences) before allowing deletion
  const hasItems = sentences.some((s) => s.groupId === groupId);
  if (hasItems) {
    throw new AppError(t('error.groupHasSentence'));
  }

  const updatedGroups = groups.filter((g) => g.id !== groupId);

  return updatedGroups;
}

/**
 * Creates a default sentence group with a predefined ID, name, and timestamps. This function is used to initialize the sentence store with a default group that can be used for sentences that do not belong to any specific group. The default group has the ID 'default', the name 'Default', and is marked as a system group that cannot be renamed or deleted. The created SentenceGroup includes properties such as id, name, isSystem, createdAt, and updatedAt.
 * @returns The created default SentenceGroup object.
 */
export function createDefaultGroup(): SentenceGroup {
  const now = Date.now();

  return {
    id: DEFAULT_GROUP_ID,
    name: 'Default',
    isSystem: true,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Creates a new sentence group with the given name and existing groups. The function normalizes the name, validates it to ensure it is not empty, does not exceed the maximum length, and is unique among existing groups before creating the new SentenceGroup object. The created SentenceGroup includes properties such as id, name, isSystem, createdAt, and updatedAt.
 * @param name The name of the new sentence group to create.
 * @param existingGroups The list of existing sentence groups for validation to ensure the new group name is unique.
 * @throws Will throw an error if the name is invalid or not unique among existing groups.
 * @returns The created SentenceGroup object with a unique ID, specified name, and timestamps for creation and last update.
 */
export function createGroup(
  name: string,
  existingGroups: SentenceGroup[]
): SentenceGroup {
  const normalizedName = normalizeText(name);

  validateNewName(normalizedName, existingGroups);

  const now = Date.now();

  return {
    id: createId(),
    name: normalizedName,
    isSystem: false,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Renames a sentence group with the given new name after validating that the group can be renamed and the new name is valid.
 * @param groupId
 * @param newName
 * @param existingGroups
 * @returns The updated SentenceGroup object with the new name and updated timestamp.
 */
export function renameGroup(
  groupId: string,
  newName: string,
  existingGroups: SentenceGroup[]
): SentenceGroup[] {
  validateId(groupId, existingGroups);

  validateItemChangeable(groupId, existingGroups);

  const normalizedNewName = normalizeText(newName);
  const otherGroups = existingGroups.filter((g) => g.id !== groupId);
  validateNewName(normalizedNewName, otherGroups);

  return existingGroups.map((g) =>
    g.id === groupId
      ? {
          ...g,
          name: normalizedNewName,
          updatedAt: Date.now(), // Update time is now
        }
      : g
  );
}
