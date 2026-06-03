import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { usePlayerStore } from '@/features/player/player.store';

/**
 * Text animation in MiniPlayer
 */

export function usePlayingTextAnimation() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  // Create an animated value for horizontal translation
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // if currently not playing, reset animation and return
    if (!isPlaying) {
      translateX.stopAnimation();
      translateX.setValue(0);
      return;
    }

    // Define the animation: move text left and right in a loop to create a "playing" effect
    const animation = Animated.loop(
      Animated.sequence([
        // Animated.timing(translateX, {
        //   toValue: 6, // Move 6 pixels to the right
        //   duration: 900, // Duration of the animation
        //   easing: Easing.inOut(Easing.ease),
        //   useNativeDriver: true, // Use native driver for better performance
        // }),
        Animated.timing(translateX, {
          toValue: -70, // Move -70 pixels to the left
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0, // Move back to original position
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Start the animation
    animation.start();

    // Cleanup function to stop the animation when component unmounts or isPlaying changes
    return () => {
      animation.stop();
      translateX.setValue(0); // Reset position when stopping
    };
  }, [isPlaying, translateX]);

  // Return the animated value for use in the component
  return translateX;
}
