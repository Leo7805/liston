import { View, Text, Pressable } from 'react-native';
import { SentenceItem } from '@/types/sentences';
import { PlaybackStateType } from '@/types/player';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

/** Props for MiniPlayer component */
type MiniPlayerProps = {
  sentence: SentenceItem | null; // Currently playing sentence (null if none)
  playbackState: PlaybackStateType;
  onTogglePlay: () => void; // Callback to toggle play/pause
  onNext: () => void; // Callback to go to the next sentence
  onOpenMenu?: () => void; // Optional callback to open additional options menu
};

export function MiniPlayer({
  sentence,
  playbackState,
  onTogglePlay,
  onNext,
  onOpenMenu,
}: MiniPlayerProps) {
  return (
    <BlurView
      intensity={50}
      tint="dark"
      className="absolute w-full bottom-24 rounded-2xl overflow-hidden"
    >
      <View className="px-4 py-3 flex-row items-center gap-8">
        <View className="flex-1">
          <Text className="text-white font-semibold" numberOfLines={1}>
            {sentence?.original}
          </Text>
          <Text className="text-zinc-400 text-sm" numberOfLines={1}>
            {sentence?.translation}
          </Text>
        </View>

        <Pressable onPress={onTogglePlay}>
          <Ionicons
            name={playbackState === 'playing' ? 'pause' : 'play'}
            size={24}
            color="white"
          />
        </Pressable>

        <Pressable onPress={onNext}>
          <Ionicons name="play-forward" size={24} color="white" />
        </Pressable>

        <Pressable onPress={onOpenMenu}>
          <Ionicons name="reorder-three" size={22} color="white" />
        </Pressable>
      </View>
    </BlurView>
  );
}
