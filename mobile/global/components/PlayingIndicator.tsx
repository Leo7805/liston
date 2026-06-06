import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

type PlayingIndicatorProps = {
  visible: boolean;
  size?: number;
};

export function PlayingIndicator({
  visible,
  size = 12,
}: PlayingIndicatorProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      scale.setValue(1);
      opacity.setValue(1);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.25,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]),
      {
        iterations: -1,
        resetBeforeIteration: false, // ⭐ 关键：不重置初始值
      }
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [visible, scale, opacity]);

  return (
    <View
      style={{
        width: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {visible && (
        <Animated.View
          style={{
            transform: [{ scale }],
            opacity,
          }}
        >
          <Ionicons name="musical-notes" size={size} color="#0ea5e9" />
        </Animated.View>
      )}
    </View>
  );
}
