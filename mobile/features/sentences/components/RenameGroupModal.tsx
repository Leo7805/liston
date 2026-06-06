import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppModal } from '@/global/components/AppModal';
import { useUiStore } from '@/global/stores/ui.store';
import { useRef, useState } from 'react';
import { useSentenceStore } from '@/features/sentences/stores/sentence.store';
import { DEFAULT_GROUP_ID } from '@/features/sentences/sentence.service';

export function RenameGroupModal() {
  const inputRef = useRef<TextInput>(null); // Ref to the TextInput for focusing
  const currentGroupId = useSentenceStore((s) => s.currentGroupId);
  const groups = useSentenceStore((s) => s.groups);

  const currentGroupName =
    groups.find((g) => g.id === currentGroupId)?.name || '';

  const [groupName, setGroupName] = useState(currentGroupName);
  const oldGroupName = useRef(currentGroupName); // Ref to store the original group name for comparison

  const { closeRenameGroupModal } = useUiStore.getState();
  const { renameGroup } = useSentenceStore.getState();

  function handleCreate() {
    if (currentGroupId === null || currentGroupId === DEFAULT_GROUP_ID) {
      return; // Do not allow renaming if null group (All groups) is selected or if it's the default group
    }
    renameGroup(currentGroupId, groupName);
    closeRenameGroupModal();
  }

  function handleCancel() {
    closeRenameGroupModal();
  }

  return (
    <AppModal
      title="Rename Group"
      onClose={handleCancel}
      onConfirm={handleCreate}
    >
      <View className="mt-5 w-full">
        <Text className="text-lg text-base text-slate-950 mb-2">
          Current Name
        </Text>

        <TextInput
          numberOfLines={1}
          editable={false}
          value={oldGroupName.current}
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
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter group name"
            placeholderTextColor="#64748b"
            textAlignVertical="center"
            className="rounded-xl bg-cyan-100 px-4 py-2 h-12 text-slate-950 w-full"
          />
          {groupName.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setGroupName('');

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
