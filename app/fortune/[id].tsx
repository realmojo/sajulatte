import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMyEightSaju } from '@/lib/utils/latte';
import { interpretSaju } from '@/lib/utils/interpreter';
import { getDailyFortune } from '@/lib/utils/dailyFortuneLogic';

const fortuneTitles: Record<string, string> = {
  today: '종합',
  love: '연애운',
  money: '금전운',
  marriage: '결혼운',
  job: '직업운',
  health: '건강운',
  human: '대인운',
  newyear: '신년운세',
};

export default function FortuneDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const title = fortuneTitles[id || ''] || '운세 상세';

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, [id]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // 1. Load Profile
      const jsonValue = await AsyncStorage.getItem('saju_list');
      let profile = null;
      if (jsonValue) {
        const list = JSON.parse(jsonValue);
        if (list.length > 0) profile = list[0];
      }

      if (!profile) {
        setErrorMsg('사주 정보를 찾을 수 없습니다.\n프로필을 등록해주세요.');
        setLoading(false);
        return;
      }

      // 2. Calculate Saju Analysis
      const result = await getMyEightSaju({
        year: profile.birth_year,
        month: profile.birth_month,
        day: profile.birth_day,
        hour: profile.birth_hour,
        minute: profile.birth_minute,
        gender: profile.gender,
        calendarType: profile.calendar_type?.startsWith('lunar') ? 'lunar' : 'solar',
        isLeapMonth:
          profile.calendar_type === 'lunar-leap' ||
          profile.is_leap ||
          profile.is_leap_month ||
          false,
      });

      if (!result) {
        setErrorMsg('사주 정보를 분석할 수 없습니다.');
        setLoading(false);
        return;
      }

      // 3. Prepare Params
      const ilgan = result.day.gan.hanja;
      const ilji = result.day.ji.hanja;

      const pillars = [result.year, result.month, result.day, result.hour];
      const sipsinList = pillars.flatMap((p) => [p.gan.sipsin, p.ji.sipsin]);
      const shinsalList = pillars.map((p) => p.ji.shinsal).filter((s) => !!s);
      const distributions = result.distributions;

      const analysis = interpretSaju(ilgan, distributions, sipsinList, shinsalList, profile.gender);

      // Calculate Daily Fortune
      const dailyResult = getDailyFortune(ilgan, ilji);

      // 4. Map ID to Content
      let resultText = '';
      const safeId = id as string;

      switch (safeId) {
        case 'today':
          resultText = dailyResult.summary;
          break;
        case 'love':
          resultText = dailyResult.love;
          break;
        case 'money':
          resultText = dailyResult.money;
          break;
        case 'marriage':
          resultText = dailyResult.marriage;
          break;
        case 'job':
          resultText = dailyResult.job;
          break;
        case 'health':
          resultText = dailyResult.health;
          break;
        case 'human':
          resultText = dailyResult.human;
          break;
        case 'newyear':
          resultText = analysis.newyear;
          break;
        default:
          resultText = dailyResult.summary;
      }

      setContent(resultText || '해석 결과가 없습니다.');
    } catch (e) {
      console.error(e);
      setErrorMsg('운세 분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    const categoryMap: Record<string, { title: string; emoji: string; color: string }> = {
      today: { title: '종합', emoji: '🌟', color: 'text-amber-600' },
      love: { title: '연애운', emoji: '💘', color: 'text-rose-500' },
      money: { title: '금전운', emoji: '💰', color: 'text-yellow-600' },
      marriage: { title: '결혼운', emoji: '💍', color: 'text-pink-500' },
      job: { title: '직업운', emoji: '💼', color: 'text-blue-600' },
      health: { title: '건강운', emoji: '🌿', color: 'text-green-600' },
      human: { title: '대인운', emoji: '🤝', color: 'text-purple-600' },
      newyear: { title: '신년운세', emoji: '🌅', color: 'text-cyan-600' },
    };

    const config = categoryMap[id as string] || {
      title: '운세',
      emoji: '✨',
      color: 'text-gray-800',
    };

    return (
      <View className="mb-6 rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-sm">
        <Text className={`mb-2 text-base font-bold ${config.color}`}>
          {config.emoji} {config.title}
        </Text>
        <Text className="text-sm leading-6 text-gray-800">{content}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View
        className="flex-row items-center border-b border-gray-100 bg-white px-4 pb-4"
        style={{ paddingTop: insets.top + 10 }}>
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1">
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">{title}</Text>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="mt-20 items-center">
            <ActivityIndicator size="large" color="#d97706" />
            <Text className="mt-4 text-gray-500">운세 데이터를 분석하고 있습니다...</Text>
          </View>
        ) : errorMsg ? (
          <View className="mt-20 items-center">
            <Text className="mb-2 text-gray-500">{errorMsg}</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/settings')}
              className="rounded-lg bg-amber-100 px-4 py-2">
              <Text className="font-bold text-amber-700">프로필 등록하러 가기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mb-20">{renderContent()}</View>
        )}
      </ScrollView>
    </View>
  );
}
