import { usePlaylistStore } from '@/features/playlists/playlist.store';
import { HeaderDropdown } from '@/global/components/HeaderDropdown';

export function PlaylistSelector() {
  const playlists = usePlaylistStore((s) => s.playlists);
  const currentPlaylistId = usePlaylistStore((s) => s.currentPlaylistId);
  const { setCurrentPlaylistId } = usePlaylistStore.getState();

  const dummyPlaylists = [
    { label: 'Default', value: '1' },
    { label: 'IELTS', value: '2' },
    { label: 'Job Interview', value: 'default' },
    { label: 'Daily Listening', value: '4' },
  ];

  return (
    <HeaderDropdown
      data={dummyPlaylists}
      value={currentPlaylistId}
      onChange={(value) => setCurrentPlaylistId(value)}
    />
  );
}
