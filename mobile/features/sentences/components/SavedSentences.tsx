import { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSentenceStore } from '@/features/sentences/sentence.store';
import { SentenceCard } from '@/features/playlists/components/SentenceCard';
import { useUiStore } from '@/global/stores/ui.store';
import { normalizeText } from '@/global/utils/text';

export function SavedSentences() {
  const sentenceList = useSentenceStore((s) => s.sentences); // All sentences
  const currentGroupId = useSentenceStore((s) => s.currentGroupId); // Current selected group ID
  const sentenceSearchText = useUiStore((s) => s.sentenceSearchText); // Current search keyword

  const [openSwipeId, setOpenSwipeId] = useState<string | null>(null); // State to track the currently open swipeable item

  /**
   * Filter sentences based on the current group selection and search keyword. The filtering logic is as follows:
   * 1. Group Filtering:
   *    - If no group is selected (currentGroupId is null), all sentences are included in the visible list.
   *   - If a group is selected, only sentences that belong to that group (sentence.groupId === currentGroupId) are included.
   * 2. Search Filtering:
   *    - If a search keyword is entered, the visible sentences are further filtered to include only those where either the original text or the translation contains the search keyword (case-insensitive).
   *    - The normalization function is used to ensure that the search is not affected by case or diacritics.
   * 3. The resulting list of sentences after applying both filters is memoized to optimize performance and avoid unnecessary recalculations when unrelated state changes occur.
   */
  const filteredSentences = useMemo(() => {
    const keyword = normalizeText(sentenceSearchText).toLocaleLowerCase();

    const visibleSentences =
      currentGroupId === null
        ? sentenceList // If no group is selected, show all sentences
        : sentenceList.filter((s) => s.groupId === currentGroupId); // Otherwise, filter sentences by the selected group

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
  }, [sentenceList, currentGroupId, sentenceSearchText]);

  return (
    <FlatList
      data={filteredSentences}
      keyExtractor={(item) => item.id} // Use sentence ID as key
      onTouchStart={() => setOpenSwipeId(null)} // 1. Touch action. Close any open swipeable when touching the list
      onScrollBeginDrag={() => setOpenSwipeId(null)} // 2. Scroll action. Close any open swipeable when scrolling
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
        <SentenceCard
          sentence={item}
          currentOpenSwipeId={openSwipeId} // Set currentOpenSwipeId props to local "openSwipeId" state
          onSwipeOpen={() => setOpenSwipeId(item.id)} // 3. Open action
        />
      )}
    />
  );
}
