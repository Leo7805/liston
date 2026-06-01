import { Pressable, View } from 'react-native';
import type { ReactNode } from 'react';

/**
 * A reusable Pressable component that applies a scaling and opacity effect when pressed.
 */

type PressableViewProps = {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
  onLongPress?: () => void;
};

export function PressableView({
  children,
  className,
  onPress,
  onLongPress,
}: PressableViewProps) {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} delayLongPress={200}>
      {({ pressed }) => (
        <View
          className={className}
          style={{
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.8 : 1,
          }}
        >
          {children}
        </View>
      )}
    </Pressable>
  );
}
