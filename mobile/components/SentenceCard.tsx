import { Text, View, TouchableOpacity } from 'react-native';
import { SentenceItem } from '@/types/sentences';
import Swipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useRef } from 'react';

/**
 * This component is responsible for displaying a single sentence card,
 * which includes the original sentence and its translation.
 */

type SentenceCardProps = {
  sentence: SentenceItem;
  onDelete?: () => void;
  onEdit?: () => void;
};

export function SentenceCard({
  sentence,
  onDelete,
  onEdit,
}: SentenceCardProps) {
  const swipeableRef = useRef<SwipeableMethods>(null);

  function closeSwipeable() {
    swipeableRef.current?.close();
  }

  return (
    <Swipeable
      // Right swipe actions: Edit and Delete buttons
      ref={swipeableRef}
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
      <View className="rounded-3xl bg-emerald-200 px-3 py-2">
        {/* <View className="rounded-3xl bg-slate-900 p-5"> */}
        <Text className="text-xl font-semibold text-slate-900">
          {sentence.original}
        </Text>

        <Text className="text-base text-gray-500">
          {/* <Text className="mt-2 text-base text-slate-400"> */}
          {sentence.translation}
        </Text>
      </View>
    </Swipeable>
  );
}
