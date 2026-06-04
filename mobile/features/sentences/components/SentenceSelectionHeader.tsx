import { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSentenceSelectionStore } from '@/features/sentences/sentenceSelection.store';
import { HeaderContainer } from '@/global/components/HeaderContainer';
import { useSentenceStore } from '@/features/sentences/sentence.store';
import { deleteSentencesEverywhere } from '@/features/sentences/sentencePlaylist.actions';

type SelectAllState = 'all' | 'none' | 'partial';

export function SentenceSelectionHeader() {
  const selectedSentenceIds = useSentenceSelectionStore(
    (s) => s.selectedSentenceIds
  );
  // const { deleteSentences } = useSentenceStore.getState();

  const isSelectionMode = useSentenceSelectionStore((s) => s.isSelectionMode);
  const {
    clearSentenceSelection,
    selectSentences,
    exitSelectionMode,
    openMoveToGroupModal,
    openAddToPlaylistModal,
  } = useSentenceSelectionStore.getState();

  const currentGroupId = useSentenceStore((s) => s.currentGroupId);
  const sentenceList = useSentenceStore((s) => s.sentences);

  const isNoneSelected = selectedSentenceIds.length === 0;
  const isDisabled = isNoneSelected;

  const visibleSentences = useMemo(() => {
    return currentGroupId === null
      ? sentenceList
      : sentenceList.filter((s) => s.groupId === currentGroupId);
  }, [currentGroupId, sentenceList]);

  const { showActionSheetWithOptions } = useActionSheet();

  /* Sentence selection action sheet */
  function openSelectionActionSheet() {
    showActionSheetWithOptions(
      {
        options: [' 📁 Move to Group', ' 🗑️ Delete', 'Cancel'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          openMoveToGroupModal();
        }

        if (buttonIndex === 1) {
          deleteSentencesEverywhere(selectedSentenceIds);
        }
      }
    );
  }

  /* Determine the "Select All" state based on the number of selected sentences and visible sentences */
  function getSelectAllState(): SelectAllState {
    if (selectedSentenceIds.length === 0) return 'none';

    if (selectedSentenceIds.length === visibleSentences.length) return 'all';

    return 'partial';
  }

  /* Get the appropriate icon name for the "Select All" button based on the current selection state */
  function getSelectAllIcon() {
    const state = getSelectAllState();

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

  // If not in selection mode, don't render the header (Guard clause)
  if (!isSelectionMode) return null;

  return (
    <HeaderContainer>
      {/* Select All / Partial / None */}
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={toggleSelectAll}
          className="h-10 flex-row items-center justify-center rounded-md pl-2"
        >
          <Ionicons name={getSelectAllIcon()} size={23} color="#334155" />
        </TouchableOpacity>
        <Text className="text-zinc-700">Select All</Text>
      </View>

      {/* Selection count */}
      <View className="flex-1 min-w-0 items-center justify-center">
        <Text className="text-zinc-700" numberOfLines={1}>
          {selectedSentenceIds.length} selected
        </Text>
      </View>

      {/* Add to playlist */}
      <TouchableOpacity
        onPress={openAddToPlaylistModal}
        disabled={isDisabled}
        className={
          isDisabled
            ? 'h-10 w-10 items-center justify-center opacity-50'
            : 'h-10 w-10 items-center justify-center'
        }
      >
        <Ionicons
          name="caret-forward-circle-outline"
          size={22}
          color="#334155"
        />
      </TouchableOpacity>

      {/* More Actions */}
      <TouchableOpacity
        disabled={isDisabled}
        onPress={openSelectionActionSheet}
        className={
          isDisabled
            ? 'h-10 w-10 items-center justify-center opacity-50'
            : 'h-10 w-10 items-center justify-center'
        }
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#334155" />
      </TouchableOpacity>

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
