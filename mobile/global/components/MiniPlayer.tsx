import { useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { usePlayingTextAnimation } from '@/features/player/usePlayingTextAnimation';
import { usePlayerStore } from '@/features/player/player.store';
import { useUiStore } from '@/global/stores/ui.store';
import { usePlaylistStore } from '@/features/playlists/playlist.store';
import { useSentenceStore } from '@/features/sentences/sentence.store';

/** Props for MiniPlayer component */
type MiniPlayerProps = {
  onNext?: () => void; // Callback to go to the next sentence
  onOpenMenu?: () => void; // Callback to open additional options menu
  onOpenFullPlayer?: () => void; // Callback to open the full player screen
};

export function MiniPlayer({
  onNext,
  onOpenMenu,
  onOpenFullPlayer,
}: MiniPlayerProps) {
  const currentItemId = usePlayerStore((s) => s.playlistItemId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const { togglePlay } = usePlayerStore.getState();

  const playlists = usePlaylistStore((s) => s.playlists);
  const sentences = useSentenceStore((s) => s.sentences);

  /** Get the animated value for the playing text animation */
  const translateX = usePlayingTextAnimation();

  /* Open full player modal */
  function handleOpenFullPlayer() {
    useUiStore.getState().openFullPlayer();
    // console.log('Open full player');
  }

  /** Get the currently playing sentence based on the currentItemId */
  const playingSentence = useMemo(() => {
    if (!currentItemId) return null;

    const playlistItem = playlists
      .flatMap((p) => p.items)
      .find((item) => item.id === currentItemId);

    if (!playlistItem) return null;

    return sentences.find((s) => s.id === playlistItem.sentenceId) ?? null;
  }, [currentItemId, playlists, sentences]);

  return (
    <Pressable onPress={handleOpenFullPlayer}>
      <BlurView
        intensity={50}
        tint="dark"
        className="absolute w-full bottom-24 rounded-2xl overflow-hidden"
      >
        <View className="px-4 py-3 flex-row items-center gap-8">
          {/* Sentence Text on MiniPlayer */}
          <View className="flex-1">
            <Animated.Text
              className="text-white font-semibold"
              numberOfLines={1}
              style={{ transform: [{ translateX }] }}
            >
              {playingSentence?.original}
            </Animated.Text>
            <Text className="text-zinc-400 text-sm" numberOfLines={1}>
              {playingSentence?.translation}
            </Text>
          </View>

          {/* Play/Pause */}
          <TouchableOpacity
            activeOpacity={0.25}
            onPress={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="h-10 w-10 items-center justify-center rounded-full"
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          {/* Next button */}
          <TouchableOpacity
            activeOpacity={0.25}
            onPress={(e) => {
              e.stopPropagation();
              onNext?.();
            }}
            className="h-10 w-10 items-center justify-center rounded-full"
          >
            <Ionicons name="play-forward" size={24} color="white" />
          </TouchableOpacity>

          {/* Menu button */}
          <TouchableOpacity
            activeOpacity={0.25}
            onPress={(e) => {
              e.stopPropagation();
              onOpenMenu?.();
            }}
            className="h-10 w-10 items-center justify-center rounded-full"
          >
            <Ionicons name="reorder-three" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </Pressable>
  );
}
