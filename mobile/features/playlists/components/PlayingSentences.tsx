import { useEffect, useMemo } from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { usePlayerStore } from '@/features/player/player.store';
import { usePlaylistStore } from '@/features/playlists/stores/playlist.store';
import { useSentenceStore } from '@/features/sentences/stores/sentence.store';
import { getItemById } from '@/global/utils/helpers';
import { useUiStore } from '@/global/stores/ui.store';
import { normalizeText } from '@/global/utils/text';
import { PlayingIndicator } from '@/global/components/PlayingIndicator';
import { usePlaylistItemSelectionStore } from '@/features/playlists/stores/playlistItemSelection.store';

/**
 * Playing sentences list
 */
export function PlayingSentences() {
  const currentPlaylistId = usePlaylistStore((s) => s.currentPlaylistId); // Current playlist ID
  const currentPlaylistItemId = usePlayerStore((s) => s.playlistItemId); // Currently playing playlist item ID
  const playlists = usePlaylistStore((s) => s.playlists); // All playlists
  const sentences = useSentenceStore((s) => s.sentences); // All sentences
  const sentenceSearchText = useUiStore((s) => s.sentenceSearchText); // Search keyword for sentences
  const selectedPlaylistItemIds = usePlaylistItemSelectionStore(
    (s) => s.selectedPlaylistItemIds
  ); // Selected playlist item IDs for batch actions
  const isSelectionMode = usePlaylistItemSelectionStore(
    (s) => s.isSelectionMode
  ); // Whether the playlist item selection mode is active
  const { togglePlaylistItemSelection } =
    usePlaylistItemSelectionStore.getState(); // Function to toggle playlist item selection

  const { play } = usePlayerStore.getState();

  /** The "playingItem" change events: save current playing sentence */
  useEffect(() => {
    if (!currentPlaylistId) {
      usePlayerStore.getState().idle();
      return;
    }
  }, [currentPlaylistId]);

  /** Get current playlist items (not the sentences) */
  const displayedPlaylistItems = useMemo(() => {
    return currentPlaylistId === null
      ? playlists.map((p) => p.items).flat() // If no playlist is selected, show all sentences from all playlists
      : (playlists.find((p) => p.id === currentPlaylistId)?.items ?? []); // Otherwise, show sentences from the selected playlist
  }, [playlists, currentPlaylistId]);

  /** Filter the sentences based on the current playlist items and search keyword */
  const filteredPlaylistItems = useMemo(() => {
    const keyword = normalizeText(sentenceSearchText).toLocaleLowerCase();

    const filteredItems = displayedPlaylistItems.filter((item) => {
      const sentence = sentences.find((s) => s.id === item.sentenceId);
      if (!sentence) return false;

      const normalizedOriginal = normalizeText(
        sentence.original
      ).toLocaleLowerCase();
      const normalizedTranslation = normalizeText(
        sentence.translation ?? ''
      ).toLocaleLowerCase();

      return (
        normalizedOriginal.includes(keyword) ||
        normalizedTranslation.includes(keyword)
      );
    });

    return filteredItems;
  }, [sentenceSearchText, sentences, displayedPlaylistItems]);

  return (
    <FlatList
      data={filteredPlaylistItems}
      keyExtractor={(item) => item.id} // Use sentence ID as key
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        // gap: 10,
        paddingBottom: 250,
        paddingTop: 16,
      }}
      ItemSeparatorComponent={() => <View style={{ height: 15 }} />} // replace gap with separator for better performance
      renderItem={(
        { item, index } // SentenceCard: for Each Sentence
      ) => {
        const sentence = getItemById(item.sentenceId, sentences);
        const isCurrentlyPlaying = currentPlaylistItemId === item.id;
        const isSelected = selectedPlaylistItemIds.includes(item.id);

        return (
          <View className="flex-row items-center">
            <PlayingIndicator visible={isCurrentlyPlaying} />
            <TouchableOpacity
              className="flex-1 py-2 active:opacity-60"
              onPress={
                isSelectionMode
                  ? () => togglePlaylistItemSelection(item.id)
                  : () => play(item.id)
              }
            >
              <View className="flex-row items-start gap-2">
                {/* index */}
                <Text
                  className={
                    isSelected
                      ? 'text-sm text-amber-600 w-6 text-right py-1 mr-2'
                      : 'text-sm text-slate-600 w-6 text-right py-1 mr-2'
                  }
                >
                  {index + 1}.
                </Text>

                <View className="flex-1">
                  <Text
                    className={
                      isSelected
                        ? 'text-lg font-semibold text-amber-600'
                        : 'text-lg font-semibold text-slate-900'
                    }
                  >
                    {sentence?.original}
                    {!!sentence?.translation && (
                      <Text
                        className={
                          isSelected
                            ? 'text-sm font-normal text-amber-600'
                            : 'text-sm font-normal text-slate-500'
                        }
                      >
                        {'  '}
                        {sentence.translation}
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
}
