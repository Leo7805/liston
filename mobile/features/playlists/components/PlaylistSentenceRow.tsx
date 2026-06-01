import { Text, View } from 'react-native';
import { SentenceItem } from '@/features/sentences/sentence.types';
import Swipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useRef, useEffect, useState } from 'react';
import { usePlayerStore } from '@/features/player/player.store';
import { useUiStore } from '@/global/stores/ui.store';
import { ActionButton } from '@/global/components/ActionButton';
import { PressableView } from '@/global/components/PressableView';
import { useSentenceStore } from '@/features/sentences/sentence.store';

/**
 * This component is responsible for displaying a single sentence row,
 * which includes the original sentence and its translation.
 */

type SentenceRowProps = {
  sentence: SentenceItem;
  currentOpenSwipeId: string | null;
  onSwipeOpen: () => void;
};

export function PlaylistSentenceRow({
  sentence,
  currentOpenSwipeId,
  onSwipeOpen,
}: SentenceRowProps) {
  /** Guard against repeated deletions */
  const [isDeleting, setIsDeleting] = useState(false); // State to track if the sentence is being deleted

  /** Reference to the swipeable component */
  const swipeableRef = useRef<SwipeableMethods>(null);

  const { setEditingSentenceId, openSentenceEditor } = useUiStore.getState();
  const { deleteSentences } = useSentenceStore.getState();

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
      deleteSentences([sentenceId]);
    } finally {
      setIsDeleting(false);
    }
  }

  /* Play the sentence when the card is pressed */
  function handleSentencePress() {
    usePlayerStore.getState().play(sentence.id);
  }

  return (
    /* Right swipe actions: Edit and Delete buttons */
    <Swipeable
      ref={swipeableRef}
      onSwipeableOpen={onSwipeOpen}
      renderRightActions={() => (
        // Edit and Delete buttons
        <View className="ml-3 flex-row overflow-hidden rounded-3xl">
          {/* Edit button */}
          {/* <Pressable
            onPress={handleEdit}
            className="w-20 items-center justify-center bg-blue-500 active:opacity-30"
          >
            <Text className="text-white">Edit</Text>
          </Pressable> */}
          <ActionButton title="Edit" onPress={handleEdit} />

          {/* Delete button */}

          {/* <TouchableOpacity
            onPress={() => handleDelete(sentence.id)}
            className="w-20 items-center justify-center bg-red-500"
          >
            <Text className="text-white">Delete</Text>
          </TouchableOpacity> */}

          <ActionButton
            title="Delete"
            variant="danger"
            onPress={() => handleDelete(sentence.id)}
            disabled={isDeleting}
          />
        </View>
      )}
    >
      <PressableView
        onPress={handleSentencePress}
        className="rounded-3xl bg-emerald-200 px-3 py-2 "
      >
        {/* Original Sentence */}
        <Text className="text-xl font-semibold text-slate-900">
          {sentence.original}
        </Text>

        {/* Translation Sentence */}
        <Text className="text-base text-gray-500">{sentence.translation}</Text>
      </PressableView>
    </Swipeable>
  );
}
