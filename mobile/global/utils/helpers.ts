import { useUiStore } from '@/global/stores/ui.store';
import { AppError } from '@/global/errors/AppError';
import { t } from '@/global/i18n/t';

/**
 * Handles errors by displaying an appropriate error message to the user.
 */
export function handleError(error: unknown): void {
  if (error instanceof AppError) {
    useUiStore.getState().showError(error.message);

    return;
  }

  // For unexpected errors, log them and show a generic message
  console.error(error);
  useUiStore.getState().showError(t('error.unknown'));
}

/**
 * Get an item by its ID from a list of items.
 * @param id The ID of the item to find.
 * @param items The list of items to search through.
 * @returns The item with the matching ID, or throws an error if not found.
 */
export function getItemByIdOrThrow<T extends { id: string }>(
  id: string,
  items: T[]
): T {
  if (id.trim().length === 0) {
    throw new AppError(t('error.idCannotBeEmpty'));
  }

  const item = items.find((item) => item.id === id);

  if (!item) {
    throw new AppError(t('error.idNotFound'));
  }

  return item;
}

/**
 * Get an item by its ID from a list of items, or return undefined if not found.
 * @param id The ID of the item to find.
 * @param items The list of items to search through.
 * @returns The item with the matching ID, or undefined if not found.
 */
export function getItemById<T extends { id: string }>(
  id: string,
  items: T[]
): T | undefined {
  if (!id) return undefined;

  return items.find((item) => item.id === id);
}
