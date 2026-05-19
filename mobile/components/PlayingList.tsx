import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SentenceCard } from '@/components/SentenceCard';
import { usePlayerStore } from '@/stores/playerStore';

export function PlayingList() {
  const playingList = usePlayerStore((s) => s.playingList); // Currently playing sentence list
  const playingItem = usePlayerStore((s) => s.playingItem); // Currently playing sentence item

  /** ID of currently opened swipeable sentence (for edit/delete actions) */
  const [openSwipeId, setOpenSwipeId] = useState<string | null>(null);

  /** Sentences Initialization: Load sentences from AsyncStorage or use mock data. */
  useEffect(() => {
    usePlayerStore.getState().loadPlayingList();
  }, []);

  /** The "playingItem" change events: save current playing sentence */
  useEffect(() => {
    if (!playingItem) {
      usePlayerStore.getState().idle();
      return;
    }

    // save last playing sentence to storage (for persistence across app restarts)
    usePlayerStore.getState().saveLastPlayingSentence(playingItem);
  }, [playingItem]);

  return (
    <FlatList
      data={playingList}
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
