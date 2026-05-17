import { Pressable, Text } from 'react-native';

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
}: AppButtonProps) {
  const buttonClass = variant === 'primary' ? 'bg-white' : 'bg-slate-800';

  const textClass = variant === 'primary' ? 'text-slate-950' : 'text-white';

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-2xl px-5 py-4 ${buttonClass}`}
    >
      <Text className={`text-center text-base font-semibold ${textClass}`}>
        {title}
      </Text>
    </Pressable>
  );
}
