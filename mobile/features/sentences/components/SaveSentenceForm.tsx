import { SentenceItem } from '@/features/sentences/sentence.types';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

type SaveSentenceFormProps = {
  editingSentence: SentenceItem | null;
  onSubmit: (original: string, translation: string) => void;
  onCancel: () => void;
};

export function SaveSentenceForm({
  editingSentence,
  onSubmit,
  onCancel,
}: SaveSentenceFormProps) {
  const [original, setOriginal] = useState('');
  const [translation, setTranslation] = useState('');

  // Initialize form values if editing an existing sentence
  useEffect(() => {
    if (editingSentence) {
      setOriginal(editingSentence.original);
      setTranslation(editingSentence.translation);
    }
  }, [editingSentence]);

  function handleSave() {
    onSubmit(original, translation);
    setOriginal('');
    setTranslation('');
  }

  return (
    <View className="mb-5 rounded-3xl bg-slate-900 p-5">
      <TextInput
        value={original}
        onChangeText={setOriginal}
        placeholder="Original sentence"
        placeholderTextColor="#64748b"
        className="rounded-2xl bg-slate-800 px-4 py-3 text-base text-white"
      />

      <TextInput
        value={translation}
        onChangeText={setTranslation}
        placeholder="Translation (optional)"
        placeholderTextColor="#64748b"
        className="mt-3 rounded-2xl bg-slate-800 px-4 py-3 text-base text-white"
      />

      {/* Add or save sentence button */}
      <TouchableOpacity
        onPress={handleSave}
        className="mt-4 rounded-2xl bg-blue-500 px-4 py-3"
      >
        <Text className="text-center text-base font-semibold text-slate-950">
          {editingSentence ? 'Save Changes' : 'Add Sentence'}
        </Text>
      </TouchableOpacity>

      {/* cancel button */}
      <TouchableOpacity
        onPress={onCancel}
        className="mt-2 rounded-2xl bg-slate-600 px-4 py-3"
      >
        <Text className="text-center text-base font-semibold text-white">
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
}
