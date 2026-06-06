import { useState } from 'react';
import { View, Text } from 'react-native';
import { DEFAULT_PLAYLIST_ID } from '@/features/playlists/playlist.service';
import { useSentenceSelectionStore } from '@/features/sentences/stores/sentenceSelection.store';
import { usePlaylistStore } from '@/features/playlists/stores/playlist.store';
import { ItemDropdown } from '@/global/components/ItemDropdown';
import { AppModal } from '@/global/components/AppModal';
import { addSentencesToPlaylist } from '@/features/sentences/sentencePlaylist.actions';
import { router } from 'expo-router';

export function AddToPlaylistModal() {
  const { currentPlaylistId } = usePlaylistStore.getState(); // Get the current playlist ID from the playlist store
  const [playlistId, setPlaylistId] = useState(
    currentPlaylistId || DEFAULT_PLAYLIST_ID
  );

  const playlists = usePlaylistStore((s) => s.playlists);

  const selectedSentenceIds = useSentenceSelectionStore(
    (s) => s.selectedSentenceIds
  );

  const { closeAddToPlaylistModal } = useSentenceSelectionStore.getState();

  const displayedPlaylists = playlists.map((playlist) => ({
    label: playlist.name,
    value: playlist.id,
  }));

  /** Add/update a new sentence to sentence list & storageASync */
  async function handleAdd() {
    addSentencesToPlaylist(selectedSentenceIds, playlistId);
    useSentenceSelectionStore.getState().clearSentenceSelection(); // Exit selection mode after moving sentences
    closeAddToPlaylistModal();

    const { isSelectionModeForPlaylist, clearSelectionModeForPlaylist } =
      useSentenceSelectionStore.getState();

    /** Jump back to playlist tab */
    if (isSelectionModeForPlaylist) {
      clearSelectionModeForPlaylist();
      router.back();
    }

    usePlaylistStore.getState().selectPlaylist(playlistId);
  }

  /* Cancel editing, reset form and hide */
  function handleCancel() {
    useSentenceSelectionStore.getState().clearSentenceSelection(); // Exit selection mode after moving sentences
    closeAddToPlaylistModal(); // close the editor modal
  }

  return (
    <AppModal
      title="Add to Playlist"
      onClose={handleCancel}
      onConfirm={handleAdd}
      confirmText="Add"
    >
      <View className="mt-5 flex-row items-center gap-4">
        <Text className="text-lg font-semibold text-slate-950">Playlist</Text>

        <ItemDropdown
          data={displayedPlaylists}
          value={playlistId}
          onChange={setPlaylistId}
        />
      </View>
    </AppModal>
  );
}
