import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUiStore } from '@/global/stores/ui.store';
import { usePlayerStore } from '@/features/player/player.store';
import { getSentenceByPlaylistItemId } from '@/features/sentences/sentencePlaylist.actions';

type FullPlayerModalProps = {
  onPrevious?: () => void;
  onNext?: () => void;
};

export function FullPlayerModal({ onPrevious, onNext }: FullPlayerModalProps) {
  const showFullPlayer = useUiStore((s) => s.showFullPlayer);
  const sentence = getSentenceByPlaylistItemId(
    usePlayerStore((s) => s.playlistItemId)
  ); // Get the currently playing sentence based on the playlist item ID
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  function handleClose() {
    useUiStore.getState().closeFullPlayer();
  }

  function handleTogglePlay() {
    usePlayerStore.getState().togglePlay();
  }

  return (
    <Modal
      visible={showFullPlayer}
      animationType="slide"
      presentationStyle="overFullScreen"
    >
      {/* Full player content */}
      <View className="flex-1 bg-emerald-900 px-6 pt-14 pb-10">
        {/* Close button, title, and spacing */}
        <View className="flex-row items-center justify-between mb-10">
          {/* Close button */}
          <Pressable onPress={handleClose}>
            <Ionicons name="chevron-down" size={30} color="#f8f8f8" />
          </Pressable>

          {/* Title */}
          <Text className="text-emerald-600 text-xl font-semibold">
            Now Playing
          </Text>

          {/* Placeholder for spacing */}
          <View className="w-[30px]" />
        </View>

        {/* Playing sentence display */}
        <View className="flex-1 justify-center">
          <View className="bg-neutral-900/70 border border-zinc-800 rounded-3xl px-6 py-8 mb-20">
            <Text className="text-white text-2xl font-semibold text-center leading-9">
              {sentence?.original ?? 'No sentence selected'}
            </Text>

            <Text className="text-zinc-400 text-base text-center mt-5 leading-7">
              {sentence?.translation ?? 'Tap a sentence to start'}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-center gap-12 mb-8">
          <Pressable onPress={onPrevious}>
            <Ionicons name="play-skip-back" size={34} color="white" />
          </Pressable>

          <Pressable
            onPress={handleTogglePlay}
            className="w-20 h-20 rounded-full bg-white items-center justify-center"
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={38}
              color="black"
            />
          </Pressable>

          <Pressable onPress={onNext}>
            <Ionicons name="play-skip-forward" size={34} color="white" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
