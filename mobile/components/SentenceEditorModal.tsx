import {
  Pressable,
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

type SentenceEditorModalProps = {
  visible: boolean;
  isEditing: boolean;

  original: string;
  translation: string;

  onChangeOriginal: (text: string) => void;
  onChangeTranslation: (text: string) => void;

  onCancel: () => void;
  onSave: () => void;
};

export function SentenceEditorModal({
  visible,
  isEditing,
  original,
  translation,
  onChangeOriginal,
  onChangeTranslation,
  onCancel,
  onSave,
}: SentenceEditorModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <Pressable
        onPress={onCancel}
        className="flex-1 justify-start bg-black/60 px-2 pt-[100px]"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="rounded-3xl bg-slate-900 p-5"
        >
          <Text className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Sentence' : 'Add Sentence'}
          </Text>

          {/* Original sentence */}
          <TextInput
            value={original}
            onChangeText={onChangeOriginal}
            placeholder="Original sentence"
            placeholderTextColor="#64748b"
            className="mt-5 rounded-2xl bg-slate-800 px-4 py-3 text-base text-white"
          />

          {/* Translation */}
          <TextInput
            value={translation}
            onChangeText={onChangeTranslation}
            placeholder="Translation"
            placeholderTextColor="#64748b"
            className="mt-5 rounded-2xl bg-slate-800 px-4 py-3 text-base text-white"
          />

          {/* Buttons */}
          <View className="mt-4 flex-row gap-3">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 rounded-2xl bg-slate-600 px-4 py-3"
            >
              <Text className="text-center text-base font-semibold text-white">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSave}
              className="flex-1 rounded-2xl bg-blue-500 px-5 py-3"
            >
              <Text className="text-center text-base font-semibold text-slate-950">
                {isEditing ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
