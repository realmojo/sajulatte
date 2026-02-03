import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { getMyEightSaju, getElementInfo, convertCharToKorean } from '@/lib/utils/latte';
import { getDailyFortune, DailyFortune } from '@/lib/utils/dailyFortuneLogic';
import { WebSEO } from '@/components/ui/WebSEO';

export default function DayAnalysisScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [analysis, setAnalysis] = useState<DailyFortune | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    try {
      const { year, month, day, gan, ji } = params;
      if (!year || !month || !day) return;

      // 1. Fetch User Info (Ilgan, Ilji)
      const saju = await getMyEightSaju();
      if (!saju || !saju.meta || !saju.meta.ilgan || !saju.meta.sajuJiHjs?.dayJi) {
        // Handle error: User profile not found
        setLoading(false);
        return;
      }

      const userIlgan = saju.meta.ilgan;
      const userIlji = saju.meta.sajuJiHjs.dayJi;

      console.log(userIlgan);
      console.log(userIlji);

      // 2. Calculate Daily Fortune
      const targetDate = new Date(
        parseInt(year as string),
        parseInt(month as string) - 1,
        parseInt(day as string)
      );

      const result = getDailyFortune(userIlgan, userIlji, targetDate, gan as string, ji as string);

      console.log(result);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false, title: '일지 분석 결과' }} />
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#fb7185" />
          <Text className="mt-4 text-gray-500">일지를 불러오고 있습니다.</Text>
        </View>
      </>
    );
  }

  if (!analysis) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false, title: '일지 분석 결과' }} />
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#fb7185" />
          <Text className="mt-4 text-gray-500">분석 결과를 불러올 수 없습니다.</Text>
        </View>
      </>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <WebSEO
        title={`${analysis.date} 운세 분석 - 사주라떼`}
        description="오늘의 일진과 운세 흐름을 확인하세요."
      />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="z-10 flex-row items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/pillarscalendar');
            }
          }}
          className="mr-4 p-1">
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">운세 분석</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 p-6" contentContainerClassName="pb-10">
        {/* Date & Iljin Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-gray-900">{analysis.date}</Text>
            <Text className="text-sm text-gray-500">오늘의 일진 분석</Text>
          </View>
          <View className="items-center">
            <View className="flex-row gap-1">
              <Text
                className="text-2xl font-black"
                style={{ color: getElementInfo(analysis.gan).color }}>
                {analysis.gan}
              </Text>
              <Text
                className="text-2xl font-black"
                style={{ color: getElementInfo(analysis.ji).color }}>
                {analysis.ji}
              </Text>
            </View>
            <View className="flex-row gap-1">
              <Text className="text-xs font-medium text-gray-400">
                {convertCharToKorean(analysis.gan)}
              </Text>
              <Text className="text-xs font-medium text-gray-400">
                {convertCharToKorean(analysis.ji)}
              </Text>
            </View>
          </View>
        </View>

        {/* Sipsin & Score Badge Row */}
        <View className="mb-6 flex-row gap-4">
          {/* Sipsin */}
          <View className="flex-1 items-center justify-center rounded-2xl bg-amber-50 p-6">
            <Text className="mb-2 text-sm font-bold text-amber-800">십성</Text>
            <Text className="text-2xl font-bold text-amber-600">{analysis.sipsin}</Text>
          </View>
          {/* Score */}
          <View className="flex-1 items-center justify-center rounded-2xl bg-blue-50 p-6">
            <Text className="mb-2 text-sm font-bold text-blue-800">운세 점수</Text>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-4xl font-black text-blue-600">{analysis.score}</Text>
              <Text className="text-sm text-blue-400">점</Text>
            </View>
          </View>
        </View>

        {/* Summary Card */}
        <View className="mb-6 rounded-2xl bg-gray-50 p-6">
          <Text className="mb-3 text-lg font-bold text-gray-900">총평</Text>
          <Text className="text-base leading-7 text-gray-700">{analysis.summary}</Text>
        </View>

        {/* Details List */}
        <View className="gap-4">
          {/* Love */}
          <View className="rounded-2xl border border-pink-100 bg-pink-50/30 p-5">
            <Text className="mb-2 text-base font-bold text-pink-600">💖 애정운</Text>
            <Text className="text-sm leading-6 text-gray-700">{analysis.love}</Text>
          </View>

          {/* Money */}
          <View className="rounded-2xl border border-yellow-100 bg-yellow-50/30 p-5">
            <Text className="mb-2 text-base font-bold text-yellow-600">💰 금전운</Text>
            <Text className="text-sm leading-6 text-gray-700">{analysis.money}</Text>
          </View>

          {/* Job */}
          <View className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5">
            <Text className="mb-2 text-base font-bold text-blue-600">💼 직업운</Text>
            <Text className="text-sm leading-6 text-gray-700">{analysis.job}</Text>
          </View>

          {/* Health */}
          <View className="rounded-2xl border border-green-100 bg-green-50/30 p-5">
            <Text className="mb-2 text-base font-bold text-green-600">🌿 건강운</Text>
            <Text className="text-sm leading-6 text-gray-700">{analysis.health}</Text>
          </View>

          {/* Human */}
          <View className="rounded-2xl border border-purple-100 bg-purple-50/30 p-5">
            <Text className="mb-2 text-base font-bold text-purple-600">🤝 대인운</Text>
            <Text className="text-sm leading-6 text-gray-700">{analysis.human}</Text>
          </View>

          {/* Marriage */}
          <View className="rounded-2xl border border-rose-100 bg-rose-50/30 p-5">
            <Text className="mb-2 text-base font-bold text-rose-600">💍 결혼/배우자운</Text>
            <Text className="text-sm leading-6 text-gray-700">{analysis.marriage}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
