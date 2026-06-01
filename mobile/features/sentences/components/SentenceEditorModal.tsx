import { useState, useEffect } from 'react';
import { Pressable, Modal, View, Text, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useUiStore } from '@/global/stores/ui.store';
import { AppButton } from '@/global/components/AppButton';
import { useSentenceStore } from '../sentence.store';
import { normalizeText } from '@/global/utils/text';
import { getItemByIdOrThrow } from '@/global/utils/helpers';
import { DEFAULT_GROUP_ID } from '../sentence.service';

export function SentenceEditorModal() {
  /** Original and translation in current editor */
  const [original, setOriginal] = useState('');
  const [translation, setTranslation] = useState('');
  const [groupId, setGroupId] = useState(DEFAULT_GROUP_ID); // State to track the selected group ID in the editor

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
      setGroupId(DEFAULT_GROUP_ID); // Reset to default group when adding new sentence
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
    <Modal visible animationType="fade" transparent>
      <Pressable
        onPress={cancelEditing}
        className="flex-1 justify-start bg-black/60 px-2 pt-[100px]"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="rounded-3xl bg-emerald-100 p-5"
        >
          <Text className="text-2xl font-bold text-slate-950">
            {editingSentenceId ? 'Edit Sentence' : 'Add Sentence'}
          </Text>

          {/* Original sentence */}
          <TextInput
            multiline
            textAlignVertical="top"
            numberOfLines={4}
            value={original}
            onChangeText={setOriginal}
            placeholder="Original sentence"
            placeholderTextColor="#64748b"
            className="mt-5 min-h-32 rounded-2xl bg-white px-4 py-3 text-base text-slate-950"
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
            className="mt-5 min-h-32 rounded-2xl bg-white px-4 py-3 text-base text-slate-950"
          />

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
