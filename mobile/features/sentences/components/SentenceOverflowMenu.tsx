import { OverflowMenu } from '@/global/components/OverflowMenu';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUiStore } from '@/global/stores/ui.store';
import { useSentenceStore } from '@/features/sentences/sentence.store';
import { DEFAULT_GROUP_ID } from '@/features/sentences/sentence.service';

export function SentenceOverflowMenu() {
  const { openCreateGroupModal, openRenameGroupModal } = useUiStore.getState();
  const { deleteGroup } = useSentenceStore.getState();
  const currentGroupId = useSentenceStore((s) => s.currentGroupId);
  const disableDeleteAndRename =
    currentGroupId === null || currentGroupId === DEFAULT_GROUP_ID; // Disable if null group (All groups) or default group is selected

  const menuItems = [
    {
      key: 'Create Group',
      onSelect: openCreateGroupModal,
      content: (
        <View className="flex-row items-center px-3 py-2">
          <Ionicons
            name="folder-open-outline"
            size={20}
            color="#0284C7"
            className="mr-2"
          />
          <Text className="ml-2 text-sky-600">Create Group</Text>
        </View>
      ),
    },
    {
      key: 'Rename Current Group',
      onSelect: openRenameGroupModal,
      content: (
        <View className="flex-row items-center px-3 py-2">
          <Ionicons
            name="create-outline"
            size={20}
            color={disableDeleteAndRename ? '#9ca3af' : '#0284C7'}
            className="mr-2"
          />
          <Text
            className={
              disableDeleteAndRename
                ? 'ml-2 text-gray-400'
                : 'ml-2 text-sky-600'
            }
          >
            Rename Current Group
          </Text>
        </View>
      ),
      disabled: disableDeleteAndRename,
    },
    {
      key: 'Delete Current Group',
      onSelect: handleDeleteGroup,
      content: (
        <View className="flex-row items-center px-3 py-2">
          <Ionicons
            name="trash-outline"
            size={20}
            color={disableDeleteAndRename ? '#9ca3af' : '#dc2626'}
            className="mr-2"
          />
          <Text
            className={
              disableDeleteAndRename
                ? 'ml-2 text-gray-400'
                : 'ml-2 text-red-500'
            }
          >
            Delete Current Group
          </Text>
        </View>
      ),
      disabled: disableDeleteAndRename, // Disable if null group (All groups) or default group is selected
    },
  ];

  function handleDeleteGroup() {
    if (currentGroupId === null || currentGroupId === DEFAULT_GROUP_ID) {
      return; // Do not allow deleting if null group (All groups) is selected or if it's the default group
    }

    deleteGroup(currentGroupId);
  }

  return <OverflowMenu items={menuItems} />;
}
