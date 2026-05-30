import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function SentenceSearchButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="h-10 w-10 items-center justify-center rounded-xl "
    >
      <Ionicons name="search" size={22} color="#6b7280" />
    </TouchableOpacity>
  );
}
