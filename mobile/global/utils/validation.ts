import { t } from '@/global/i18n/t';
import { AppError } from '@/global/errors/AppError';
import { getItemByIdOrThrow } from './helpers';
import { normalizeText } from './text';

type NameableItem = {
  name: string;
};

export function validateNonEmptyText(text: string): void {
  const normalizedText = normalizeText(text);

  if (normalizedText.length === 0) {
    throw new AppError(t('error.textCannotBeEmpty'));
  }
}

export function validateTextLength(
  text: string,
  maxLength: number = 100
): void {
  const normalizedText = normalizeText(text);

  if (normalizedText.length > maxLength) {
    throw new AppError(t('error.textTooLong'));
  }
}

/**
 * Validates that text is non-empty and does not exceed the maximum length.
 * @param text The text to validate.
 * @param maxLength The maximum allowed length for the text.
 * @throws Will throw an error if the text is empty or exceeds the maximum length.
 */
export function validateText(text: string, maxLength: number = 200): void {
  validateNonEmptyText(text);
  validateTextLength(text, maxLength);
}

/**
 * Validates that a name is unique within a list of items. (playlist or group)
 * @param items
 * @param name
 */
export function validateUniqueName<T extends NameableItem>(
  items: T[],
  name: string
): void {
  const normalizedName = normalizeText(name);
  const exists = items.some(
    (item) => normalizeText(item.name) === normalizedName
  );

  if (exists) {
    throw new AppError(t('error.nameExists'));
  }
}

/**
 * Validates that a name is non-empty, does not exceed the maximum length, and is unique within a list of items.
 * @param name
 * @param items
 * @param maxLength Optional maximum length for the name (default is 100 characters)
 * @throws Will throw an error if the name is empty, exceeds the maximum length, or is not unique within the list of items.
 */
export function validateNewName<T extends NameableItem>(
  name: string,
  items: T[],
  maxLength: number = 100
): void {
  validateText(name, maxLength);
  validateUniqueName(items, name);
}

/**
 * Validates that sentence text is non-empty and does not exceed the maximum length.
 * @param original The original sentence text to validate.
 * @param translation The translated sentence text to validate.
 * @param maxLength Optional maximum length for the sentence text (default is 200 characters).
 * @throws Will throw an error if the text is empty or exceeds the maximum length.
 */
export function validateSentenceText(
  original: string,
  translation: string,
  maxLength: number = 200
): void {
  const normalizedOriginal = normalizeText(original);
  const normalizedTranslation = normalizeText(translation);

  if (normalizedTranslation.length === 0 && normalizedOriginal.length === 0) {
    throw new AppError(t('error.sentenceTextCannotBeEmpty'));
  }

  validateTextLength(normalizedOriginal, maxLength);
  validateTextLength(normalizedTranslation, maxLength);
}

/**
 * Validates that an ID exists in a list of items. (group or playlist)
 * @param id The ID to validate.
 * @param items The list of items to check.
 */
export function validateId<T extends { id: string }>(
  id: string,
  items: T[]
): void {
  if (id.trim().length === 0) {
    throw new AppError(t('error.idCannotBeEmpty'));
  }

  const exists = items.some((item: T) => item.id === id);

  if (!exists) {
    throw new AppError(t('error.idNotFound'));
  }
}

/**
 * Validates that an item is not a system/default item before allowing changes (like rename or delete).
 * @param id
 * @param items
 */
export function validateItemChangeable<
  T extends { id: string; isSystem?: boolean },
>(id: string, items: T[]): void {
  const item = getItemByIdOrThrow(id, items);

  if (item?.isSystem) {
    throw new AppError(t('error.defaultCannotChange'));
  }
}
