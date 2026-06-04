import { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSentenceSelectionStore } from '@/features/sentences/sentenceSelection.store';
import { HeaderContainer } from '@/global/components/HeaderContainer';
import { useSentenceStore } from '@/features/sentences/sentence.store';
import { SentenceSelectionOverflowMenu } from '@/features/sentences/components/SentenceSelectionOverflowMenu';
import { SentenceGroupSelector } from './SentenceGroupSelector';

/** Three-state selection status */
type SelectAllState = 'all' | 'none' | 'partial';

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

  /* Determine the "Select All" icon state based on the number of selected sentences and visible sentences */
  function getSelectAllIconState(): SelectAllState {
    if (selectedSentenceIds.length === 0) return 'none';

    if (selectedSentenceIds.length === visibleSentences.length) return 'all';

    return 'partial';
  }

  /* Get the appropriate icon name for the "Select All" button based on the current selection state */
  function getSelectAllIconName() {
    const state = getSelectAllIconState();

    if (state === 'all') return 'checkbox';
    if (state === 'partial') return 'checkbox-outline';

    return 'square-outline';
  }

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
        <TouchableOpacity
          onPress={toggleSelectAll}
          className="h-10 flex-row items-center justify-center pl-2"
        >
          <Ionicons name={getSelectAllIconName()} size={23} color="#334155" />
          <View className="flex-row items-center">
            <Text className="text-zinc-700">Select All</Text>
            <Text className=" text-slate-500 ml-1">
              ({selectedSentenceIds.length})
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Selection count */}
      {/* <View className="flex-1 min-w-0 items-center justify-center">
      </View> */}

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
