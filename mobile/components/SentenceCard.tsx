import { Text, View, TouchableOpacity, Pressable } from 'react-native';
import { SentenceItem } from '@/types/sentences';
import Swipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useRef, useEffect } from 'react';

/**
 * This component is responsible for displaying a single sentence card,
 * which includes the original sentence and its translation.
 */

type SentenceCardProps = {
  sentence: SentenceItem;
  openSwipeId: string | null;
  onSwipeOpen: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onPress?: () => void; // Optional callback for when the card is pressed (e.g., to play audio)
};

export function SentenceCard({
  sentence,
  openSwipeId,
  onSwipeOpen,
  onDelete,
  onEdit,
  onPress,
}: SentenceCardProps) {
  const swipeableRef = useRef<SwipeableMethods>(null);

  // Close swipeable actions when another card is swiped open
  useEffect(() => {
    if (openSwipeId !== sentence.id) {
      swipeableRef.current?.close();
    }
  }, [openSwipeId, sentence.id]);

  function closeSwipeable() {
    swipeableRef.current?.close();
  }

  return (
    <Swipeable
      // Right swipe actions: Edit and Delete buttons
      ref={swipeableRef}
      onSwipeableOpen={onSwipeOpen}
      renderRightActions={() => (
        <View className="ml-3 flex-row overflow-hidden rounded-3xl">
          {/* Edit button */}
          <TouchableOpacity
            onPress={() => {
              closeSwipeable();
              onEdit?.();
            }}
            className="w-20 items-center justify-center bg-blue-500"
          >
            <Text className="text-white">Edit</Text>
          </TouchableOpacity>

          {/* Delete button */}
          <TouchableOpacity
            onPress={() => {
              closeSwipeable();
              onDelete?.();
            }}
            className="w-20 items-center justify-center bg-red-500"
          >
            <Text className="text-white">Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <View
            style={{
              transform: [{ scale: pressed ? 0.98 : 1 }],
            }}
            className="rounded-3xl bg-emerald-200 px-3 py-2"
          >
            <Text className="text-xl font-semibold text-slate-900">
              {sentence.original}
            </Text>

            <Text className="text-base text-gray-500">
              {sentence.translation}
            </Text>
          </View>
        )}
      </Pressable>
    </Swipeable>
  );
}
