import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Pressable } from 'react-native';

export function PlaylistMoreMenuButton() {
  return (
    <Pressable className="h-11 w-11 items-center justify-center rounded-xl bg-white/20 active:bg-white/30">
      <Ionicons name="ellipsis-horizontal" size={22} color="white" />
    </Pressable>
  );
}
