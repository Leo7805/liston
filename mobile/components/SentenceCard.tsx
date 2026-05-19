import { Text, View, TouchableOpacity, Pressable } from 'react-native';
import { SentenceItem } from '@/types/sentences';
import Swipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useRef, useEffect, useState } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { useUiStore } from '@/stores/uiStore';

/**
 * This component is responsible for displaying a single sentence card,
 * which includes the original sentence and its translation.
 */

type SentenceCardProps = {
  sentence: SentenceItem;
  currentOpenSwipeId: string | null;
  onSwipeOpen: () => void;
};

export function SentenceCard({
  sentence,
  currentOpenSwipeId,
  onSwipeOpen,
}: SentenceCardProps) {
  /** Guard against repeated deletions */
  const [isDeleting, setIsDeleting] = useState(false); // State to track if the sentence is being deleted

  const swipeableRef = useRef<SwipeableMethods>(null);

  // Close swipeable actions when another card/sentence is swiped open
  useEffect(() => {
    if (currentOpenSwipeId !== sentence.id) {
      swipeableRef.current?.close();
    }
  }, [currentOpenSwipeId, sentence.id]);

  function closeSwipeable() {
    swipeableRef.current?.close();
  }

  function handleEdit() {
    closeSwipeable();

    useUiStore.getState().setEditingSentence(sentence); // Set the current editing sentence in UI store

    useUiStore.getState().openSentenceEditor(); // Open the sentence editor modal
  }

  async function handleDelete(sentenceId: string) {
    if (isDeleting) return; // Prevent multiple deletions

    setIsDeleting(true);

    closeSwipeable();

    try {
      await usePlayerStore.getState().deleteItemFromPlayingList(sentenceId);
    } finally {
      setIsDeleting(false);
    }
  }

  /* Play the sentence when the card is pressed */
  function handleSentencePress() {
    closeSwipeable();

    usePlayerStore.getState().playSentence(sentence);
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
          <TouchableOpacity
            onPress={handleEdit}
            className="w-20 items-center justify-center bg-blue-500"
          >
            <Text className="text-white">Edit</Text>
          </TouchableOpacity>

          {/* Delete button */}
          <TouchableOpacity
            onPress={() => handleDelete(sentence.id)}
            className="w-20 items-center justify-center bg-red-500"
          >
            <Text className="text-white">Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    >
      {/* Original sentence and translation */}
      <Pressable onPress={handleSentencePress}>
        {({ pressed }) => (
          <View
            style={{
              transform: [{ scale: pressed ? 0.98 : 1 }],
            }}
            className="rounded-3xl bg-emerald-200 px-3 py-2"
          >
            {/* Original */}
            <Text className="text-xl font-semibold text-slate-900">
              {sentence.original}
            </Text>

            {/* Translation */}
            <Text className="text-base text-gray-500">
              {sentence.translation}
            </Text>
          </View>
        )}
      </Pressable>
    </Swipeable>
  );
}
