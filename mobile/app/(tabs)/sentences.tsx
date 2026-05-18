import { useState, useEffect } from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { SentenceCard } from '@/components/SentenceCard';
import { mockSentences } from '@/data/mockSentences';
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
import { SentenceEditorModal } from '@/components/SentenceEditorModal';
import { PlaybackState, type PlaybackStateType } from '@/types/player';
import { MiniPlayer } from '@/components/MiniPlayer';

export default function SentencesScreen() {
  // Sentence list
  const [sentences, setSentences] = useState(mockSentences);

  // Add or Edit form visibility & state
  const [showEditor, setShowEditor] = useState(false);

  /** Current editing sentence */
  const [editingSentence, setEditingSentence] = useState<SentenceItem | null>(
    null
  ); // Sentence (item) currently being edited
  const [original, setOriginal] = useState(''); // Original sentence of current editing sentence
  const [translation, setTranslation] = useState('');
  const [openSwipeId, setOpenSwipeId] = useState<string | null>(null); // ID of currently opened swipeable card/sentence (for edit/delete actions)

  /** Current playing sentence */
  const [playingSentence, setPlayingSentence] = useState<SentenceItem | null>(
    null
  );
  const [playbackState, setPlaybackState] = useState<PlaybackStateType>(
    PlaybackState.Idle
  );

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
  function openAddEditor() {
    setEditingSentence(null); // reset editing state

    setOriginal('');
    setTranslation('');

    setShowEditor(true);
  }

  // Add/update a new sentence to sentence list & storageASync
  async function saveSentence() {
    if (!original.trim()) return;

    // If editing, update the existing sentence
    if (editingSentence) {
      const updated = await updateSentenceInStorage(editingSentence.id, {
        original: original.trim(),
        translation: translation.trim(),
        updatedAt: Date.now(),
      });

      setSentences(updated);
    } else {
      const newSentence = {
        id: Date.now().toString(),
        original: original.trim(),
        translation: translation.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const updated = await addSentenceToStorage(newSentence);
      setSentences(updated);
    }

    setOriginal('');
    setTranslation('');
    setEditingSentence(null);
    setShowEditor(false);
  }

  // Cancel editing, reset form and hide
  function cancelEditing() {
    setEditingSentence(null); // reset editing state

    setOriginal('');
    setTranslation('');

    setShowEditor(false);
  }

  // Delete a sentence from list & storageAsync
  async function handleDelete(id: string) {
    const updated = await deleteSentenceFromStorage(id);
    setSentences(updated);
  }

  // Edit a sentence in list & storageAsync
  async function startEdit(sentence: SentenceItem) {
    setEditingSentence(sentence);

    setOriginal(sentence.original);
    setTranslation(sentence.translation);

    setShowEditor(true);
  }

  return (
    <View className="flex-1">
      <View className="flex-1 bg-emerald-400 px-5 pt-16">
        <View className="flex-row items-center justify-between pb-2">
          {/* Title */}
          <Text className="text-3xl font-bold text-white">Sentences</Text>

          {/* Add Button */}
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={openAddEditor}
            className="rounded-3xl bg-slate-800 px-10 py-3"
          >
            <Text className="text-center text-white">+</Text>
          </TouchableOpacity>
        </View>

        {/* Sentence List */}
        <FlatList
          data={sentences}
          keyExtractor={(item) => item.id}
          onTouchStart={() => setOpenSwipeId(null)}
          onScrollBeginDrag={() => setOpenSwipeId(null)}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            // gap: 10,
            paddingBottom: 250,
            paddingTop: 16,
          }}
          ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          renderItem={({ item }) => (
            <SentenceCard
              sentence={item}
              openSwipeId={openSwipeId}
              onSwipeOpen={() => setOpenSwipeId(item.id)}
              onDelete={() => handleDelete(item.id)}
              onEdit={() => startEdit(item)}
              onPress={() => {
                setPlayingSentence(item);
                setPlaybackState(PlaybackState.Playing);
              }}
            />
          )}
        />

        {/* Editor Modal */}
        <SentenceEditorModal
          visible={showEditor}
          isEditing={!!editingSentence}
          original={original}
          translation={translation}
          onChangeOriginal={setOriginal}
          onChangeTranslation={setTranslation}
          onCancel={cancelEditing}
          onSave={saveSentence}
        />
      </View>

      {/* MiniPlayer */}
      <MiniPlayer
        sentence={playingSentence}
        playbackState={playbackState}
        onTogglePlay={() => {
          setPlaybackState((prev) => {
            return prev === PlaybackState.Playing
              ? PlaybackState.Paused
              : PlaybackState.Playing;
          });
        }}
        onClose={() => {
          setPlayingSentence(null);
          setPlaybackState(PlaybackState.Idle);
        }}
      />
    </View>
  );
}
