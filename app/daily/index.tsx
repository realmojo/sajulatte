import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { signInWithKakao } from '@/lib/services/authService';
import { getMyEightSaju } from '@/lib/utils/latte';
import { getDailyFortune } from '@/lib/utils/dailyFortuneLogic';
import { WebSEO } from '@/components/ui/WebSEO';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';
import { Sparkles } from 'lucide-react-native';

export default function DailyFortuneScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fortuneData, setFortuneData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userName, setUserName] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // 1. Load Profile (Local -> Supabase)
      let profile = null;
      const jsonValue = await AsyncStorage.getItem('saju_list');

      if (jsonValue) {
        const list = JSON.parse(jsonValue);
        if (list.length > 0) profile = list[0];
      }

      if (!profile) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: userProfile } = await supabase
            .from('sajulatte_users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (userProfile) {
            profile = userProfile;
            await AsyncStorage.setItem('saju_list', JSON.stringify([userProfile]));
          }
        }
      }

      if (!profile) {
        setErrorMsg('사주 정보를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      setUserName(profile.name);

      // 2. Calculate Saju
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
        setErrorMsg('사주 분석에 실패했습니다.');
        setLoading(false);
        return;
      }

      // 3. Get Daily Fortune
      const ilgan = result.day.gan.hanja;
      const ilji = result.day.ji.hanja;
      const dailyResult = getDailyFortune(ilgan, ilji);

      setFortuneData(dailyResult);
    } catch (e) {
      console.error(e);
      setErrorMsg('운세 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const categories = [
    {
      key: 'summary',
      title: '오늘의 종합 운세',
      emoji: '🌟',
      color: 'bg-amber-100',
      text: 'text-amber-900',
      border: 'border-amber-200',
    },
    {
      key: 'love',
      title: '연애운',
      emoji: '💘',
      color: 'bg-rose-100',
      text: 'text-rose-900',
      border: 'border-rose-200',
    },
    {
      key: 'money',
      title: '금전운',
      emoji: '💰',
      color: 'bg-yellow-100',
      text: 'text-yellow-900',
      border: 'border-yellow-200',
    },
    {
      key: 'job',
      title: '직업/학업운',
      emoji: '💼',
      color: 'bg-blue-100',
      text: 'text-blue-900',
      border: 'border-blue-200',
    },
    {
      key: 'health',
      title: '건강운',
      emoji: '🌿',
      color: 'bg-green-100',
      text: 'text-green-900',
      border: 'border-green-200',
    },
    {
      key: 'human',
      title: '대인관계',
      emoji: '🤝',
      color: 'bg-purple-100',
      text: 'text-purple-900',
      border: 'border-purple-200',
    },
    {
      key: 'marriage',
      title: '결혼운',
      emoji: '💍',
      color: 'bg-pink-100',
      text: 'text-pink-900',
      border: 'border-pink-200',
    },
  ];

  const renderContent = () => (
    <View className="flex-1 px-4 py-8 md:px-0">
      <View className="mb-8 items-center">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <Sparkles size={32} color="#d97706" />
        </View>
        <Text className="mb-2 text-2xl font-bold text-gray-900">{userName}님의 오늘 운세</Text>
        <Text className="text-gray-500">
          {new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </Text>
      </View>

      <View className="grid gap-6 md:grid-cols-2">
        {categories.map((cat) => (
          <View
            key={cat.key}
            className={`rounded-2xl border p-6 ${cat.color} ${cat.border} w-full`}>
            <View className="mb-3 flex-row items-center gap-2">
              <Text className="text-2xl">{cat.emoji}</Text>
              <Text className={`text-lg font-bold ${cat.text}`}>{cat.title}</Text>
            </View>
            <Text className={`leading-relaxed ${cat.text} text-sm opacity-90 md:text-base`}>
              {fortuneData ? fortuneData[cat.key] : '...'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  /* Structured Data for SEO: Service */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: '오늘의 운세 - 사주라떼',
    description:
      '매일 매일 변화하는 나의 운세 흐름을 사주 명리학으로 분석해드립니다. 재물운, 연애운, 직업운을 무료로 확인하세요.',
    provider: {
      '@type': 'Organization',
      name: '사주라떼',
    },
    serviceType: 'Fortune Telling',
    category: 'Lifestyle',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    url: 'https://sajulatte.app/daily',
  };

  const seoProps = {
    title: '오늘의 운세 (무료) - 사주라떼',
    description:
      '오늘 나의 하루는 어떨까요? 정통 사주 명리학으로 분석한 오늘의 재물운, 연애운, 사업운, 건강운을 무료로 확인해보세요.',
    keywords: '오늘의 운세, 무료 운세, 일일 운세, 재물운, 연애운, 사주 운세, 매일 운세',
    url: 'https://sajulatte.app/daily',
    type: 'website',
    image: 'https://sajulatte.app/assets/images/og-image.png',
    jsonLd: jsonLd,
  };

  return (
    <FullWidthWebLayout>
      <Stack.Screen options={{ title: '오늘의 운세', headerShown: false }} />
      <WebSEO {...seoProps} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#d97706" />
            <Text className="mt-4 text-gray-500">운세를 분석하고 있습니다...</Text>
          </View>
        ) : errorMsg ? (
          <View className="flex-1 items-center justify-center px-8 py-20">
            <Text className="mb-4 text-4xl">😢</Text>
            <Text className="mb-6 text-center text-lg text-gray-600">{errorMsg}</Text>
            <TouchableOpacity
              onPress={() => router.push('/saju')}
              className="h-14 w-full max-w-xs items-center justify-center rounded-xl bg-amber-500 px-6">
              <Text className="font-bold text-white">사주 정보 입력하기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                try {
                  await signInWithKakao();
                  // 로그인 성공 후 사주 입력 페이지로 이동
                  router.push('/saju');
                } catch (e) {
                  console.error(e);
                }
              }}
              className="mt-3 h-14 w-full max-w-xs flex-row items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-6 active:opacity-90">
              <Text className="text-lg">💬</Text>
              <Text className="font-bold text-[#191919]">카카오 로그인으로 시작하기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          renderContent()
        )}
      </ScrollView>
    </FullWidthWebLayout>
  );
}
