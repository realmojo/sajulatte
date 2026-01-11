import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Share, TrendingUp, Sparkles, HeartHandshake } from 'lucide-react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { supabase } from '@/lib/supabase';
import { userService } from '@/lib/services/userService';
import { getMyEightSaju } from '@/lib/utils/latte';
import { calculateRealCompatibility, CompatibilityResult } from '@/lib/utils/compatibilityLogic';

const ANIMAL_IMAGES: Record<string, any> = {
  쥐: require('@/assets/images/zodiac_transparent/rat.png'),
  소: require('@/assets/images/zodiac_transparent/ox.png'),
  호랑이: require('@/assets/images/zodiac_transparent/tiger.png'),
  토끼: require('@/assets/images/zodiac_transparent/rabbit.png'),
  용: require('@/assets/images/zodiac_transparent/dragon.png'),
  뱀: require('@/assets/images/zodiac_transparent/snake.png'),
  말: require('@/assets/images/zodiac_transparent/horse.png'),
  양: require('@/assets/images/zodiac_transparent/sheep.png'),
  원숭이: require('@/assets/images/zodiac_transparent/monkey.png'),
  닭: require('@/assets/images/zodiac_transparent/rooster.png'),
  개: require('@/assets/images/zodiac_transparent/dog.png'),
  돼지: require('@/assets/images/zodiac_transparent/pig.png'),
};
import { WebSEO } from '@/components/ui/WebSEO';

export default function CompatibilityAnalysisScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const viewShotRef = useRef<ViewShot>(null);

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [partnerName, setPartnerName] = useState('');

  useEffect(() => {
    analyze();
  }, []);

  const analyze = async () => {
    try {
      setLoading(true);

      // 1. Fetch My Profile
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        Alert.alert('로그인 필요', '로그인이 필요한 서비스입니다.');
        router.back();
        return;
      }

      const { data: myProfile } = await userService.getUser(session.user.id);
      if (!myProfile) {
        Alert.alert('오류', '내 정보를 불러올 수 없습니다.');
        router.back();
        return;
      }

      // 2. Parse Partner Info from Params
      if (!params.birthYear || !params.birthMonth || !params.birthDay) {
        // Handle missing params
        Alert.alert('오류', '상대방 정보가 부족합니다.');
        router.back();
        return;
      }

      const pName = (params.name as string) || '상대방';
      setPartnerName(pName);

      const pYear = parseInt(params.birthYear as string);
      const pMonth = parseInt(params.birthMonth as string);
      const pDay = parseInt(params.birthDay as string);
      const pHour = params.birthHour ? parseInt(params.birthHour as string) : undefined;
      const pCalendar = (params.calendarType as string) || 'solar';
      const pGender = (params.gender as string) || 'male';

      // 3. Calculate Saju
      // My Saju
      const mySaju = await getMyEightSaju({
        year: myProfile.birth_year,
        month: myProfile.birth_month,
        day: myProfile.birth_day,
        hour: myProfile.birth_hour ?? 0,
        minute: myProfile.birth_minute ?? 0,
        gender: myProfile.gender,
        calendarType: myProfile.calendar_type,
        isLeapMonth: myProfile.is_leap || myProfile.isLeapMonth || false,
      });

      // Partner Saju
      // (Assume logic for calculating Saju from provided fields)
      // Note: getMyEightSaju requires numbers.
      // Need to handle lunar/solar for partner if getMyEightSaju supports it?
      // Actually `getMyEightSaju` in `latte.ts` seems to calculate strictly from solar date or current logic.
      // We'll assume the inputs are solar for now or the function handles it?
      // Wait, `getMyEightSaju` takes (year, month, day, hour, min, gender).
      // If partner input is lunar, we need to convert?
      // For now, let's assume `getMyEightSaju` is used directly as in `compatibility.tsx`.
      // NOTE: `compatibility.tsx` was passing specific logic.
      // "meSaju" uses `getMyEightSaju`.
      // "youSaju" uses `getMyEightSaju`.

      const youSaju = await getMyEightSaju({
        year: pYear,
        month: pMonth,
        day: pDay,
        hour: pHour ?? 0,
        minute: 0,
        gender: pGender,
        calendarType: pCalendar,
        isLeapMonth: params.isLeapMonth === 'true',
      });

      // 4. Calculate Compatibility
      const compResult = calculateRealCompatibility(mySaju, youSaju);
      setResult(compResult);
    } catch (e) {
      console.error(e);
      Alert.alert('오류', '분석 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.log('Sharing failed', error);
    }
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false, title: '궁합 분석 결과' }} />
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#fb7185" />
          <Text className="mt-4 text-gray-500">두 분의 에너지를 분석하고 있습니다...</Text>
        </View>
      </>
    );
  }

  if (!result) return null;

  return (
    <>
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <WebSEO title={`나와 ${partnerName}님의 궁합 분석 - 사주라떼`} />
        <Stack.Screen options={{ headerShown: false, title: '궁합 분석 결과' }} />
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ChevronLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">궁합 분석 결과</Text>
          <TouchableOpacity onPress={handleShare} className="p-2">
            <Share size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'jpg', quality: 0.9 }}
            style={{ backgroundColor: 'white' }}>
            <View className="p-6 pb-20">
              {/* Header Box */}
              <View className="mb-8 items-center rounded-2xl bg-rose-50 p-6">
                <View className="mb-2 rounded-full bg-white p-3 shadow-sm">
                  <HeartHandshake size={32} color="#f43f5e" />
                </View>
                <Text className="text-lg font-bold text-gray-900">나와 {partnerName}님의 궁합</Text>
              </View>

              {/* Score & Verdict */}
              <View className="mb-8 items-center">
                <View className="relative items-center justify-center">
                  <Text className="mb-2 text-6xl font-black text-rose-500">{result.score}</Text>
                  <Text className="rounded-full bg-rose-50 px-4 py-1 text-lg font-bold text-gray-800 text-rose-600">
                    {result.verdict}
                  </Text>
                </View>
              </View>

              {/* Keywords */}
              <View className="mb-8 flex-row flex-wrap justify-center gap-2">
                {result.keywords.map((keyword, index) => (
                  <Text
                    key={index}
                    className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
                    {keyword}
                  </Text>
                ))}
              </View>

              <View className="mb-8 rounded-xl bg-gray-50 p-4">
                <Text className="text-left leading-6 text-gray-700">{result.description}</Text>
              </View>

              {/* 동물 표시 (띠) */}
              {result.animals && (
                <>
                  <View className="mb-6 flex-row justify-around rounded-xl bg-gray-50 py-4">
                    <View className="items-center">
                      <Text className="mb-2 text-sm text-gray-500">나의 띠</Text>
                      <Image
                        source={ANIMAL_IMAGES[result.animals.me.year]}
                        className="mb-1 h-16 w-16"
                        resizeMode="contain"
                        style={{ width: 120, height: 120 }}
                      />
                      <Text className="text-lg font-bold text-gray-800">
                        {result.animals.me.year}
                      </Text>
                    </View>
                    <View className="h-full w-[1px] bg-gray-200" />
                    <View className="items-center">
                      <Text className="mb-2 text-sm text-gray-500">상대방 띠</Text>
                      <Image
                        source={ANIMAL_IMAGES[result.animals.you.year]}
                        className="mb-1 h-16 w-16"
                        resizeMode="contain"
                        style={{ width: 120, height: 120 }}
                      />
                      <Text className="text-lg font-bold text-gray-800">
                        {result.animals.you.year}
                      </Text>
                    </View>
                  </View>
                  {/* 띠 궁합 설명 */}
                  {result.zodiacCompatibility && (
                    <View className="mb-8 rounded-xl bg-gray-50 p-4">
                      <Text className="text-left leading-6 text-gray-700">
                        {result.zodiacCompatibility}
                      </Text>
                    </View>
                  )}
                </>
              )}

              {/* Five Elements Graph */}
              <View className="mb-8">
                <View className="mb-4 flex-row items-center justify-between gap-2">
                  <View className="flex-row items-center gap-2">
                    <TrendingUp size={20} className="text-gray-900" color="black" />
                    <Text className="text-lg font-bold text-gray-900">오행 에너지 비교</Text>
                  </View>
                  <View className="mt-2 flex-row justify-end gap-4">
                    <View className="flex-row items-center gap-1">
                      <View className="h-2 w-2 rounded-full bg-gray-600" />
                      <Text className="text-xs text-gray-500">나</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <View className="h-2 w-2 rounded-full bg-gray-300" />
                      <Text className="text-xs text-gray-500">상대방</Text>
                    </View>
                  </View>
                </View>

                <View className="gap-3">
                  {result.graphData.map((data, idx) => {
                    const maxScore = 8;
                    const meWidth = Math.min((data.meScore / maxScore) * 100, 100);
                    const youWidth = Math.min((data.youScore / maxScore) * 100, 100);

                    return (
                      <View key={idx} className="flex-row items-center gap-3">
                        <View className="w-8 items-center justify-center rounded-md bg-gray-100 py-1">
                          <Text className="font-bold text-gray-600">{data.label}</Text>
                        </View>
                        <View className="flex-1 gap-1">
                          {/* My Bar */}
                          <View className="flex-row items-center gap-2">
                            <View
                              style={{ width: `${meWidth}%`, backgroundColor: data.color }}
                              className="h-2 rounded-full opacity-80"
                            />
                          </View>
                          {/* Partner Bar */}
                          <View className="flex-row items-center gap-2">
                            <View
                              style={{ width: `${youWidth}%`, backgroundColor: data.color }}
                              className="h-2 rounded-full opacity-40"
                            />
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* Element Analysis Description (Added) */}
                {result.elementAnalysis && (
                  <View className="mt-4 rounded-xl bg-gray-50 p-3">
                    <Text className="text-sm leading-6 text-gray-700">
                      {result.elementAnalysis}
                    </Text>
                  </View>
                )}
              </View>

              {/* Date Advice */}
              <View className="mb-0 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <View className="mb-3 flex-row items-center gap-2">
                  <Sparkles size={18} className="text-blue-600" color="#2563eb" />
                  <Text className="text-base font-bold text-blue-900">오늘의 데이트 조언</Text>
                </View>
                <Text className="mb-1 text-lg font-bold text-gray-900">
                  {result.dateAdvice.title}
                </Text>
                <Text className="mb-4 leading-5 text-gray-600">{result.dateAdvice.content}</Text>
                <View className="flex-row gap-2">
                  <View className="rounded-lg border border-blue-100 bg-white px-3 py-1">
                    <Text
                      style={{ color: result.dateAdvice.luckyColor }}
                      className="text-xs font-bold">
                      행운의 컬러
                    </Text>
                  </View>
                  <View className="rounded-lg border border-blue-100 bg-white px-3 py-1">
                    <Text className="text-xs text-blue-600">{result.dateAdvice.luckyPlace}</Text>
                  </View>
                </View>
              </View>
            </View>
          </ViewShot>
        </ScrollView>
      </View>
    </>
  );
}
