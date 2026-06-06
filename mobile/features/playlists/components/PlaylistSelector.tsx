import { usePlaylistStore } from '@/features/playlists/stores/playlist.store';
import { ItemDropdown } from '@/global/components/ItemDropdown';
import { useMemo } from 'react';
import { usePlaylistItemSelectionStore } from '@/features/playlists/stores/playlistItemSelection.store';
import { DEFAULT_PLAYLIST_ID } from '@/features/playlists/playlist.service';

const ALL_PLAYLISTS_ID = '__all__';

export function PlaylistSelector() {
  const currentPlaylistId = usePlaylistStore((s) => s.currentPlaylistId);
  const playlists = usePlaylistStore((s) => s.playlists);
  const { selectPlaylist } = usePlaylistStore.getState();
  const isSelectionMode = usePlaylistItemSelectionStore(
    (s) => s.isSelectionMode
  );

  /** Calculate the number of sentences in all playlists */
  const totalSentences = useMemo(() => {
    return playlists.reduce((acc, playlist) => acc + playlist.items.length, 0);
  }, [playlists]);

  /** Note: In selection mode, only display the playlists */
  const displayedPlaylists = useMemo(() => {
    return isSelectionMode
      ? [
          ...playlists.map((p) => ({
            label: `${p.name} (${p.items.length})`,
            value: p.id,
          })),
        ]
      : [
          {
            label: `All Playlists (${totalSentences})`,
            value: ALL_PLAYLISTS_ID,
          },
          ...playlists.map((p) => ({
            label: `${p.name} (${p.items.length})`,
            value: p.id,
          })),
        ];
  }, [playlists, totalSentences, isSelectionMode]);

  function handleChange(value: string | null) {
    if (value === ALL_PLAYLISTS_ID) {
      selectPlaylist(null);
      return;
    }

    selectPlaylist(value);
  }

  return (
    <ItemDropdown
      data={displayedPlaylists}
      value={currentPlaylistId ?? DEFAULT_PLAYLIST_ID}
      onChange={handleChange}
    />
  );
}
