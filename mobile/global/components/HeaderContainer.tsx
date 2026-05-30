import { View } from 'react-native';
import { ReactNode } from 'react';

export function HeaderContainer({ children }: { children: ReactNode }) {
  return (
    <View className="pt-14">
      <View className="flex-row items-center justify-between gap-2 py-3">
        {children}
      </View>
    </View>
  );
}
