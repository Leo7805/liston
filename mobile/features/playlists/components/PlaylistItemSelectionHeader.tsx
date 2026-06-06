import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderContainer } from '@/global/components/HeaderContainer';
import { PlaylistSelector } from './PlaylistSelector';
import { SelectAllCheckbox } from '@/global/components/SelectAllCheckbox';
import { usePlaylistItemSelectionStore } from '@/features/playlists/stores/playlistItemSelection.store';
import { usePlaylistStore } from '@/features/playlists/stores/playlist.store';
import {
  getAllPlaylistItems,
  removeItemsFromPlaylist,
} from '../playlist.service';

export function PlaylistItemSelectionHeader() {
  const selectedPlaylistItemIds = usePlaylistItemSelectionStore(
    (s) => s.selectedPlaylistItemIds
  );
  const { clearPlaylistItemSelection, selectPlaylistItems, exitSelectionMode } =
    usePlaylistItemSelectionStore.getState();

  const currentPlaylistId = usePlaylistStore((s) => s.currentPlaylistId);
  const allPlaylists = usePlaylistStore((s) => s.playlists);
  const { removeItemsFromPlaylist } = usePlaylistStore.getState();

  const allPlaylistItems = useMemo(
    () => getAllPlaylistItems(allPlaylists),
    [allPlaylists]
  );

  const currentPlaylistItems = useMemo(() => {
    return allPlaylists.find((p) => p.id === currentPlaylistId)?.items ?? [];
  }, [currentPlaylistId, allPlaylists]);

  const visiblePlaylistItems = useMemo(() => {
    return currentPlaylistId === null ? allPlaylistItems : currentPlaylistItems;
  }, [currentPlaylistId, currentPlaylistItems, allPlaylistItems]);

  function toggleSelectAll() {
    if (selectedPlaylistItemIds.length === visiblePlaylistItems.length) {
      // If all playlist items are currently selected, unselect all
      clearPlaylistItemSelection();
      return;
    }

    selectPlaylistItems(visiblePlaylistItems.map((s) => s.id));
  }

  function handleDelete() {
    removeItemsFromPlaylist(selectedPlaylistItemIds, currentPlaylistId!);
    clearPlaylistItemSelection();
  }

  return (
    <HeaderContainer>
      {/* Group selection dropdown  */}
      <PlaylistSelector />

      <View className="flex-1 flex-row items-center p-2">
        {/* Select All checkbox */}
        <SelectAllCheckbox
          selectedCount={selectedPlaylistItemIds.length}
          visibleCount={visiblePlaylistItems.length}
          onToggle={toggleSelectAll}
        />
      </View>

      {/* delete Button */}
      <View className="flex-row items-center py-2 w-20 justify-center">
        <TouchableOpacity
          onPress={handleDelete}
          disabled={selectedPlaylistItemIds.length === 0}
        >
          <Ionicons
            name="remove-circle-outline"
            size={20}
            color={selectedPlaylistItemIds.length === 0 ? '#94a3b8' : '#dc2626'}
            className="mr-2"
          />
        </TouchableOpacity>
      </View>

      {/* More Actions */}
      {/* <View className="w-20 flex-row justify-center">
        <PlaylistItemSelectionOverflowMenu />
      </View> */}

      {/* Exit Selection Mode */}
      <View>
        <TouchableOpacity
          onPress={exitSelectionMode}
          className="h-10 w-10 items-center justify-center rounded-md"
        >
          <Ionicons name="close-circle" size={22} color="#334155" />
        </TouchableOpacity>
      </View>
    </HeaderContainer>
  );
}
