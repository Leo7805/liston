import { Pressable, Text } from 'react-native';
import type { ReactNode } from 'react';

/**
 * A reusable action button component with different variants and optional left icon.
 * Example: swipaeable action buttons in SentenceCard (Edit, Delete)
 */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ActionButtonProps = {
  title: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  leftIcon?: ReactNode;
  onPress?: () => void;
};

const buttonVariantClassMap: Record<ButtonVariant, string> = {
  primary: 'bg-blue-500',
  secondary: 'bg-gray-500',
  ghost: 'bg-transparent',
  danger: 'bg-red-500',
};

const textVariantClassMap: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-white',
  ghost: 'text-white',
  danger: 'text-white',
};

export function ActionButton({
  title,
  variant = 'primary',
  disabled = false,
  leftIcon,
  onPress,
}: ActionButtonProps) {
  const bgcolor = buttonVariantClassMap[variant];
  const textColor = textVariantClassMap[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`w-20 flex-row gap-1 items-center justify-center ${bgcolor} active:opacity-30 ${textColor} ${bgcolor} disabled:opacity-40`}
    >
      {leftIcon}
      <Text className={textColor}>{title}</Text>
    </Pressable>
  );
}
