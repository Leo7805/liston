import { Modal, Pressable, View, TouchableOpacity, Text } from 'react-native';
import { ReactNode } from 'react';
import { AppButton } from './AppButton';

type AppModalProps = {
  visible?: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  hasCloseButton?: boolean;
};

export function AppModal({
  visible = true,
  title,
  children,
  onClose,
  onConfirm = () => {},
  confirmText = 'Confirm',
  hasCloseButton = false,
}: AppModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      {/* Transparent backdrop */}
      <Pressable
        className="flex-1 justify-start bg-black/60 px-2 pt-[100px]"
        onPress={onClose}
      >
        {/* Modal content */}
        <Pressable
          className="rounded-3xl bg-teal-300 p-5"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            {/* Title */}
            <Text className="text-2xl font-bold text-slate-950">{title}</Text>

            {/* Close Button */}
            {hasCloseButton && (
              <TouchableOpacity onPress={onClose}>
                <Text className="text-base">✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Content */}
          {children}

          {/* Buttons */}
          <View className="mt-8 flex-row gap-3">
            {/* Cancel button */}
            <AppButton title="Cancel" onPress={onClose} variant="secondary" />

            {/* Confirm button */}
            <AppButton
              title={confirmText}
              onPress={onConfirm}
              variant="primary"
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
