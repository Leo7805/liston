import { useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppModal } from '@/global/components/AppModal';
import { useUiStore } from '@/global/stores/ui.store';
import { useSentenceStore } from '@/features/sentences/sentence.store';

export function CreateGroupModal() {
  const [groupName, setGroupName] = useState('New Group 1');
  const inputRef = useRef<TextInput>(null);

  const { closeCreateGroupModal } = useUiStore.getState();

  const { createGroup } = useSentenceStore.getState();

  function handleCreate() {
    createGroup(groupName);
    closeCreateGroupModal();
  }

  function handleCancel() {
    closeCreateGroupModal();
  }

  return (
    <AppModal
      title="Create Group"
      onClose={handleCancel}
      onConfirm={handleCreate}
    >
      <View className="relative">
        <TextInput
          ref={inputRef}
          numberOfLines={1}
          value={groupName}
          onChangeText={setGroupName}
          placeholder="Enter group name"
          placeholderTextColor="#64748b"
          textAlignVertical="center"
          className="w-full rounded-xl bg-cyan-100 px-4 pr-10 py-2 text-slate-950"
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
    </AppModal>
  );
}
