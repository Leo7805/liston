import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { OverflowMenu } from '@/global/components/OverflowMenu';
import { DEFAULT_PLAYLIST_ID } from '@/features/playlists/playlist.service';
import { usePlaylistStore } from '@/features/playlists/stores/playlist.store';
import { useSentenceSelectionStore } from '@/features/sentences/stores/sentenceSelection.store';
import { usePlaylistItemSelectionStore } from '@/features/playlists/stores/playlistItemSelection.store';
import { useUiStore } from '@/global/stores/ui.store';

/** Used to define menu items with a key and text */
type KeyAndText = {
  key: string;
  text: string;
};

const menuKeyAndText: KeyAndText[] = [
  { key: 'Add Sentences', text: 'Add sentences to playlist' },
  { key: 'Remove Sentences', text: 'Remove sentences from playlist' },
  { key: 'Create Playlist', text: 'Create Playlist' },
  { key: 'Rename Playlist', text: 'Rename Current Playlist' },
  { key: 'Delete Playlist', text: 'Delete Current Playlist' },
];

export function PlaylistOverflowMenu() {
  const { openCreatePlaylistModal, openRenamePlaylistModal } =
    useUiStore.getState();
  const { deletePlaylist } = usePlaylistStore.getState();

  const currentPlaylistId = usePlaylistStore((s) => s.currentPlaylistId); // Current playlist ID

  const totalSentencesInAllPlaylists = usePlaylistStore((s) =>
    s.playlists.reduce((acc, playlist) => acc + playlist.items.length, 0)
  );

  const isItemEmpty = usePlaylistStore((s) => {
    const playlists = s.playlists;

    const currentPlaylist = playlists.find((p) => p.id === currentPlaylistId);

    return currentPlaylist
      ? currentPlaylist.items.length === 0
      : totalSentencesInAllPlaylists === 0; // All playlists
  });

  const disableRenamePlaylist =
    currentPlaylistId === null || currentPlaylistId === DEFAULT_PLAYLIST_ID; // Disable if no playlist is selected (null means "All sentences")

  const disableDeletePlaylist = disableRenamePlaylist || !isItemEmpty; // Disable if no playlist is selected (null means "All sentences") or if the playlist is empty

  function handleAddToPlayList() {
    router.push('/sentences'); // Jump to sentences page to select sentences to add to playlist

    useSentenceSelectionStore.getState().startSelectionModeForPlaylist(); // Enter selection mode
  }

  const menuItems = [
    // option 0: Add sentences to playlist
    {
      key: menuKeyAndText[0].key,
      onSelect: handleAddToPlayList,
      content: (
        <View className="flex-row items-center px-3 py-2">
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="#0284C7"
            className="mr-2"
          />
          <Text className="ml-2 text-sky-600">{menuKeyAndText[0].text}</Text>
        </View>
      ),
    },

    // option 1: Remove sentences from playlist
    {
      key: menuKeyAndText[1].key,
      onSelect: () =>
        usePlaylistItemSelectionStore.getState().startDeleteItemMode(), // Enter selection mode with "removing from playlist" mode enabled
      content: (
        <View className="flex-row items-center px-3 py-2">
          <Ionicons
            name="remove-circle-outline"
            size={20}
            color={isItemEmpty ? '#9ca3af' : '#dc2626'}
            className="mr-2"
          />
          <Text
            className={isItemEmpty ? 'ml-2 text-gray-400' : 'ml-2 text-red-500'}
          >
            {menuKeyAndText[1].text}
          </Text>
        </View>
      ),
      disabled: isItemEmpty,
    },

    // Option 2: Create Playlist
    {
      key: menuKeyAndText[2].key,
      onSelect: openCreatePlaylistModal,
      content: (
        <View className="flex-row items-center px-3 py-2">
          <Ionicons
            name="folder-open-outline"
            size={20}
            color="#0d9488"
            className="mr-2"
          />
          <Text className="ml-2 text-teal-600">{menuKeyAndText[2].text}</Text>
        </View>
      ),
    },

    // Option 3: Rename Playlist
    {
      key: menuKeyAndText[3].key,
      onSelect: openRenamePlaylistModal,
      content: (
        <View className="flex-row items-center px-3 py-2">
          <Ionicons
            name="create-outline"
            size={20}
            color={disableRenamePlaylist ? '#9ca3af' : '#0d9488'}
            className="mr-2"
          />
          <Text
            className={
              disableRenamePlaylist ? 'ml-2 text-gray-400' : 'ml-2 text-sky-600'
            }
          >
            {menuKeyAndText[3].text}
          </Text>
        </View>
      ),
      disabled: disableRenamePlaylist,
    },

    // Option 4: Delete Current Playlist
    {
      key: menuKeyAndText[4].key,
      onSelect: handleDeletePlaylist,
      content: (
        <View className="flex-row items-center px-3 py-2">
          <Ionicons
            name="trash-outline"
            size={20}
            color={disableDeletePlaylist ? '#9ca3af' : '#dc2626'}
            className="mr-2"
          />
          <Text
            className={
              disableDeletePlaylist ? 'ml-2 text-gray-400' : 'ml-2 text-red-500'
            }
          >
            {menuKeyAndText[4].text}
          </Text>
        </View>
      ),
      disabled: disableDeletePlaylist, // Disable if null group (All groups) or default group is selected
    },
  ];

  function handleDeletePlaylist() {
    if (
      currentPlaylistId === null ||
      currentPlaylistId === DEFAULT_PLAYLIST_ID
    ) {
      return; // Do not allow deleting if no playlist is selected (null means "All sentences") or if it's the default playlist
    }

    deletePlaylist(currentPlaylistId);
  }

  return <OverflowMenu items={menuItems} separatorIndexes={[1]} />;
}
