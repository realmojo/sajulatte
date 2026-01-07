import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { CalendarDays, ScrollText, Sparkles, Ellipsis, HeartHandshake } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@/lib/theme';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#d97706', // Amber-600
        tabBarInactiveTintColor: '#9ca3af', // Gray-400
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '사주',
          tabBarIcon: ({ focused, color }) => (
            <View className={focused ? 'rounded-full bg-amber-100 px-4 py-1' : ''}>
              <CalendarDays color={focused ? '#d97706' : color} size={20} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          title: '운세',
          tabBarIcon: ({ focused, color }) => (
            <View className={focused ? 'rounded-full bg-amber-100 px-4 py-1' : ''}>
              <Sparkles color={focused ? '#d97706' : color} size={20} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="compatibility"
        options={{
          title: '궁합',
          tabBarIcon: ({ focused, color }) => (
            <View className={focused ? 'rounded-full bg-amber-100 px-4 py-1' : ''}>
              <HeartHandshake color={focused ? '#d97706' : color} size={20} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '더보기',
          tabBarIcon: ({ focused, color }) => (
            <View className={focused ? 'rounded-full bg-amber-100 px-4 py-1' : ''}>
              <Ellipsis color={focused ? '#d97706' : color} size={20} />
            </View>
          ),
        }}
      />

      {/* Hidden Tabs */}
      <Tabs.Screen
        name="saved"
        options={{
          href: null,
          title: '저장목록',
        }}
      />
    </Tabs>
  );
}
