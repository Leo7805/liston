import { useUiStore } from '@/global/stores/ui.store';
import { Modal, View, Text, Button } from 'react-native';

export function GlobalErrorModal() {
  const error = useUiStore((s) => s.error);

  return (
    <Modal visible={!!error} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black bg-opacity-50">
        <View className="bg-white rounded-lg p-6 w-3/4">
          <Text className="text-lg font-bold mb-4">Error</Text>
          <Text className="mb-4">{error}</Text>
          <Button
            title="Close"
            onPress={() => useUiStore.getState().clearError()}
          />
        </View>
      </View>
    </Modal>
  );
}
