import { useState, useEffect } from 'react';
import { Pressable, Modal, View, Text, TextInput } from 'react-native';
import { useUiStore } from '@/global/stores/ui.store';
import { AppButton } from '@/global/components/AppButton';
import { useSentenceStore } from '../sentence.store';
import { normalizeText } from '@/global/utils/helpers';

export function SentenceEditorModal() {
  /** Original and translation in current editor */
  const [original, setOriginal] = useState('');
  const [translation, setTranslation] = useState('');

  const editingSentenceId = useUiStore((s) => s.editingSentenceId);
  const { setEditingSentenceId, closeSentenceEditor } = useUiStore.getState();

  const { addSentence, updateSentence } = useSentenceStore.getState();

  /** Update form fields when editing sentence ID changes */
  useEffect(() => {
    const editingSentence = useSentenceStore
      .getState()
      .getSentenceById(editingSentenceId ?? ''); // Get the sentence being edited (if any)

    setOriginal(editingSentence?.original ?? '');
    setTranslation(editingSentence?.translation ?? '');
  }, [editingSentenceId]);

  /** Add/update a new sentence to sentence list & storageASync */
  async function handleSave() {
    const normalizedOriginal = normalizeText(original);
    const normalizedTranslation = normalizeText(translation);

    // If editing, update the existing sentence
    if (editingSentenceId) {
      updateSentence({
        sentenceId: editingSentenceId,
        original: normalizedOriginal,
        translation: normalizedTranslation,
      });
    } else {
      // If adding new, create a new sentence item and add to storage
      addSentence({
        original: normalizedOriginal,
        translation: normalizedTranslation,
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

    closeSentenceEditor(); // close the editor modal
  }

  return (
    <Modal visible animationType="fade" transparent>
      <Pressable
        onPress={cancelEditing}
        className="flex-1 justify-start bg-black/60 px-2 pt-[100px]"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="rounded-3xl bg-emerald-50 p-5"
        >
          <Text className="text-2xl font-bold text-slate-950">
            {editingSentenceId ? 'Edit Sentence' : 'Add Sentence'}
          </Text>

          {/* Original sentence */}
          <TextInput
            value={original}
            onChangeText={setOriginal}
            placeholder="Original sentence"
            placeholderTextColor="#64748b"
            className="mt-5 rounded-2xl bg-emerald-100 px-4 py-3 text-base text-slate-950"
          />

          {/* Translation */}
          <TextInput
            value={translation}
            onChangeText={setTranslation}
            placeholder="Translation"
            placeholderTextColor="#64748b"
            className="mt-5 rounded-2xl bg-emerald-100 px-4 py-3 text-base text-slate-950"
          />

          {/* Buttons */}
          <View className="mt-4 flex-row gap-3">
            <AppButton
              title="Cancel"
              onPress={cancelEditing}
              variant="secondary"
            />

            {/* <TouchableOpacity
              onPress={handleSave}
              className="flex-1 rounded-2xl bg-emerald-600 px-5 py-3"
            >
              <Text className="text-center text-base font-semibold text-white">
                {editingSentenceId ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity> */}
            <AppButton
              title={editingSentenceId ? 'Update' : 'Add'}
              onPress={handleSave}
              variant="primary"
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
