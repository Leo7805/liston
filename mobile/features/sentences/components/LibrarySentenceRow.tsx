import { Text, View } from 'react-native';
import Swipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SentenceItem } from '@/features/sentences/sentence.types';
import { useRef, useEffect, useState } from 'react';
import { useUiStore } from '@/global/stores/ui.store';
import { ActionButton } from '@/global/components/ActionButton';
import { PressableView } from '@/global/components/PressableView';
import { useSentenceSelectionStore } from '@/features/sentences/sentenceSelection.store';
import { deleteSentencesEverywhere } from '@/features/sentences/sentencePlaylist.actions';

/**
 * This component is responsible for displaying a single sentence row,
 * which includes the original sentence and its translation.
 */

type LibrarySentenceRowProps = {
  sentence: SentenceItem;
  currentOpenSwipeId: string | null;
  onSwipeOpen: () => void;
  // isSelected: boolean;
  // isSelectionMode: boolean;
  // onPress: () => void;
  // onLongPress: () => void;
};

export function LibrarySentenceRow({
  sentence,
  currentOpenSwipeId,
  onSwipeOpen,
  // isSelected,
  // isSelectionMode,
  // onPress,
  // onLongPress,
}: LibrarySentenceRowProps) {
  /** Guard against repeated deletions */
  const [isDeleting, setIsDeleting] = useState(false); // State to track if the sentence is being deleted

  /** Reference to the swipeable component */
  const swipeableRef = useRef<SwipeableMethods>(null);

  const { setEditingSentenceId, openSentenceEditor } = useUiStore.getState();

  /** Get selection state from the sentence selection store */
  const isSelectionMode = useSentenceSelectionStore((s) => s.isSelectionMode);
  const selectedSentenceIds = useSentenceSelectionStore(
    (s) => s.selectedSentenceIds
  );
  const { toggleSentenceSelection, enterSelectionMode } =
    useSentenceSelectionStore.getState();
  const isSelected = selectedSentenceIds.includes(sentence.id);

  /** Close swipeable actions when another card/sentence is swiped open */
  useEffect(() => {
    if (currentOpenSwipeId !== sentence.id) {
      swipeableRef.current?.close();
    }
  }, [currentOpenSwipeId, sentence.id]);

  /** Close the swipeable component */
  function closeSwipeable() {
    swipeableRef.current?.close();
  }

  /** Handle edit action */
  function handleEdit() {
    closeSwipeable();

    setEditingSentenceId(sentence.id);

    openSentenceEditor(); // Open the sentence editor modal
  }

  /** Handle delete action */
  function handleDelete(sentenceId: string) {
    if (isDeleting) return; // Prevent multiple deletions

    setIsDeleting(true);

    closeSwipeable();

    try {
      deleteSentencesEverywhere([sentenceId]);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleSentencePress(sentenceId: string) {
    if (isSelectionMode) {
      toggleSentenceSelection(sentenceId);
    } else {
      // Handle sentence press logic when not in selection mode
    }
  }

  function handleSentenceLongPress(sentenceId: string) {
    toggleSentenceSelection(sentenceId);
    enterSelectionMode(); // Enter selection mode when a sentence is long-pressed
  }

  return (
    /* Right swipe actions: Edit and Delete buttons */
    <Swipeable
      ref={swipeableRef}
      enabled={!isSelectionMode} // Disable swipe actions when in selection mode
      dragOffsetFromRightEdge={30} // Adjust this value based on the width of your action buttons
      onSwipeableOpen={onSwipeOpen}
      renderRightActions={() => (
        // Edit and Delete buttons
        <View className="ml-3 flex-row overflow-hidden rounded-3xl">
          {/* Edit button */}
          <ActionButton title="Edit" onPress={handleEdit} />

          {/* Delete button */}
          <ActionButton
            title="Delete"
            variant="danger"
            onPress={() => handleDelete(sentence.id)}
            disabled={isDeleting}
          />
        </View>
      )}
    >
      {/* Sentence content with press and long press actions */}
      <PressableView
        onPress={() => handleSentencePress(sentence.id)}
        onLongPress={() => handleSentenceLongPress(sentence.id)}
        className={
          isSelected
            ? 'rounded-3xl border-2 border-amber-600 bg-teal-400 px-3 py-2'
            : 'rounded-3xl border-2 border-transparent bg-emerald-200 px-3 py-2'
        }
      >
        {/* Original Sentence */}
        <Text className="text-lg font-semibold text-slate-900">
          {sentence.original}
        </Text>

        {/* Translation Sentence */}
        <Text className="text-base text-gray-500">{sentence.translation}</Text>
      </PressableView>
    </Swipeable>
  );
}
