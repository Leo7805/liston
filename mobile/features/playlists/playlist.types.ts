/**
 * Represents one item inside a playlist.
 * References a SentenceItem by sentenceId.
 */
export type PlaylistItem = {
  id: string; // UUID for this playlist item
  sentenceId: string; // SentenceItem ID, must be unique within the playlist
  repeatCount?: number; // Optional repeat count for this item, default is 1
  addedAt: number; // timestamp in ms
};

/**
 * Represents a playlist.
 */
export type Playlist = {
  id: string; // UUID for this playlist
  name: string;
  items: PlaylistItem[]; // List of items in the playlist

  /**
   * System playlists cannot be deleted.
   */
  isSystem?: boolean;

  createdAt: number; // timestamp in ms
  updatedAt: number; // timestamp in ms
};
