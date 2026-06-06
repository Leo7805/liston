import type { Playlist } from '@/features/playlists/playlist.types';
import type { SentenceItem } from '@/features/sentences/sentence.types';
import { getItemByIdOrThrow } from '@/global/utils/helpers';
import { createId } from '@/global/utils/id';
import { normalizeText } from '@/global/utils/text';
import {
  validateId,
  validateItemChangeable,
  validateNewName,
} from '@/global/utils/validation';

export const DEFAULT_PLAYLIST_ID = 'default';

/**
 * Creates a default playlist with a predefined ID and name. This playlist is intended to be immutable and always available in the application.
 * @returns New playlist object representing the default playlist.
 */
export function createDefaultPlaylist(): Playlist {
  const now = Date.now();

  return {
    id: DEFAULT_PLAYLIST_ID,
    name: 'Default',
    items: [],
    isSystem: true,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Creates a new playlist with the specified name. The function validates the name to ensure it is not empty, does not exceed the maximum length, and is unique among existing playlists before creating the new playlist object.
 * @param name The name of the new playlist to create.
 * @param existingPlaylists List of existing playlists for validation to ensure the new playlist name is unique.
 * @returns New playlist object with a unique ID, specified name, and timestamps for creation and last update.
 */
export function createPlaylist(
  name: string,
  existingPlaylists: Playlist[]
): Playlist {
  const normalizedName = normalizeText(name);

  validateNewName(normalizedName, existingPlaylists);

  const now = Date.now();

  return {
    id: createId(),
    name: normalizedName,
    items: [],
    isSystem: false,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Renames an existing playlist with the specified ID. The function validates that the playlist exists and is not a system playlist before allowing the rename operation.
 * @param playlistId The ID of the playlist to rename.
 * @param newName The new name for the playlist.
 * @param existingPlaylists List of existing playlists for validation.
 * @returns Updated list of playlists with the new name and updated timestamp.
 */
export function renamePlaylist(
  playlistId: string,
  newName: string,
  existingPlaylists: Playlist[]
): Playlist[] {
  validateId(playlistId, existingPlaylists);

  validateItemChangeable(playlistId, existingPlaylists);

  const normalizedNewName = normalizeText(newName);

  const otherPlaylists = existingPlaylists.filter(
    (playlist) => playlist.id !== playlistId
  );

  validateNewName(normalizedNewName, otherPlaylists);

  const updatedPlaylists = existingPlaylists.map((p) =>
    p.id === playlistId
      ? {
          ...p,
          name: normalizedNewName,
          updatedAt: Date.now(),
        }
      : p
  );

  return updatedPlaylists;
}

/**
 * Deletes a playlist with the specified ID. The function validates that the playlist exists and is not a system playlist before allowing the delete operation. It returns an updated list of playlists with the specified playlist removed.
 * @param playlistId The ID of the playlist to delete.
 * @param existingPlaylists List of existing playlists for validation.
 * @returns Updated list of playlists with the specified playlist removed.
 */
export function deletePlaylist(
  playlistId: string,
  existingPlaylists: Playlist[]
): Playlist[] {
  validateId(playlistId, existingPlaylists);

  validateItemChangeable(playlistId, existingPlaylists);

  return existingPlaylists.filter((playlist) => playlist.id !== playlistId);
}

/**
 * Adds sentences to a target playlist by updating the playlistId of the specified sentences. The function validates that the target playlist exists and that all sentence IDs are valid before performing the add operation.
 * @param sentenceIds The IDs of the sentences to add.
 * @param targetPlaylistId The ID of the target playlist to which the sentences will be added.
 * @param sentences List of existing sentences for validation.
 * @param playlists List of existing playlists for validation.
 * @returns Updated list of sentences with the specified sentences added to the target playlist.
 */
export function addSentencesToPlaylist(
  sentenceIds: string[],
  targetPlaylistId: string,
  sentences: SentenceItem[],
  playlists: Playlist[]
): Playlist[] {
  // Validate that all sentence IDs exist
  sentenceIds.forEach((id) => validateId(id, sentences));

  // Validate that the target playlist exists and get the target playlist
  const targetPlaylist = getItemByIdOrThrow(targetPlaylistId, playlists);

  const existingSentenceIds = new Set(
    targetPlaylist.items.map((item) => item.sentenceId)
  );

  // Filter out sentence IDs that are already in the playlist and create new PlaylistItems for the rest
  const newItems = sentenceIds
    .filter((id) => !existingSentenceIds.has(id))
    .map((id) => ({
      id: createId(),
      sentenceId: id,
      addedAt: Date.now(),
    }));

  if (newItems.length === 0) {
    // No new sentences to add, return the original playlists array
    return playlists;
  }

  const updatedPlaylists = playlists.map((playlist) =>
    playlist.id === targetPlaylistId
      ? {
          ...playlist,
          items: [...playlist.items, ...newItems],
          updatedAt: Date.now(),
        }
      : playlist
  );

  // Return a new playlists array with the updated playlist containing the new items
  return updatedPlaylists;
}

/**
 * Remove sentences from playlist by filtering out the specified sentence IDs from the playlist's items. The function validates that the playlist exists and that all sentence IDs are valid before performing the remove operation.
 * @param sentenceIds The IDs of the sentences to remove.
 * @param targetPlaylistId The ID of the target playlist from which the sentences will be removed.
 * @param sentences List of existing sentences for validation.
 * @param playlists List of existing playlists for validation.
 * @returns Updated list of playlists with the specified sentences removed from the target playlist.
 */
export function removeSentencesFromPlaylist(
  sentenceIds: string[],
  targetPlaylistId: string,
  sentences: SentenceItem[],
  playlists: Playlist[]
): Playlist[] {
  // Validate that all sentence IDs exist
  sentenceIds.forEach((id) => validateId(id, sentences));

  const targetPlaylist = getItemByIdOrThrow(targetPlaylistId, playlists);

  // Filter out items that have a sentenceId in the list of sentenceIds to remove
  const updatedItems = targetPlaylist.items.filter(
    (item) => !sentenceIds.includes(item.sentenceId)
  );

  // If no items were removed, return the original playlists array
  if (updatedItems.length === targetPlaylist.items.length) {
    return playlists;
  }

  // New playlists array with the updated playlist containing the filtered items
  const updatedPlaylists = playlists.map((playlist) =>
    playlist.id === targetPlaylistId
      ? {
          ...playlist,
          items: updatedItems,
          updatedAt: Date.now(),
        }
      : playlist
  );

  return updatedPlaylists;
}

/**
 * Removes sentences from all playlists by filtering out any playlist items that reference the specified sentence ID. The function validates that all playlist items referencing the sentence ID are removed and returns an updated list of playlists with the specified sentence removed from all playlists.
 * @param sentenceIds The IDs of the sentences to remove from all playlists.
 * @param playlists List of existing playlists for validation and updating.
 * @returns Updated list of playlists with the specified sentences removed from all playlists.
 * @throws Will throw an error if any sentence ID is not found in any playlist.
 */
export function removeSentencesFromAllPlaylists(
  sentenceIds: string[],
  sentences: SentenceItem[],
  playlists: Playlist[]
): Playlist[] {
  sentenceIds.forEach((id) => validateId(id, sentences));

  return playlists.map((playlist) => {
    const updatedItems = playlist.items.filter(
      (item) => !sentenceIds.includes(item.sentenceId)
    );

    if (updatedItems.length === playlist.items.length) {
      // No items were removed from this playlist, return it as is
      return playlist;
    }

    // Return a new playlist object with the updated items and updated timestamp
    return {
      ...playlist,
      items: updatedItems,
      updatedAt: Date.now(),
    };
  });
}

/**
 * Remove playlist items from playlist by filtering out the specified playlist item IDs from the playlist's items. The function validates that the playlist exists and that all playlist item IDs are valid before performing the remove operation.
 * @param playlistItemIds The IDs of the playlist items to remove.
 * @param targetPlaylistId The ID of the target playlist from which the playlist items will be removed.
 * @param playlists List of existing playlists for validation and updating.
 * @returns Updated list of playlists with the specified playlist items removed.
 */
export function removeItemsFromPlaylist(
  playlistItemIds: string[],
  targetPlaylistId: string,
  playlists: Playlist[]
): Playlist[] {
  const targetPlaylist = getItemByIdOrThrow(targetPlaylistId, playlists);

  // Filter out items that have an id in the list of playlistItemIds to remove
  const updatedItems = targetPlaylist.items.filter(
    (item) => !playlistItemIds.includes(item.id)
  );

  // If no items were removed, return the original playlists array
  if (updatedItems.length === targetPlaylist.items.length) {
    return playlists;
  }

  // New playlists array with the updated playlist containing the filtered items
  const updatedPlaylists = playlists.map((playlist) =>
    playlist.id === targetPlaylistId
      ? {
          ...playlist,
          items: updatedItems,
          updatedAt: Date.now(),
        }
      : playlist
  );

  return updatedPlaylists;
}

export function getAllPlaylistItems(playlists: Playlist[]) {
  return playlists.map((p) => p.items).flat();
}
