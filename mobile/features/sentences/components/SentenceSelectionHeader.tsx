import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSentenceSelectionStore } from '@/features/sentences/stores/sentenceSelection.store';
import { HeaderContainer } from '@/global/components/HeaderContainer';
import { useSentenceStore } from '@/features/sentences/stores/sentence.store';
import { SentenceSelectionOverflowMenu } from '@/features/sentences/components/SentenceSelectionOverflowMenu';
import { SentenceGroupSelector } from './SentenceGroupSelector';
import { SelectAllCheckbox } from '@/global/components/SelectAllCheckbox';

export function SentenceSelectionHeader() {
  const selectedSentenceIds = useSentenceSelectionStore(
    (s) => s.selectedSentenceIds
  );

  const { clearSentenceSelection, selectSentences, exitSelectionMode } =
    useSentenceSelectionStore.getState();

  const currentGroupId = useSentenceStore((s) => s.currentGroupId);
  const sentenceList = useSentenceStore((s) => s.sentences);

  const visibleSentences = useMemo(() => {
    return currentGroupId === null
      ? sentenceList
      : sentenceList.filter((s) => s.groupId === currentGroupId);
  }, [currentGroupId, sentenceList]);

  function toggleSelectAll() {
    if (selectedSentenceIds.length === visibleSentences.length) {
      // If all sentences are currently selected, unselect all
      clearSentenceSelection();
      return;
    }

    selectSentences(visibleSentences.map((s) => s.id));
  }

  return (
    <HeaderContainer>
      {/* Group selection dropdown  */}
      <SentenceGroupSelector />

      <View className="flex-1 flex-row items-center p-2">
        {/* Select All checkbox */}
        <SelectAllCheckbox
          selectedCount={selectedSentenceIds.length}
          visibleCount={visibleSentences.length}
          onToggle={toggleSelectAll}
        />
      </View>

      {/* More Actions */}
      <View className="w-20 flex-row justify-center">
        <SentenceSelectionOverflowMenu />
      </View>

      {/* Exit Selection Mode */}
      <View>
        <TouchableOpacity
          onPress={exitSelectionMode}
          className="h-10 w-10 items-center justify-center rounded-md"
        >
          <Ionicons name="close-circle" size={22} color="#334155" />
        </TouchableOpacity>
      </View>
    </HeaderContainer>
  );
}
