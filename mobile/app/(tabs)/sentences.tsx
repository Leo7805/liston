import { useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SentenceEditorModal } from '@/features/sentences/components/SentenceEditorModal';
import { SentenceSearchHeader } from '@/global/components/SentenceSearchHeader';
import { SentencesHeader } from '@/features/sentences/components/SentencesHeader';
import { SavedSentences } from '@/features/sentences/components/SavedSentences';
import { useUiStore } from '@/global/stores/ui.store';

export default function SentencesScreen() {
  const isSentenceSearching = useUiStore((s) => s.isSentenceSearching);
  const { closeSentenceSearch } = useUiStore.getState();

  const showSentenceEditor = useUiStore((s) => s.showSentenceEditor);

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Clear search state when leaving the screen
        closeSentenceSearch();
      };
    }, [closeSentenceSearch])
  );

  return (
    <View className="flex-1 px-3">
      {/* Header */}
      {isSentenceSearching ? <SentenceSearchHeader /> : <SentencesHeader />}

      {/* Content */}
      <View className="flex-1">
        {/*  Sentences list of current selected group*/}
        <SavedSentences />
      </View>

      {/* Editor Modal */}
      {showSentenceEditor && <SentenceEditorModal />}
    </View>
  );
}
