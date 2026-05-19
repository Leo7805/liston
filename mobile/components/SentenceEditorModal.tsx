import { usePlayerStore } from '@/stores/playerStore';
import { useUiStore } from '@/stores/uiStore';
import { useState, useEffect } from 'react';
import {
  Pressable,
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export function SentenceEditorModal() {
  const [original, setOriginal] = useState('');
  const [translation, setTranslation] = useState('');

  const editingSentence = useUiStore((s) => s.editingSentence);

  const addItemToPlayingList = usePlayerStore((s) => s.addItemToPlayingList);
  const updateItemInPlayingList = usePlayerStore(
    (s) => s.updateItemInPlayingList
  );

  const setEditingSentence = useUiStore((s) => s.setEditingSentence);
  const closeSentenceEditor = useUiStore((s) => s.closeSentenceEditor);

  /** Update form fields when editing sentence changes */
  useEffect(() => {
    setOriginal(editingSentence?.original ?? '');
    setTranslation(editingSentence?.translation ?? '');
  }, [editingSentence]);

  /** Add/update a new sentence to sentence list & storageASync */
  async function handleSave() {
    const trimmedOriginal = original.trim();
    const trimmedTranslation = translation.trim();

    if (!trimmedOriginal) return;

    // If editing, update the existing sentence
    if (editingSentence) {
      await updateItemInPlayingList(editingSentence.id, {
        original: trimmedOriginal,
        translation: trimmedTranslation,
      });
    } else {
      // If adding new, create a new sentence item and add to storage
      const newSentence = {
        id: Date.now().toString(),
        original: trimmedOriginal,
        translation: trimmedTranslation,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await addItemToPlayingList(newSentence);
    }

    setOriginal('');
    setTranslation('');
    setEditingSentence(null);
    closeSentenceEditor();
  }

  /* Cancel editing, reset form and hide */
  function cancelEditing() {
    setEditingSentence(null); // reset editing state

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
          className="rounded-3xl bg-white p-5"
        >
          <Text className="text-2xl font-bold text-slate-950">
            {editingSentence ? 'Edit Sentence' : 'Add Sentence'}
          </Text>

          {/* Original sentence */}
          <TextInput
            value={original}
            onChangeText={setOriginal}
            placeholder="Original sentence"
            placeholderTextColor="#64748b"
            className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-base text-slate-950"
          />

          {/* Translation */}
          <TextInput
            value={translation}
            onChangeText={setTranslation}
            placeholder="Translation"
            placeholderTextColor="#64748b"
            className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-base text-slate-950"
          />

          {/* Buttons */}
          <View className="mt-4 flex-row gap-3">
            <TouchableOpacity
              onPress={cancelEditing}
              className="flex-1 rounded-2xl bg-slate-100 px-4 py-3"
            >
              <Text className="text-center text-base font-semibold text-slate-700">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 rounded-2xl bg-emerald-600 px-5 py-3"
            >
              <Text className="text-center text-base font-semibold text-white">
                {editingSentence ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
