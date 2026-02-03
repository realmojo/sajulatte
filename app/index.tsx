import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { WebSEO } from '@/components/ui/WebSEO';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';
import { Calendar, Heart, BookOpen, Clock } from 'lucide-react-native';
import { signInWithKakao } from '@/lib/services/authService';

export default function HomeScreen() {
  const router = useRouter();

  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao();
    } catch (e) {
      console.error('Login failed', e);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  const featureCards = [
    {
      title: '정통 사주 분석',
      desc: '생년월일시를 기반으로 분석하는\n당신의 타고난 운명과 기질',
      icon: Calendar,
      route: '/saju',
    },
    {
      title: '만세력 달력',
      desc: '매일의 일진과 길흉을 확인하는\n스마트한 만세력',
      icon: Clock,
      route: '/pillarscalendar',
    },
    {
      title: '운세 백과사전',
      desc: '어려운 명리학 용어를\n쉽고 재미있게 풀어드립니다',
      icon: BookOpen,
      route: '/encyclopedia',
    },
    {
      title: '궁합 분석',
      desc: '연인, 친구, 동료와의\n특별한 인연을 확인하세요',
      icon: Heart,
      route: '/compatibility',
    },
  ];

  const content = (
    <View className="flex-1 items-center justify-center p-8">
      {/* Hero Section */}
      <View className="mb-16 w-full max-w-4xl items-center">
        <View className="mb-8 h-32 w-32 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500">
          <Text className="text-7xl">☕️</Text>
        </View>
        <Text className="mb-4 text-center text-5xl font-bold text-gray-900">사주라떼</Text>
        <Text className="mb-8 text-center text-xl leading-relaxed text-gray-600">
          천년의 지혜를 한 잔의 커피처럼{'\n'}
          따뜻하고 편안하게 즐기는 일상의 명리학
        </Text>

        {/* Main CTA */}
        <TouchableOpacity
          onPress={() => router.push('/saju')}
          className="mb-3 w-full max-w-md rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-12 py-5 active:scale-95">
          <Text className="text-center text-xl font-bold text-white">무료로 사주 보러가기</Text>
        </TouchableOpacity>

        {/* Kakao Login CTA */}
        <TouchableOpacity
          onPress={handleKakaoLogin}
          className="mb-4 w-full max-w-md flex-row items-center justify-center gap-2 rounded-2xl bg-[#FEE500] px-12 py-5 hover:bg-[#FDD835] active:scale-95">
          <Text className="text-xl">💬</Text>
          <Text className="text-center text-xl font-bold text-[#191919]">
            카카오로 3초만에 시작하기
          </Text>
        </TouchableOpacity>
      </View>

      {/* Features Grid */}
      <View className="w-full max-w-6xl">
        <Text className="mb-8 text-center text-2xl font-bold text-gray-900">
          사주라떼가 제공하는 서비스
        </Text>
        <View className="flex-row flex-wrap justify-center gap-6">
          {featureCards.map((feature, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(feature.route as any)}
              className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-amber-400 hover:shadow-lg active:scale-95 md:w-[calc(50%-8px)]">
              <View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
                <feature.icon size={28} color="#f59e0b" />
              </View>
              <Text className="mb-2 text-xl font-bold text-gray-900">{feature.title}</Text>
              <Text className="text-gray-600">{feature.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Why Sajulatte? */}
      <View className="mt-20 w-full max-w-4xl rounded-3xl bg-gray-50 p-10">
        <Text className="mb-8 text-center text-2xl font-bold text-gray-900">
          왜 사주라떼인가요?
        </Text>
        <View className="gap-6">
          <View className="flex-row gap-4">
            <View className="mt-2.5 h-2 w-2 rounded-full bg-amber-500" />
            <View className="flex-1">
              <Text className="mb-1 text-lg font-bold text-gray-900">정확한 만세력 알고리즘</Text>
              <Text className="text-gray-600">
                한국천문연구원의 데이터를 기반으로 한 정밀한 절기 계산으로 오차 없는 정확한 사주를
                분석합니다.
              </Text>
            </View>
          </View>
          <View className="flex-row gap-4">
            <View className="mt-2.5 h-2 w-2 rounded-full bg-amber-500" />
            <View className="flex-1">
              <Text className="mb-1 text-lg font-bold text-gray-900">현대적인 해석</Text>
              <Text className="text-gray-600">
                고리타분한 옛날 해석이 아닌, 현대 사회에 맞춘 실요적이고 긍정적인 해석을 제공합니다.
              </Text>
            </View>
          </View>
          <View className="flex-row gap-4">
            <View className="mt-2.5 h-2 w-2 rounded-full bg-amber-500" />
            <View className="flex-1">
              <Text className="mb-1 text-lg font-bold text-gray-900">쉬운 사용성</Text>
              <Text className="text-gray-600">
                복잡한 한자 없이도 누구나 쉽게 이해할 수 있는 직관적인 디자인과 설명을 제공합니다.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  /* Structured Data for SEO: WebSite & Organization */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: '사주라떼',
        url: 'https://sajulatte.app',
        description: '쉬운 사주, 정확한 만세력, 오늘의 운세',
        publisher: {
          '@id': 'https://sajulatte.app/#organization',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://sajulatte.app/#organization',
        name: '사주라떼',
        url: 'https://sajulatte.app',
        logo: {
          '@type': 'ImageObject',
          url: 'https://sajulatte.app/assets/images/icon.png',
          width: 512,
          height: 512,
        },
        sameAs: ['https://instagram.com/sajulatte'],
      },
    ],
  };

  const seoProps = {
    title: '사주라떼 - 쉬운 사주, 정확한 만세력, 무료 운세',
    description:
      '천년의 지혜를 한 잔의 커피처럼 쉽고 편안하게. 정통 명리학 기반의 사주 분석, 정확한 만세력, 오늘의 운세, 궁합을 무료로 확인하세요.',
    keywords: '사주, 만세력, 무료 운세, 사주 풀이, 궁합, 명리학, 사주 팔자, 일진, 사주라떼',
    url: 'https://sajulatte.app',
    type: 'website',
    image: 'https://sajulatte.app/assets/images/og-image.png',
    jsonLd: jsonLd,
  };

  // Use FullWidthWebLayout for layout consistently
  // Now FullWidthWebLayout handles mobile vs web responsively
  return (
    <FullWidthWebLayout>
      <WebSEO {...seoProps} />
      {content}
    </FullWidthWebLayout>
  );
}
