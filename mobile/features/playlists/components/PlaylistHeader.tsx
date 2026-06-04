import { PlaylistSelector } from '@/features/playlists/components/PlaylistSelector';
import { HeaderContainer } from '@/global/components/HeaderContainer';
import { SentenceSearchButton } from '@/global/components/SentenceSearchButton';
import { useUiStore } from '@/global/stores/ui.store';
import { PlaylistOverflowMenu } from './PlaylistOverflowMenu';

export function PlaylistHeader() {
  const { setIsSentenceSearching } = useUiStore.getState();

  return (
    <HeaderContainer>
      {/* Playlist selection dropdown */}
      <PlaylistSelector />

      {/* Search button */}
      <SentenceSearchButton onPress={() => setIsSentenceSearching(true)} />

      {/* Playlist overflow menu */}
      <PlaylistOverflowMenu />
    </HeaderContainer>
  );
}
