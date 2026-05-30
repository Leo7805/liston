import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useUiStore } from '@/global/stores/ui.store';
import { HeaderContainer } from './HeaderContainer';

export function SentenceSearchHeader() {
  const sentenceSearchText = useUiStore((s) => s.sentenceSearchText);
  const { setSentenceSearchText, closeSentenceSearch } = useUiStore.getState();

  return (
    <HeaderContainer>
      <View className="flex-row items-center">
        <View className="h-11 flex-1 flex-row items-center rounded-xl bg-gray-200 px-3">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            value={sentenceSearchText}
            onChangeText={setSentenceSearchText}
            placeholder="Search sentences..."
            autoFocus
            className="ml-2 flex-1 text-gray-900"
            placeholderTextColor="#9ca3af"
            returnKeyType="search" // Show "Search" on the keyboard instead of "Return"
          />

          {/* Clear button */}
          {sentenceSearchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSentenceSearchText('')}
              className="ml-2 h-7 w-7 items-center justify-center rounded-full"
            >
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        {/* Close button */}
        <TouchableOpacity
          onPress={closeSentenceSearch}
          className="ml-2 h-10 w-10 items-center justify-center"
        >
          <Ionicons name="close" size={22} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </HeaderContainer>
  );
}
