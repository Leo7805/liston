import { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSentenceStore } from '@/features/sentences/sentence.store';
import { LibrarySentenceRow } from '@/features/sentences/components/LibrarySentenceRow';
import { useUiStore } from '@/global/stores/ui.store';
import { normalizeText } from '@/global/utils/text';

export function LibrarySentences() {
  const sentenceList = useSentenceStore((s) => s.sentences); // All sentences
  const currentGroupId = useSentenceStore((s) => s.currentGroupId); // Current selected group ID
  const sentenceSearchText = useUiStore((s) => s.sentenceSearchText); // Current search keyword

  const [openSwipeId, setOpenSwipeId] = useState<string | null>(null); // State to track the currently open swipeable item

  /** Visible sentences for the current group */
  const visibleSentences = useMemo(() => {
    return currentGroupId === null
      ? sentenceList
      : sentenceList.filter((s) => s.groupId === currentGroupId);
  }, [sentenceList, currentGroupId]);

  /** Filter sentences based on the current group selection and search keyword. */
  const filteredSentences = useMemo(() => {
    const keyword = normalizeText(sentenceSearchText).toLocaleLowerCase();

    // const visibleSentences =
    //   currentGroupId === null
    //     ? sentenceList // If no group is selected, show all sentences
    //     : sentenceList.filter((s) => s.groupId === currentGroupId); // Otherwise, filter sentences by the selected group

    const filteredSentences = keyword
      ? visibleSentences.filter((s) => {
          const normalizedOriginal = normalizeText(
            s.original
          ).toLocaleLowerCase();
          const normalizedTranslation = normalizeText(
            s.translation
          ).toLocaleLowerCase();

          return (
            normalizedOriginal.includes(keyword) ||
            normalizedTranslation.includes(keyword)
          );
        })
      : visibleSentences;

    return filteredSentences;
  }, [visibleSentences, sentenceSearchText]);

  /** Close any open swipeable items */
  function closeOpenSwipeables() {
    setOpenSwipeId(null); // Reset the open swipe ID to null, which will trigger all SentenceCards to close their swipeable actions
  }

  /** Handle when a swipeable item is opened */
  function handleSwipeOpen(sentenceId: string) {
    setOpenSwipeId(sentenceId);
  }

  return (
    <FlatList
      data={filteredSentences}
      keyExtractor={(item) => item.id} // Use sentence ID as key
      // onTouchStart={closeOpenSwipeables} // 1. Touch action. Close any open swipeable when touching the list
      onScrollBeginDrag={closeOpenSwipeables} // 2. Scroll action. Close any open swipeable when scrolling
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        // gap: 10,
        paddingBottom: 250,
        paddingTop: 16,
      }}
      ItemSeparatorComponent={() => <View style={{ height: 15 }} />} // replace gap with separator for better performance
      renderItem={(
        { item } // SentenceCard: for Each Sentence
      ) => (
        // Each Sentence
        <LibrarySentenceRow
          sentence={item}
          // isSelected={selectedSentenceIds.includes(item.id)}
          // isSelectionMode={isSelectionMode}
          // onPress={() => handleSentencePress(item.id)}
          // onLongPress={() => handleSentenceLongPress(item.id)}
          currentOpenSwipeId={openSwipeId} // Set currentOpenSwipeId props to local "openSwipeId" state
          onSwipeOpen={() => handleSwipeOpen(item.id)} // 3. Open action
        />
      )}
    />
  );
}
