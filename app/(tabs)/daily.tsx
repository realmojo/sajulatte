import { Text } from '@/components/ui/text';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
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
  Palette,
  Hash,
  Compass,
  Clock,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { WebSEO } from '@/components/ui/WebSEO';
import { STORY_DATA } from '@/lib/data/storyData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Solar } from 'lunar-javascript';

// Saju Helpers
const GAN_MAP: Record<string, string> = {
  甲: 'WOOD',
  乙: 'WOOD',
  丙: 'FIRE',
  丁: 'FIRE',
  戊: 'EARTH',
  己: 'EARTH',
  庚: 'METAL',
  辛: 'METAL',
  壬: 'WATER',
  癸: 'WATER',
};
const RESOURCE_MAP: Record<string, string> = {
  WOOD: 'WATER', // Water grows Wood
  FIRE: 'WOOD', // Wood burns Fire
  EARTH: 'FIRE', // Fire makes Earth
  METAL: 'EARTH', // Earth bears Metal
  WATER: 'METAL', // Metal holds Water
};
const LUCKY_DATA_MAP: Record<string, any> = {
  WOOD: {
    colors: ['초록색', '카키', '청록색'],
    numbers: [3, 8],
    dirs: ['동쪽', '동남쪽'],
    times: ['아침 7시', '오후 1시'],
  },
  FIRE: {
    colors: ['빨간색', '분홍색', '자주색'],
    numbers: [2, 7],
    dirs: ['남쪽', '남서쪽'],
    times: ['오후 12시', '오후 2시'],
  },
  EARTH: {
    colors: ['노란색', '갈색', '베이지'],
    numbers: [5, 0],
    dirs: ['중앙', '북동쪽'],
    times: ['오전 8시', '오후 2시'],
  },
  METAL: {
    colors: ['흰색', '은색', '금색'],
    numbers: [4, 9],
    dirs: ['서쪽', '서북쪽'],
    times: ['오후 5시', '저녁 7시'],
  },
  WATER: {
    colors: ['검은색', '네이비', '회색'],
    numbers: [1, 6],
    dirs: ['북쪽', '북서쪽'],
    times: ['밤 10시', '오전 6시'],
  },
};

const categories = [
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
];

export default function DailyScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const iconColor = colorScheme === 'dark' ? '#fff' : '#000';

  const [profile, setProfile] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      AsyncStorage.getItem('my_saju_list')
        .then((json) => {
          if (json) {
            const list = JSON.parse(json);
            if (list.length > 0) setProfile(list[0]);
          }
        })
        .finally(() => {
          // Small delay to prevent too fast flickering if needed, but usually instant is fine.
          setIsLoading(false);
        });
    }, [])
  );

  const luckyItems = React.useMemo(() => {
    const today = new Date();
    const dateSeed = today.getDate();

    // Default Random Logic (Fallback)
    let color = ['황금색', '레드', '블루'][dateSeed % 3];
    let number = ((dateSeed * 7) % 45) + 1;
    let direction = ['동쪽', '서쪽', '남쪽'][dateSeed % 3];
    let time = `오후 ${(dateSeed % 5) + 1}시`;

    // Personalized Logic if Profile exists
    if (profile) {
      try {
        const solar = Solar.fromYmd(profile.birth_year, profile.birth_month, profile.birth_day);
        const lunar = solar.getLunar();
        const ilgan = lunar.getDayGan(); // Returns Chinese Character (e.g. 甲)

        // Convert Korean Gan if needed (library usually returns Hanja)
        // If library returns Korean, we might need mapping, but standard lunar-js returns Hanja for getDayGan() usually.
        // Let's assume Hanja.

        const myElement = GAN_MAP[ilgan]; // WOOD, FIRE...
        if (myElement) {
          const luckyElement = RESOURCE_MAP[myElement]; // Helping Element
          const data = LUCKY_DATA_MAP[luckyElement];

          if (data) {
            color = data.colors[dateSeed % data.colors.length];
            number = data.numbers[dateSeed % data.numbers.length];
            direction = data.dirs[dateSeed % data.dirs.length];
            time = data.times[dateSeed % data.times.length];
          }
        }
      } catch (e) {
        console.log('Error calculating lucky items', e);
      }
    }

    return { color, number, direction, time };
  }, [profile]);

  const storiesByCategory = React.useMemo(() => {
    const grouped: Record<string, (typeof STORY_DATA)[string][]> = {};
    Object.values(STORY_DATA).forEach((story) => {
      if (!grouped[story.category]) grouped[story.category] = [];
      grouped[story.category].push(story);
    });
    return grouped;
  }, []);

  const categoryOrder = ['사주 기초', '생활 풍수', '연애 사주', '절기 지혜', '12지신'];

  return (
    <View className="flex-1 bg-background">
      <WebSEO
        title="오늘의 운세 - 사주라떼"
        description="매일 매일 변화하는 나의 운세를 확인하세요. 연애운, 금전운, 직업운 등 다양한 무료 운세를 제공합니다."
      />
      {/* Header Removed (Using Native Tabs Header) */}

      <ScrollView className="flex-1" contentContainerClassName="p-4 gap-8">
        {/* Banner Section (Optional) */}
        <View className="h-40 w-full items-center justify-center rounded-2xl bg-indigo-500">
          <View className="items-center gap-2">
            <Sparkles size={40} color="white" />
            <Text className="text-xl font-bold text-white">오늘의 운세를 확인하세요</Text>
            <Text className="text-sm text-white/80">매일 아침 새로운 운세가 찾아옵니다</Text>
          </View>
        </View>

        {/* Lucky Items Section */}
        <View className="gap-4">
          <View className="flex-row items-center justify-between px-1">
            <Text className="text-lg font-bold text-foreground">
              {profile ? `${profile.name}님의 행운 요소` : '오늘의 행운 요소'}
            </Text>
            <Text className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString()} 기준
            </Text>
          </View>
          <View className="flex-row gap-3">
            {isLoading ? (
              <View className="h-32 flex-1 items-center justify-center rounded-2xl border border-gray-100 bg-white">
                <ActivityIndicator size="small" color="#fbbf24" />
                <Text className="mt-2 text-xs text-gray-400">운세 정보를 불러오는 중...</Text>
              </View>
            ) : (
              [
                {
                  label: '행운 컬러',
                  icon: Palette,
                  color: 'text-rose-500',
                  bg: 'bg-rose-50',
                  value: luckyItems.color,
                },
                {
                  label: '행운 숫자',
                  icon: Hash,
                  color: 'text-indigo-500',
                  bg: 'bg-indigo-50',
                  value: luckyItems.number,
                },
                {
                  label: '행운 방향',
                  icon: Compass,
                  color: 'text-emerald-500',
                  bg: 'bg-emerald-50',
                  value: luckyItems.direction,
                },
                {
                  label: '행운 시간',
                  icon: Clock,
                  color: 'text-amber-500',
                  bg: 'bg-amber-50',
                  value: luckyItems.time,
                },
              ].map((item, index) => (
                <View
                  key={index}
                  className="flex-1 items-center gap-2 rounded-2xl border border-gray-300 bg-white p-3 py-4">
                  <View className={`h-10 w-10 items-center justify-center rounded-full ${item.bg}`}>
                    <item.icon size={20} className={item.color} />
                  </View>
                  <View className="items-center">
                    <Text className="text-sm font-bold text-gray-800">{item.value}</Text>
                    <Text className="text-[10px] text-gray-500">{item.label}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Categories Grid */}
        <View className="gap-4">
          <Text className="px-1 text-lg font-bold text-foreground">전체 카테고리</Text>
          <View className="flex-row flex-wrap justify-between gap-y-6">
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(`/fortune/${item.id}`)}
                className="w-[22%] items-center gap-2 active:opacity-70">
                <View className={`h-14 w-14 items-center justify-center rounded-2xl ${item.bg}`}>
                  <item.icon size={24} className={item.color} strokeWidth={2.5} />
                </View>
                <Text className="text-xs font-medium text-foreground">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Fortune Stories (Card News) - Netflix Style Rows */}
        <View className="pb-10">
          {categoryOrder.map((cat) => (
            <View key={cat} className="mb-8 gap-4">
              <View className="flex-row items-center justify-between px-1">
                <Text className="text-lg font-bold text-foreground">{cat}</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-3 px-1">
                {storiesByCategory[cat]?.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => router.push(`/story/${item.id}`)}
                    className="mr-2 w-72 gap-3 rounded-2xl border border-gray-300 bg-white p-5 active:opacity-90">
                    <View className={`self-start rounded-full px-3 py-1 ${item.color}`}>
                      <Text className={`text-xs font-bold ${item.textColor}`}>{item.category}</Text>
                    </View>
                    <View className="gap-1.5">
                      <Text className="text-lg font-bold leading-snug text-gray-900">
                        {item.title}
                      </Text>
                      <Text className="text-sm leading-5 text-gray-500" numberOfLines={2}>
                        {item.desc}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
