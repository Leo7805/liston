import { useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppModal } from '@/global/components/AppModal';
import { useUiStore } from '@/global/stores/ui.store';
import { usePlaylistStore } from '@/features/playlists/stores/playlist.store';

export function CreatePlaylistModal() {
  const [playlistName, setPlaylistName] = useState('New Playlist 1');
  const inputRef = useRef<TextInput>(null); // Ref to the TextInput for focusing

  const { closeCreatePlaylistModal } = useUiStore.getState();

  const { createPlaylist } = usePlaylistStore.getState();

  function handleCreate() {
    createPlaylist(playlistName);
    closeCreatePlaylistModal();
  }

  function handleCancel() {
    closeCreatePlaylistModal();
  }

  return (
    <AppModal
      title="Create Playlist"
      onClose={handleCancel}
      onConfirm={handleCreate}
    >
      <View className="relative">
        <TextInput
          ref={inputRef}
          numberOfLines={1}
          value={playlistName}
          onChangeText={setPlaylistName}
          placeholder="Enter playlist name"
          placeholderTextColor="#64748b"
          textAlignVertical="center"
          className="w-full rounded-xl bg-cyan-100 px-4 pr-10 py-2 text-slate-950"
        />

        {/* Clear button */}
        {playlistName.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setPlaylistName('');

              requestAnimationFrame(() => {
                inputRef.current?.focus();
              });
            }}
            className="absolute right-3 top-0 bottom-0 justify-center"
          >
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
    </AppModal>
  );
}
