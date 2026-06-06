import { useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PlayingSentences } from '@/features/playlists/components/PlayingSentences';
import { useUiStore } from '@/global/stores/ui.store';
import { PlaylistHeader } from '@/features/playlists/components/PlaylistHeader';
import { SentenceSearchHeader } from '@/global/components/SentenceSearchHeader';
import { usePlaylistItemSelectionStore } from '@/features/playlists/stores/playlistItemSelection.store';
import { PlaylistItemSelectionHeader } from '@/features/playlists/components/PlaylistItemSelectionHeader';

export default function PlaylistScreen() {
  const isPlaylistSearching = useUiStore((s) => s.isSentenceSearching);
  const isSelectionMode = usePlaylistItemSelectionStore(
    (s) => s.isSelectionMode
  );
  const { closeSentenceSearch } = useUiStore.getState();
  const { exitSelectionMode } = usePlaylistItemSelectionStore.getState();

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Clear search state when leaving the screen
        closeSentenceSearch();
        exitSelectionMode();
      };
    }, [closeSentenceSearch, exitSelectionMode])
  );

  return (
    <View className="flex-1 px-3">
      {/* Header */}
      {isSelectionMode ? (
        <PlaylistItemSelectionHeader />
      ) : isPlaylistSearching ? (
        <SentenceSearchHeader />
      ) : (
        <PlaylistHeader />
      )}

      {/* Content */}
      <View className="flex-1">
        {/* Currently playing Sentence list */}
        <PlayingSentences />
      </View>
    </View>
  );
}
