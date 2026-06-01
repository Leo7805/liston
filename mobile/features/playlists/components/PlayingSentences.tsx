import { useEffect, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { PlaylistSentenceRow } from '@/features/playlists/components/PlaylistSentenceRow';
import { usePlayerStore } from '@/features/player/player.store';
import { usePlaylistStore } from '../playlist.store';
import { SentenceItem } from '@/features/sentences/sentence.types';
import { useSentenceStore } from '@/features/sentences/sentence.store';

/**
 * Playing sentences list
 */

export function PlayingSentences() {
  const currentPlaylistId = usePlaylistStore((s) => s.currentPlaylistId); // Current playlist ID
  const playlists = usePlaylistStore((s) => s.playlists); // All playlists
  const sentences = useSentenceStore((s) => s.sentences); // All sentences

  /** ID of currently opened swipeable sentence (for edit/delete actions) */
  const [openSwipeId, setOpenSwipeId] = useState<string | null>(null);

  /** The "playingItem" change events: save current playing sentence */
  useEffect(() => {
    if (!currentPlaylistId) {
      usePlayerStore.getState().idle();
      return;
    }
  }, [currentPlaylistId]);

  /** Get the list of sentences in the currently playing playlist */
  const playingSentences: SentenceItem[] = useMemo(() => {
    const currentPlaylist =
      playlists.find((p) => p.id === currentPlaylistId) ?? null;

    if (!currentPlaylist) return [];

    const sentenceIds = currentPlaylist.items.map((item) => item.sentenceId);

    return sentences.filter((s) => sentenceIds.includes(s.id));
  }, [playlists, sentences, currentPlaylistId]);

  return (
    <FlatList
      data={playingSentences}
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
        <PlaylistSentenceRow
          sentence={item}
          currentOpenSwipeId={openSwipeId} // Set currentOpenSwipeId props to local "openSwipeId" state
          onSwipeOpen={() => setOpenSwipeId(item.id)} // 3. Open action
        />
      )}
    />
  );
}
