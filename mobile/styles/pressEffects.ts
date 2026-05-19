import type { PressableStateCallbackType, ViewStyle } from 'react-native';

/** Press effect style for touchable components (<Pressable>) */

export function createIconButtonPressStyle({
  size = 40,
  scale = 0.92,
  opacity = 0.7,
} = {}) {
  return ({ pressed }: PressableStateCallbackType): ViewStyle => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    opacity: pressed ? opacity : 1,
    transform: [{ scale: pressed ? scale : 1 }],
  });
}
