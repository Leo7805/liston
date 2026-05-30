import { PlaylistMoreMenuButton } from '@/features/playlists/components/PlaylistMoreMenuButton';
import { PlaylistSelector } from '@/features/playlists/components/PlaylistSelector';
import { HeaderContainer } from '@/global/components/HeaderContainer';
import { SentenceSearchButton } from '@/global/components/SentenceSearchButton';
import { useUiStore } from '@/global/stores/ui.store';

export function PlaylistHeader() {
  const { setIsSentenceSearching } = useUiStore.getState();

  return (
    <HeaderContainer>
      <PlaylistSelector />
      <SentenceSearchButton onPress={() => setIsSentenceSearching(true)} />
      <PlaylistMoreMenuButton />
    </HeaderContainer>
  );
}
