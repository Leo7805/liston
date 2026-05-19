import { Text, TouchableOpacity } from 'react-native';
import { useUiStore } from '@/stores/uiStore';

/* A button for adding a new sentence. When pressed, it opens the sentence editor modal. */

export function AddSentenceButton() {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        useUiStore.getState().setEditingSentence(null); // Clear any existing editing sentence
        useUiStore.getState().openSentenceEditor(); // Open the sentence editor modal
      }} // open sentence editor modal on press
      className="rounded-3xl bg-emerald-900 px-10 py-3"
    >
      <Text className="text-center text-white">+</Text>
    </TouchableOpacity>
  );
}
