import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { MiniPlayer } from '@/features/player/components/MiniPlayer';
import { FullPlayerModal } from '@/features/player/components/FullPlayerModal';
import { GlobalErrorModal } from '@/global/components/GlobalErrorModal';

/** Type for the names of icons available in Ionicons. */
type TabIconName = keyof typeof Ionicons.glyphMap;

/** Returns the options for a tab, including the title and icon. */
function tabOptions(title: string, iconName: TabIconName) {
  return {
    title,
    tabBarIcon: ({
      color,
      size,
      focused,
    }: {
      color: string;
      size: number;
      focused: boolean;
    }) => (
      <Ionicons
        name={focused ? iconName : (`${iconName}-outline` as TabIconName)}
        size={focused ? 30 : 20}
        color={color}
      />
    ),
  };
}

/** Styles for the tab bar, making it transparent and positioning it at the bottom. */
const tabBarStyle = {
  backgroundColor: '#34d399',
  position: 'absolute',
  borderTopWidth: 0,
  height: 90,
  paddingTop: 10,
} as const;

/** Styles for the tab labels, making them bold and adjusting their position. */
const tabBarLabelStyle = {
  fontSize: 12,
  fontWeight: '600',
} as const;

/** The layout component for the tab navigator, defining the styles and screens. */
export default function TabLayout() {
  return (
    <View className="flex-1 bg-emerald-400">
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            backgroundColor: '#34d399',
          },
          tabBarStyle,
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarLabelStyle,
        }}
      >
        <Tabs.Screen name="index" options={tabOptions('Play', 'play-circle')} />

        <Tabs.Screen
          name="sentences"
          options={tabOptions('Sentences', 'document-text')}
        />

        <Tabs.Screen
          name="settings"
          options={tabOptions('Settings', 'settings')}
        />

        <Tabs.Screen name="dev" options={tabOptions('dev', 'code-slash')} />
      </Tabs>

      {/* MiniPlayer */}
      <MiniPlayer />

      {/* FullPlayer Modal */}
      <FullPlayerModal />

      {/* Global Error Modal */}
      <GlobalErrorModal />
    </View>
  );
}
