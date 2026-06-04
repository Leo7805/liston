import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { OverflowMenu } from '@/global/components/OverflowMenu';
import { useSentenceSelectionStore } from '@/features/sentences/sentenceSelection.store';
import { deleteSentencesEverywhere } from '@/features/sentences/sentencePlaylist.actions';

/** Used to define menu items with a key and text */
type KeyAndText = {
  key: string;
  text: string;
};

const menuKeyAndText: KeyAndText[] = [
  { key: 'Add to Playlist', text: 'Add to playlist' },
  { key: 'Move to Group', text: 'Move to group' },
  { key: 'Delete Selected', text: 'Delete selected' },
];

export function SentenceSelectionOverflowMenu() {
  const { openAddToPlaylistModal, openMoveToGroupModal } =
    useSentenceSelectionStore.getState();

  const selectedSentenceIds = useSentenceSelectionStore(
    (s) => s.selectedSentenceIds
  );

  function handleDeleteSentences() {
    deleteSentencesEverywhere(selectedSentenceIds);
  }

  const menuItems = [
    // option 0: Add selected sentences to playlist
    {
      key: menuKeyAndText[0].key,
      onSelect: openAddToPlaylistModal,
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

    // option 1: Move selected sentences to group
    {
      key: menuKeyAndText[1].key,
      // onSelect: openRenamePlaylistModal,
      onSelect: openMoveToGroupModal,
      content: (
        <View className="flex-row items-center px-3 py-2">
          <Ionicons
            name="folder-outline"
            size={20}
            color="#0284C7"
            className="mr-2"
          />
          <Text className="ml-2 text-sky-600">{menuKeyAndText[1].text}</Text>
        </View>
      ),
    },

    // option 2: Delete selected Sentences
    {
      key: menuKeyAndText[2].key,
      onSelect: handleDeleteSentences,
      content: (
        <View className="flex-row items-center px-3 py-2">
          <Ionicons
            name="folder-open-outline"
            size={20}
            color="#dc2626"
            className="mr-2"
          />
          <Text className="ml-2 text-red-500">{menuKeyAndText[2].text}</Text>
        </View>
      ),
    },
  ];

  return (
    <OverflowMenu
      items={menuItems}
      menuDisabled={selectedSentenceIds.length === 0}
    />
  );
}
