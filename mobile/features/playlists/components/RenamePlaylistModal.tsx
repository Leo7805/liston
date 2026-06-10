import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppModal } from '@/global/components/AppModal';
import { useUiStore } from '@/global/stores/ui.store';
import { useRef, useState } from 'react';
import { usePlaylistStore } from '@/features/playlists/stores/playlist.store';
import { DEFAULT_PLAYLIST_ID } from '../playlist.service';

export function RenamePlaylistModal() {
  const inputRef = useRef<TextInput>(null); // Ref to the TextInput for focusing
  const currentPlaylistId = usePlaylistStore((s) => s.currentPlaylistId);
  const playlists = usePlaylistStore((s) => s.playlists);

  const currentPlaylistName =
    playlists.find((p) => p.id === currentPlaylistId)?.name || '';

  const [playlistName, setPlaylistName] = useState(currentPlaylistName);
  const oldPlaylistName = useRef(currentPlaylistName); // Ref to store the original playlist name for comparison

  const { closeRenamePlaylistModal } = useUiStore.getState();
  const { renamePlaylist } = usePlaylistStore.getState();

  function handleRename() {
    if (
      currentPlaylistId === null ||
      currentPlaylistId === DEFAULT_PLAYLIST_ID
    ) {
      return; // Do not allow renaming if null playlist (All playlists) is selected or if it's the default playlist
    }
    renamePlaylist(currentPlaylistId, playlistName);
    closeRenamePlaylistModal();
  }

  function handleCancel() {
    closeRenamePlaylistModal();
  }

  return (
    <AppModal
      title="Rename Playlist"
      onClose={handleCancel}
      onConfirm={handleRename}
    >
      <View className="mt-5 w-full">
        <Text className="text-lg text-base text-slate-950 mb-2">
          Current Name
        </Text>

        <TextInput
          numberOfLines={1}
          editable={false}
          value={oldPlaylistName.current}
          textAlignVertical="center"
          placeholderTextColor="#cbd5e1" // slate-300
          className="rounded-xl bg-slate-200 px-4 h-12 text-slate-500"
        />
      </View>
      <View className="mt-5 w-full">
        <Text className="text-lg text-base text-slate-950 mb-2">New Name</Text>
        <View className="relative">
          <TextInput
            ref={inputRef}
            numberOfLines={1}
            value={playlistName}
            onChangeText={setPlaylistName}
            placeholder="Enter playlist name"
            placeholderTextColor="#64748b"
            textAlignVertical="center"
            className="rounded-xl bg-cyan-100 px-4 py-2 h-12 text-slate-950 w-full"
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
      </View>
    </AppModal>
  );
}
