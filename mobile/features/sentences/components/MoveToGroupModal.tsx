import { useState } from 'react';
import { Pressable, Modal, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { AppButton } from '@/global/components/AppButton';
import { useSentenceStore } from '@/features/sentences/sentence.store';
import { DEFAULT_GROUP_ID } from '@/features/sentences/sentence.service';
import { useSentenceSelectionStore } from '@/features/sentences/sentenceSelection.store';

export function MoveToGroupModal() {
  const [groupId, setGroupId] = useState(DEFAULT_GROUP_ID); // State to track the selected group ID in the editor

  const groups = useSentenceStore((s) => s.groups);
  const currentGroupId = useSentenceStore((s) => s.currentGroupId);
  const { moveSentences } = useSentenceStore.getState();

  const selectedSentenceIds = useSentenceSelectionStore(
    (s) => s.selectedSentenceIds
  );

  const { closeMoveToGroupModal } = useSentenceSelectionStore.getState();

  const displayedGroups = groups
    .filter((group) => group.id !== currentGroupId) // Exclude the current group from the dropdown options
    .map((group) => ({
      label: group.name,
      value: group.id,
    }));

  /** Add/update a new sentence to sentence list & storageASync */
  async function handleMove() {
    moveSentences(selectedSentenceIds, groupId);
    closeMoveToGroupModal();
  }

  /* Cancel editing, reset form and hide */
  function cancelMoving() {
    closeMoveToGroupModal(); // close the editor modal
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
            Move to Group
          </Text>

          {/* Groups */}
          <View className="mt-5 flex-row items-center gap-4">
            <Text className="text-lg font-semibold text-slate-950">Group</Text>

            <Dropdown
              data={displayedGroups}
              labelField="label"
              valueField="value"
              value={groupId}
              activeColor="rgba(15, 23, 42, 0.18)"
              onChange={(item) => {
                setGroupId(item.value);
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

            <AppButton title="Move" onPress={handleMove} variant="primary" />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
