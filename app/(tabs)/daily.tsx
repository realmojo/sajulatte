import { Text } from '@/components/ui/text';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Heart,
  Coins,
  HeartHandshake,
  Briefcase,
  Activity,
  User,
  Sparkles,
  Star,
  Bell,
  Settings,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

// Web SEO Helper
import { Platform } from 'react-native';
const WebSEO = ({ title, description }: { title: string; description: string }) => {
  if (Platform.OS !== 'web') return null;
  React.useEffect(() => {
    document.title = title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
  }, [title, description]);
  return null;
};

export default function DailyScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const iconColor = colorScheme === 'dark' ? '#fff' : '#000';

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <WebSEO
        title="오늘의 운세 - 사주라떼"
        description="매일 매일 변화하는 나의 운세를 확인하세요. 연애운, 금전운, 직업운 등 다양한 무료 운세를 제공합니다."
      />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center gap-2">
          <Sparkles size={24} className="text-foreground" color={iconColor} />
          <Text className="text-xl font-bold text-foreground">운세</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-4 gap-8">
        {/* Banner Section (Optional) */}
        <View className="h-40 w-full items-center justify-center rounded-2xl bg-indigo-500 shadow-sm">
          <View className="items-center gap-2">
            <Sparkles size={40} color="white" />
            <Text className="text-xl font-bold text-white">오늘의 운세를 확인하세요</Text>
            <Text className="text-sm text-white/80">매일 아침 새로운 운세가 찾아옵니다</Text>
          </View>
        </View>

        {/* Categories Grid */}
        <View className="gap-4">
          <Text className="px-1 text-lg font-bold text-foreground">전체 카테고리</Text>
          <View className="flex-row flex-wrap justify-between gap-y-6">
            {[
              {
                id: 'today',
                label: '종합',
                icon: Star,
                color: 'text-amber-500',
                bg: 'bg-amber-100',
              },
              {
                id: 'love',
                label: '연애운',
                icon: Heart,
                color: 'text-rose-500',
                bg: 'bg-rose-100',
              },
              {
                id: 'money',
                label: '금전운',
                icon: Coins,
                color: 'text-yellow-600',
                bg: 'bg-yellow-100',
              },
              {
                id: 'marriage',
                label: '결혼운',
                icon: HeartHandshake,
                color: 'text-pink-500',
                bg: 'bg-pink-100',
              },
              {
                id: 'job',
                label: '직업운',
                icon: Briefcase,
                color: 'text-blue-500',
                bg: 'bg-blue-100',
              },
              {
                id: 'health',
                label: '건강운',
                icon: Activity,
                color: 'text-green-500',
                bg: 'bg-green-100',
              },
              {
                id: 'human',
                label: '대인운',
                icon: User,
                color: 'text-purple-500',
                bg: 'bg-purple-100',
              },
              {
                id: 'newyear',
                label: '신년운세',
                icon: Sparkles,
                color: 'text-cyan-500',
                bg: 'bg-cyan-100',
              },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(`/fortune/${item.id}`)}
                className="w-[22%] items-center gap-2 active:opacity-70">
                <View
                  className={`h-14 w-14 items-center justify-center rounded-2xl ${item.bg} shadow-sm`}>
                  <item.icon size={24} className={item.color} strokeWidth={2.5} />
                </View>
                <Text className="text-xs font-medium text-foreground">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
