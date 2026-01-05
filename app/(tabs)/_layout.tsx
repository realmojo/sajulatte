import { Tabs } from 'expo-router';
import { Home, ScrollText, Sparkles, Settings } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@/lib/theme';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: '저장목록',
          tabBarIcon: ({ color }) => <ScrollText color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          title: '운세',
          tabBarIcon: ({ color }) => <Sparkles color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
