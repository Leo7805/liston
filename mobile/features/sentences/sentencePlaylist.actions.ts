import { useSentenceStore } from '@/features/sentences/sentence.store';
import { usePlaylistStore } from '@/features/playlists/playlist.store';

/**
 * Sentence playlist actions (add/remove sentences to/from playlist)
 * Coordinates between sentence store and playlist store to avoid cyclic dependencies
 */

/**
 * Delete sentences from the sentence library and all playlists.
 * @param sentenceIds The IDs of the sentences to delete from the library and all playlists
 */
export function deleteSentencesEverywhere(sentenceIds: string[]) {
  const sentences = useSentenceStore.getState().sentences; // Get the list of sentences for validation

  // First, delete the sentences from the sentence store (which also updates the groups)
  useSentenceStore.getState().deleteSentencesFromLibrary(sentenceIds);

  // Then, remove the sentences from all playlists
  usePlaylistStore
    .getState()
    .removeSentencesFromAllPlaylists(sentenceIds, sentences);
}

/**
 * Add sentences to a playlist by their IDs.
 * @param sentenceIds The IDs of the sentences to add to the playlist
 * @param targetPlaylistId The ID of the playlist to add the sentences to
 */
export function addSentencesToPlaylist(
  sentenceIds: string[],
  targetPlaylistId: string
) {
  const sentences = useSentenceStore.getState().sentences; // Get the list of sentences for validation

  usePlaylistStore
    .getState()
    .addSentencesToPlaylist(sentenceIds, targetPlaylistId, sentences);
}

/**
 * Remove sentences from a playlist by their IDs. It will not delete the sentences from the sentence library, only from the specified playlist.
 * @param sentenceIds The IDs of the sentences to remove from the playlist
 * @param targetPlaylistId The ID of the playlist to remove the sentences from
 */
export function removeSentencesFromPlaylist(
  sentenceIds: string[],
  targetPlaylistId: string
) {
  const sentences = useSentenceStore.getState().sentences; // Get the list of sentences for validation

  usePlaylistStore
    .getState()
    .removeSentencesFromPlaylist(sentenceIds, targetPlaylistId, sentences);
}
