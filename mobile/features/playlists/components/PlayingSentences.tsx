import { useEffect, useMemo } from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { usePlayerStore } from '@/features/player/player.store';
import { usePlaylistStore } from '@/features/playlists/playlist.store';
import { useSentenceStore } from '@/features/sentences/sentence.store';
import { getItemById } from '@/global/utils/helpers';
import { useUiStore } from '@/global/stores/ui.store';
import { normalizeText } from '@/global/utils/text';
import { PlaylistItem } from '@/features/playlists/playlist.types';

/**
 * Playing sentences list
 */

export function PlayingSentences() {
  const currentPlaylistId = usePlaylistStore((s) => s.currentPlaylistId); // Current playlist ID
  const currentPlaylistItemId = usePlayerStore((s) => s.playlistItemId); // Currently playing playlist item ID
  const playlists = usePlaylistStore((s) => s.playlists); // All playlists
  const sentences = useSentenceStore((s) => s.sentences); // All sentences
  const sentenceSearchText = useUiStore((s) => s.sentenceSearchText); // Search keyword for sentences

  const { play } = usePlayerStore.getState();

  /** ID of currently opened swipeable sentence (for edit/delete actions) */
  // const [openSwipeId, setOpenSwipeId] = useState<string | null>(null);

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

  /** Get the list of sentences in the currently playing playlist */
  // const playingSentences: PlaylistItem[] = useMemo(() => {
  //   const currentPlaylist = playlists.find((p) => p.id === currentPlaylistId);

  //   return currentPlaylist ? currentPlaylist.items : [];
  // }, [playlists, currentPlaylistId]);

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
        // Each Sentence
        // <View className=" px-4 py-2 flex-row items-start gap-2">
        //   <Text className="text-xl font-semibold text-slate-700">
        //     {item.original}
        //   </Text>

        //   <Text className="text-base text-gray-500">{item.translation}</Text>
        // </View>

        // <TouchableOpacity
        //   className="px-4 py-2 active:opacity-60"
        //   onPress={() => play(item.id)}
        // >
        //   <View className="flex-row items-start gap-2">
        //     {/* index */}
        //     <Text className="text-base text-slate-600 w-6 text-right">
        //       {index + 1}.
        //     </Text>

        //     {/* text block */}
        //     <View className="flex-1">
        //       <Text className="text-lg font-semibold text-slate-900">
        //         {item.original}
        //       </Text>

        //       <Text className="text-sm text-slate-500 mt-1">
        //         {item.translation}
        //       </Text>
        //     </View>
        //   </View>
        // </TouchableOpacity>

        const sentence = getItemById(item.sentenceId, sentences);
        const isCurrentlyPlaying = currentPlaylistItemId === item.id;

        return (
          <TouchableOpacity
            className="px-4 py-2 active:opacity-60"
            onPress={() => play(item.id)}
          >
            <View className="flex-row items-start gap-2">
              {/* index */}
              <Text
                className={
                  isCurrentlyPlaying
                    ? 'text-sm text-amber-600 w-6 text-right py-1 mr-2'
                    : 'text-sm text-slate-600 w-6 text-right py-1 mr-2'
                }
              >
                {index + 1}.
              </Text>

              <View className="flex-1">
                <Text
                  className={
                    isCurrentlyPlaying
                      ? 'text-lg font-semibold text-amber-600'
                      : 'text-lg font-semibold text-slate-900'
                  }
                >
                  {sentence?.original}
                  {!!sentence?.translation && (
                    <Text
                      className={
                        isCurrentlyPlaying
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
        );
      }}
    />
  );
}
