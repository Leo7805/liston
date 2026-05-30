/**
 * A reusable modal component for editing text input, used for both adding and editing sentences.
 */

import { useState, useEffect } from 'react';
import { Pressable, Modal, View, Text, TextInput } from 'react-native';
import { usePlayerStore } from '@/features/player/player.store';
import { useUiStore } from '@/global/stores/ui.store';
import { AppButton } from '@/global/components/AppButton';
import { createId } from '@/global/utils/id';

type SentenceEditorModalProps = {
  title: string; // Modal title, e.g. "Add Sentence" or "Edit Sentence"
  buttonTitle: string; // Button title, e.g. "Add" or "Update"
  initialOriginal?: string; // Initial value for original sentence (for editing)
  initialTranslation?: string; // Initial value for translation (for editing)
  onSave: (original: string, translation: string) => Promise<void>; // Callback when saving the sentence
};

export function SentenceEditorModal({
  title = 'Add Sentence',
  buttonTitle = 'Add',
  initialOriginal = '',
  initialTranslation = '',
  onSave,
}: SentenceEditorModalProps) {
  /** Original and translation in current editor */
  const [original, setOriginal] = useState('');
  const [translation, setTranslation] = useState('');

  const editingSentenceId = useUiStore((s) => s.editingSentenceId);
  const { setEditingSentenceId, closeSentenceEditor } = useUiStore.getState();

  // ❤️
  const addItemToPlayingList = usePlayerStore((s) => s.addItemToPlayingList);
  const updateItemInPlayingList = usePlayerStore(
    (s) => s.updateItemInPlayingList
  );

  /** Update form fields when editing sentence ID changes */
  useEffect(() => {
    setOriginal(editingSentence?.original ?? '');
    setTranslation(editingSentence?.translation ?? '');
  }, [editingSentenceId]);

  /** Add/update a new sentence to sentence list & storageASync */
  async function handleSave() {
    const trimmedOriginal = original.trim();
    const trimmedTranslation = translation.trim();

    if (!trimmedOriginal) return;

    // If editing, update the existing sentence
    if (editingSentenceId) {
      await updateItemInPlayingList(editingSentenceId, {
        original: trimmedOriginal,
        translation: trimmedTranslation,
      });
    } else {
      // If adding new, create a new sentence item and add to storage
      const newSentence = {
        id: createId(),
        original: trimmedOriginal,
        translation: trimmedTranslation,
        length: trimmedOriginal.length,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await addItemToPlayingList(newSentence);
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
