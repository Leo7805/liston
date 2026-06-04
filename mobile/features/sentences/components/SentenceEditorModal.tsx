import { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useUiStore } from '@/global/stores/ui.store';
import { useSentenceStore } from '@/features/sentences/sentence.store';
import { DEFAULT_GROUP_ID } from '@/features/sentences/sentence.service';
import { normalizeText } from '@/global/utils/text';
import { getItemByIdOrThrow } from '@/global/utils/helpers';
import { AppModal } from '@/global/components/AppModal';
import { ItemDropdown } from '@/global/components/ItemDropdown';

export function SentenceEditorModal() {
  /** Original and translation in current editor */
  const [original, setOriginal] = useState('');
  const [translation, setTranslation] = useState('');

  const currentGroupId = useSentenceStore((s) => s.currentGroupId);
  const [groupId, setGroupId] = useState(currentGroupId); // State to track the selected group ID in the editor

  const editingSentenceId = useUiStore((s) => s.editingSentenceId);
  const { setEditingSentenceId, closeSentenceEditor } = useUiStore.getState();

  const sentences = useSentenceStore((s) => s.sentences);
  const { addSentence, updateSentence } = useSentenceStore.getState();

  const groups = useSentenceStore((s) => s.groups);

  /** Update form fields when editing sentence ID changes */
  useEffect(() => {
    if (!editingSentenceId) {
      setOriginal('');
      setTranslation('');
      // setGroupId(DEFAULT_GROUP_ID); // Reset to default group when adding new sentence
      return;
    }

    const editingSentence = getItemByIdOrThrow(
      editingSentenceId ?? '',
      sentences
    );

    setOriginal(editingSentence?.original ?? '');
    setTranslation(editingSentence?.translation ?? '');
    setGroupId(editingSentence?.groupId ?? DEFAULT_GROUP_ID);
  }, [editingSentenceId, sentences]);

  const displayedGroups = groups.map((group) => ({
    label: group.name,
    value: group.id,
  }));

  /** Add/update a new sentence to sentence list & storageASync */
  async function handleSave() {
    const normalizedOriginal = normalizeText(original);
    const normalizedTranslation = normalizeText(translation);

    /** Defensive programming: Check if group ID is null (All Groups) */
    if (groupId === null) {
      return console.error('Group ID cannot be null when saving a sentence');
    }

    // If editing, update the existing sentence
    if (editingSentenceId) {
      updateSentence({
        sentenceId: editingSentenceId,
        original: normalizedOriginal,
        translation: normalizedTranslation,
        groupId: groupId, // Use the selected group ID
      });
    } else {
      // If adding new, create a new sentence item and add to storage
      addSentence({
        original: normalizedOriginal,
        translation: normalizedTranslation,
        groupId: groupId, // Use the selected group ID
      });
    }

    setOriginal('');
    setTranslation('');
    setEditingSentenceId(null);
    closeSentenceEditor();
  }

  /* Cancel editing, reset form and hide */
  function cancelEditing() {
    setEditingSentenceId(null); // reset editing state

    setOriginal('');
    setTranslation('');
    // setGroupId(DEFAULT_GROUP_ID); // Reset to default group

    closeSentenceEditor(); // close the editor modal
  }

  return (
    <AppModal
      title={editingSentenceId ? 'Edit Sentence' : 'Add Sentence'}
      onClose={cancelEditing}
      onConfirm={handleSave}
      confirmText={editingSentenceId ? 'Update' : 'Add'}
    >
      {/* Original sentence */}
      <TextInput
        multiline
        textAlignVertical="top"
        numberOfLines={4}
        value={original}
        onChangeText={setOriginal}
        placeholder="Original sentence"
        placeholderTextColor="#64748b"
        className="mt-5 min-h-32 rounded-2xl bg-cyan-100 px-4 py-3 text-base text-slate-950"
      />

      {/* Translation */}
      <TextInput
        multiline
        textAlignVertical="top"
        numberOfLines={4}
        value={translation}
        onChangeText={setTranslation}
        placeholder="Translation"
        placeholderTextColor="#64748b"
        className="mt-5 min-h-32 rounded-2xl bg-cyan-100 px-4 py-3 text-base text-slate-950"
      />

      {/* Groups */}
      <View className="mt-5 flex-row items-center gap-4">
        <Text className="text-lg font-semibold text-slate-950">Group</Text>

        <ItemDropdown
          data={displayedGroups}
          value={groupId ?? DEFAULT_GROUP_ID}
          onChange={setGroupId}
        />
      </View>
    </AppModal>
  );
}
