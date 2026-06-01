import { useState } from 'react';
import { Pressable, Modal, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { AppButton } from '@/global/components/AppButton';
import { DEFAULT_PLAYLIST_ID } from '@/features/playlists/playlist.service';
import { useSentenceSelectionStore } from '@/features/sentences/sentenceSelection.store';
import { usePlaylistStore } from '@/features/playlists/playlist.store';

export function AddToPlaylistModal() {
  const [playlistId, setPlaylistId] = useState(DEFAULT_PLAYLIST_ID); // State to track the selected playlist ID in the editor

  const playlists = usePlaylistStore((s) => s.playlists);
  const { addSentencesToPlaylist } = usePlaylistStore.getState();

  // const groups = useSentenceStore((s) => s.groups);
  // const currentGroupId = useSentenceStore((s) => s.currentGroupId);
  // const { moveSentences } = useSentenceStore.getState();

  const selectedSentenceIds = useSentenceSelectionStore(
    (s) => s.selectedSentenceIds
  );

  const { closeAddToPlaylistModal } = useSentenceSelectionStore.getState();

  const displayedPlaylists = playlists.map((playlist) => ({
    label: playlist.name,
    value: playlist.id,
  }));

  /** Add/update a new sentence to sentence list & storageASync */
  async function handleMove() {
    addSentencesToPlaylist(selectedSentenceIds, playlistId);
    closeAddToPlaylistModal();
  }

  /* Cancel editing, reset form and hide */
  function cancelMoving() {
    closeAddToPlaylistModal(); // close the editor modal
  }

  return (
    <Modal visible animationType="fade" transparent>
      <Pressable
        onPress={cancelMoving}
        className="flex-1 justify-start bg-black/60 px-2 pt-[100px]"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="rounded-3xl bg-emerald-100 p-5 "
        >
          <Text className="text-2xl font-bold text-slate-950">
            Add to Playlist
          </Text>

          {/* Playlists */}
          <View className="mt-5 flex-row items-center gap-4">
            <Text className="text-lg font-semibold text-slate-950">
              Playlist
            </Text>

            <Dropdown
              data={displayedPlaylists}
              labelField="label"
              valueField="value"
              value={playlistId}
              activeColor="rgba(15, 23, 42, 0.18)"
              onChange={(item) => {
                setPlaylistId(item.value);
              }}
              style={{
                marginTop: 8,
                height: 42,
                width: 150,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: 'rgba(255, 255, 255, 0.88)',
              }}
              selectedTextStyle={{
                color: '#0f172a',
                fontSize: 13,
                fontWeight: '400',
              }}
              containerStyle={{
                maxHeight: 230,
                borderRadius: 13,
                backgroundColor: 'white', // emerald-200

                borderWidth: 0,
              }}
              itemContainerStyle={{
                borderRadius: 12, //  Add rounded corners to each item
                overflow: 'hidden', // Ensure the background color is clipped to the rounded corners
              }}
              placeholderStyle={{
                color: '#64748b',
                fontSize: 13,
              }}
              itemTextStyle={{
                color: '#0f172a',
                fontSize: 13,
              }}
            ></Dropdown>
          </View>

          {/* Buttons */}
          <View className="mt-8 flex-row gap-3">
            <AppButton
              title="Cancel"
              onPress={cancelMoving}
              variant="secondary"
            />

            <AppButton title="Add" onPress={handleMove} variant="primary" />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
