import { View, Text } from 'react-native';
import { SentenceEditorModal } from '@/components/SentenceEditorModal';
import { MiniPlayer } from '@/components/MiniPlayer';
// import { FullPlayerModal } from '@/components/FullPlayerModal';
import { AddSentenceButton } from '@/components/AddSentenceButton';
import { PlayingList } from '@/components/PlayingList';
import { FullPlayerModal } from '@/components/FullPlayerModal';
import { useUiStore } from '@/stores/uiStore';

export default function SentencesScreen() {
  const showSentenceEditor = useUiStore((s) => s.showSentenceEditor);

  return (
    <View className="flex-1">
      <View className="flex-1 bg-emerald-400 px-5 pt-16">
        <View className="flex-row items-center justify-between pb-2">
          {/* Page Title */}
          <Text className="text-3xl font-bold text-white">Sentences</Text>

          {/* Open Sentence Editor Button */}
          <AddSentenceButton />
        </View>

        {/* Currently playing Sentence list */}
        <PlayingList />

        {/* Editor Modal */}
        {showSentenceEditor && <SentenceEditorModal />}
      </View>

      {/* MiniPlayer */}
      <MiniPlayer />

      {/* FullPlayer Modal */}
      <FullPlayerModal />
    </View>
  );
}
