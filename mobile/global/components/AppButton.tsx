import { Pressable, Text } from 'react-native';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  leftIcon?: ReactNode;
};

const buttonVariantClassMap: Record<ButtonVariant, string> = {
  primary: 'bg-cyan-600',
  secondary: 'bg-slate-200',
  ghost: 'bg-white/10',
  danger: 'bg-red-500',
};

const textVariantClassMap: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-slate-700',
  ghost: 'text-white',
  danger: 'text-white',
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}: AppButtonProps) {
  const bgColor = buttonVariantClassMap[variant];
  const textColor = textVariantClassMap[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-1 rounded-2xl px-5 py-3 ${bgColor} ${disabled ? 'opacity-50' : 'active:opacity-30'}`}
    >
      <Text className={`text-center text-base font-semibold ${textColor}`}>
        {title}
      </Text>
    </Pressable>
  );
}
