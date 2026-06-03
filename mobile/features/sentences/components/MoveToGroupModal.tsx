import { useState } from 'react';
import { View, Text } from 'react-native';
import { useSentenceStore } from '@/features/sentences/sentence.store';
import { useSentenceSelectionStore } from '@/features/sentences/sentenceSelection.store';
import { AppModal } from '@/global/components/AppModal';
import { ItemDropdown } from '@/global/components/ItemDropdown';

export function MoveToGroupModal() {
  const currentGroupId = useSentenceStore((s) => s.currentGroupId);
  const groups = useSentenceStore((s) => s.groups);
  const displayedGroups = groups
    .filter((group) => group.id !== currentGroupId) // Exclude the current group from the dropdown options
    .map((group) => ({
      label: group.name,
      value: group.id,
    }));

  const [groupId, setGroupId] = useState(() =>
    displayedGroups.length > 0 ? displayedGroups[0].value : ''
  ); // State to track the selected group ID in the editor

  const { moveSentences } = useSentenceStore.getState();

  const selectedSentenceIds = useSentenceSelectionStore(
    (s) => s.selectedSentenceIds
  );

  const { closeMoveToGroupModal } = useSentenceSelectionStore.getState();

  /** Add/update a new sentence to sentence list & storageASync */
  async function handleMove() {
    moveSentences(selectedSentenceIds, groupId);
    useSentenceSelectionStore.getState().clearSentenceSelection(); // Exit selection mode after moving sentences
    closeMoveToGroupModal();
  }

  /* Cancel editing, reset form and hide */
  function handleCancel() {
    useSentenceSelectionStore.getState().clearSentenceSelection(); // Exit selection mode after moving sentences
    closeMoveToGroupModal(); // close the editor modal
  }

  return (
    <AppModal
      title="Move to Group"
      onClose={handleCancel}
      onConfirm={handleMove}
      confirmText="Move"
    >
      <View className="mt-5 flex-row items-center gap-4">
        <Text className="text-lg font-semibold text-slate-950">Group</Text>

        <ItemDropdown
          data={displayedGroups}
          value={groupId}
          onChange={setGroupId}
        />
      </View>
    </AppModal>
  );
}
