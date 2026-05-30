import { Modal, Pressable, View, TouchableOpacity, Text } from 'react-native';
import { ReactNode } from 'react';

type AppModalProps = {
  visible: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function AppModal({ visible, title, children, onClose }: AppModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-center bg-black/50 px-6"
        onPress={onClose}
      >
        <Pressable
          className="rounded-2xl bg-white p-5"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-semibold">{title}</Text>

            <TouchableOpacity onPress={onClose}>
              <Text className="text-base">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
