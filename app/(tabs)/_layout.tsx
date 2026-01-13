import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { CalendarDays, Sparkles, Ellipsis, HeartHandshake } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@/lib/theme';
const TABS = [
  {
    name: 'index',
    title: '사주',
    icon: CalendarDays,
  },
  {
    name: 'daily',
    title: '운세',
    icon: Sparkles,
  },
  {
    name: 'compatibility',
    title: '궁합',
    icon: HeartHandshake,
  },
  {
    name: 'settings',
    title: '더보기',
    icon: Ellipsis,
  },
];
export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'left',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.colors.background,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: theme.colors.text,
        },
        headerTitleContainerStyle: {
          paddingLeft: 12,
        },
        tabBarActiveTintColor: '#d97706',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      }}>
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            headerLeft: () => (
              <View className="pl-4">
                <tab.icon size={20} color={theme.colors.text} />
              </View>
            ),
            headerTitleContainerStyle: {
              paddingLeft: 4,
            },
            tabBarIcon: ({ focused, color }) => (
              <View>
                <tab.icon color={focused ? '#d97706' : color} size={20} />
              </View>
            ),
          }}
        />
      ))}

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
