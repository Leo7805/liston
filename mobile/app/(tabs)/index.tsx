import { Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';

export default function PlayScreen() {
  return (
    <View className="flex-1 bg-emerald-400 px-5 pt-16">
      {/* Title */}
      <Text className="text-3xl font-bold text-white">Liston</Text>

      {/* Subtitle */}
      <Text className="mt-2 text-base text-slate-800">
        Open, listen, repeat.
      </Text>

      {/* Sentence Card */}
      <View className="mt-10 rounded-3xl bg-emerald-200 p-5">
        <Text className="text-sm font-medium uppercase text-slate-600">
          Current sentence
        </Text>

        <Text className="mt-4 text-2xl font-semibold leading-8 text-white">
          No sentence yet
        </Text>

        <Text className="mt-3 text-base text-slate-700">
          Add sentences in the Sentences tab to start listening.
        </Text>
      </View>

      {/* Buttons */}
      <View className="mt-8 flex-row gap-3">
        <AppButton title="Previous" variant="secondary" />

        <View className="flex-1">
          <AppButton title="Play" />
        </View>

        <AppButton title="Next" variant="secondary" />
        <AppButton title="Stop" variant="secondary" />
      </View>
    </View>
  );
}
