import { usePlaylistStore } from '@/features/playlists/playlist.store';
import { ItemDropdown } from '@/global/components/ItemDropdown';
import { useMemo } from 'react';

const ALL_PLAYLISTS_ID = '__all__';

export function PlaylistSelector() {
  const currentPlaylistId = usePlaylistStore((s) => s.currentPlaylistId);
  const playlists = usePlaylistStore((s) => s.playlists);
  const { selectPlaylist } = usePlaylistStore.getState();

  /** Calculate the number of sentences in all playlists */
  const totalSentences = useMemo(() => {
    return playlists.reduce((acc, playlist) => acc + playlist.items.length, 0);
  }, [playlists]);

  const displayedPlaylists = useMemo(
    () => [
      {
        label: `All Playlists (${totalSentences})`,
        value: ALL_PLAYLISTS_ID,
      },
      ...playlists.map((p) => ({
        label: `${p.name} (${p.items.length})`,
        value: p.id,
      })),
    ],
    [playlists, totalSentences]
  );

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
      value={currentPlaylistId ?? ALL_PLAYLISTS_ID}
      onChange={handleChange}
    />
  );
}
