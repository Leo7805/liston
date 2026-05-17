import { useState, useEffect } from 'react';
import { Modal, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { SentenceCard } from '@/components/SentenceCard';
import { mockSentences } from '@/data/mockSentences';
import { SaveSentenceForm } from '@/components/SaveSentenceForm';
import {
  addSentenceToStorage,
  updateSentenceInStorage,
  deleteSentenceFromStorage,
  getSentencesFromStorage,
  saveSentencesToStorage,
  hasInitializedSentences,
  setInitializedSentences,
} from '@/services/sentenceStore';
import { SentenceItem } from '@/types/sentences';

export default function SentencesScreen() {
  // Sentence list
  const [sentences, setSentences] = useState(mockSentences);

  // Add or Edit form visibility & state
  const [showEditor, setShowEditor] = useState(false);

  // Sentence (item) currently being edited
  const [editingSentence, setEditingSentence] = useState<SentenceItem | null>(
    null
  );

  // const [original, setOriginal] = useState('');
  // const [translation, setTranslation] = useState('');

  // Load sentences from storageAsync. If none are stored, use mock data.
  useEffect(() => {
    async function loadSentences() {
      const initialized = await hasInitializedSentences();

      // First time loading sentences: populate storage with mock data
      if (!initialized) {
        await saveSentencesToStorage(mockSentences);
        await setInitializedSentences();
        setSentences(mockSentences);
        return;
      }

      const stored = await getSentencesFromStorage();

      setSentences(stored);
    }

    loadSentences();
  }, []);

  // Show form for adding a new sentence, or saving an edit to an existing sentence
  function showAddForm() {
    setEditingSentence(null); // reset editing state

    // setOriginal('');
    // setTranslation('');

    setShowEditor((show) => !show);
  }

  // Add/update a new sentence to sentence list & storageASync
  async function saveSentence(orig: string, trans: string) {
    if (!orig.trim()) return;

    // If editing, update the existing sentence
    if (editingSentence) {
      const updated = await updateSentenceInStorage(editingSentence.id, {
        original: orig.trim(),
        translation: trans.trim(),
        updatedAt: Date.now(),
      });

      setSentences(updated);
    } else {
      const newSentence = {
        id: Date.now().toString(),
        original: orig.trim(),
        translation: trans.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const updated = await addSentenceToStorage(newSentence);
      setSentences(updated);
    }

    // setOriginal('');
    // setTranslation('');
    setEditingSentence(null);
    setShowEditor(false);
  }

  // Cancel editing, reset form and hide
  function cancelSave() {
    setEditingSentence(null); // reset editing state

    // setOriginal('');
    // setTranslation('');

    setShowEditor(false);
  }

  // Delete a sentence from list & storageAsync
  async function handleDelete(id: string) {
    const updated = await deleteSentenceFromStorage(id);
    setSentences(updated);
  }

  // Edit a sentence in list & storageAsync
  async function handleEdit(sentence: SentenceItem) {
    setEditingSentence(sentence);

    // setOriginal(sentence.original);
    // setTranslation(sentence.translation);

    setShowEditor(true);
  }

  return (
    <View className="flex-1 bg-emerald-400 px-5 pt-16">
      <View className="flex-row items-center justify-between">
        {/* Title */}
        <Text className="text-3xl font-bold text-white">Sentences</Text>

        {/* Add Button */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={showAddForm}
          className="rounded-3xl bg-slate-800 px-10 py-3"
        >
          <Text className="text-center text-white">+</Text>
        </TouchableOpacity>
      </View>

      {/* SaveSentence Form, for adding or editing */}
      {showEditor && (
        <SaveSentenceForm
          editingSentence={editingSentence}
          onSubmit={saveSentence}
          onCancel={cancelSave}
        />
      )}

      {/* Sentence List */}
      <FlatList
        data={sentences}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10, paddingBottom: 250, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <SentenceCard
            onDelete={() => handleDelete(item.id)}
            onEdit={() => handleEdit(item)}
            sentence={item}
          />
        )}
      />
    </View>
  );
}
