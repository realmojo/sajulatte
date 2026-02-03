import { View, Text, ScrollView, Platform } from 'react-native';
import { WebSEO } from '@/components/ui/WebSEO';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';

export default function AboutScreen() {
  const isWeb = Platform.OS === 'web';

  const content = (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="pb-20">
        {/* Hero Section */}
        <View className="bg-gradient-to-b from-amber-600 to-amber-500 px-6 py-12">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-3xl bg-white/20">
            <Text className="text-5xl">☕️</Text>
          </View>
          <Text className="mb-3 text-4xl font-bold text-white">사주라떼</Text>
          <Text className="text-xl leading-7 text-amber-50">
            천년의 지혜를 한 잔의 커피처럼{'\n'}
            따뜻하고 편안하게 전달합니다
          </Text>
        </View>

        <View className="gap-8 p-6">
          {/* Company Introduction */}
          <View>
            <Text className="mb-3 text-2xl font-bold text-gray-900">사주라떼를 소개합니다</Text>
            <Text className="leading-7 text-gray-700">
              사주라떼는 2026년에 설립된 디지털 사주명리 서비스 전문 기업입니다. 우리는 1,200년
              역사를 자랑하는 동양 철학인 사주명리학을 현대인들이 쉽게 이해하고 활용할 수 있도록
              디지털 플랫폼으로 구현했습니다.
            </Text>
          </View>

          {/* Mission & Vision */}
          <View className="rounded-2xl bg-amber-50 p-6">
            <Text className="mb-4 text-xl font-bold text-gray-900">우리의 사명</Text>
            <View className="gap-3">
              <View className="flex-row">
                <Text className="mr-2 text-amber-600">•</Text>
                <Text className="flex-1 leading-6 text-gray-700">
                  전통 명리학의 가치를 현대적으로 재해석하여 누구나 쉽게 접근할 수 있도록 합니다
                </Text>
              </View>
              <View className="flex-row">
                <Text className="mr-2 text-amber-600">•</Text>
                <Text className="flex-1 leading-6 text-gray-700">
                  자기 이해와 성찰을 통해 더 나은 의사결정을 돕고 주체적인 삶을 응원합니다
                </Text>
              </View>
              <View className="flex-row">
                <Text className="mr-2 text-amber-600">•</Text>
                <Text className="flex-1 leading-6 text-gray-700">
                  정확하고 신뢰할 수 있는 명리학 정보를 제공하여 미신이 아닌 학문으로 접근합니다
                </Text>
              </View>
            </View>
          </View>

          {/* Team Expertise */}
          <View>
            <Text className="mb-4 text-2xl font-bold text-gray-900">전문가 팀</Text>
            <Text className="mb-4 leading-7 text-gray-700">
              사주라떼는 명리학 전문가, 소프트웨어 엔지니어, UX 디자이너로 구성된 다학제적 팀이
              운영합니다. 정확한 명리학 이론과 최신 기술을 결합하여 최고 품질의 서비스를 제공합니다.
            </Text>

            <View className="gap-4">
              <View className="rounded-xl border border-gray-200 bg-white p-4">
                <View className="mb-2 flex-row items-center">
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <Text className="text-lg">📚</Text>
                  </View>
                  <Text className="text-lg font-bold text-gray-900">명리학 연구팀</Text>
                </View>
                <Text className="leading-6 text-gray-600">
                  20년 이상의 사주명리 연구 및 상담 경력을 보유한 전문가들이 콘텐츠의 정확성과
                  신뢰성을 책임집니다. 한국 명리학회 정회원 및 공인 명리학자 자격증 보유자들로
                  구성되어 있습니다.
                </Text>
              </View>

              <View className="rounded-xl border border-gray-200 bg-white p-4">
                <View className="mb-2 flex-row items-center">
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Text className="text-lg">💻</Text>
                  </View>
                  <Text className="text-lg font-bold text-gray-900">기술 개발팀</Text>
                </View>
                <Text className="leading-6 text-gray-600">
                  실리콘밸리와 국내 주요 IT기업 출신 개발자들이 복잡한 명리학 알고리즘을 정확하게
                  구현하고, 사용자 친화적인 인터페이스를 설계합니다.
                </Text>
              </View>
            </View>
          </View>

          {/* Core Values */}
          <View>
            <Text className="mb-4 text-2xl font-bold text-gray-900">핵심 가치</Text>
            <View className="gap-3">
              <View className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-4">
                <Text className="mb-1 text-lg font-bold text-gray-900">🎯 정확성</Text>
                <Text className="leading-6 text-gray-700">
                  전통 명리학 이론에 충실하며, 검증된 알고리즘으로 정확한 사주 분석을 제공합니다.
                </Text>
              </View>
              <View className="rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
                <Text className="mb-1 text-lg font-bold text-gray-900">🔒 신뢰성</Text>
                <Text className="leading-6 text-gray-700">
                  사용자의 개인정보를 철저히 보호하며, 투명하고 윤리적인 서비스를 제공합니다.
                </Text>
              </View>
              <View className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                <Text className="mb-1 text-lg font-bold text-gray-900">💡 혁신성</Text>
                <Text className="leading-6 text-gray-700">
                  전통과 기술의 조화를 통해 새로운 명리학 경험을 창조합니다.
                </Text>
              </View>
              <View className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                <Text className="mb-1 text-lg font-bold text-gray-900">❤️ 사용자 중심</Text>
                <Text className="leading-6 text-gray-700">
                  누구나 쉽게 이해하고 일상에서 활용할 수 있는 직관적인 서비스를 지향합니다.
                </Text>
              </View>
            </View>
          </View>

          {/* Services */}
          <View>
            <Text className="mb-4 text-2xl font-bold text-gray-900">제공 서비스</Text>
            <View className="gap-3">
              <View className="flex-row items-start">
                <Text className="mr-2 mt-1 text-amber-600">✓</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">정밀 사주 분석</Text>
                  <Text className="leading-6 text-gray-600">
                    년주, 월주, 일주, 시주를 종합적으로 분석하여 성격, 적성, 운세를 파악합니다
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <Text className="mr-2 mt-1 text-amber-600">✓</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">디지털 만세력</Text>
                  <Text className="leading-6 text-gray-600">
                    날짜별 천간지지와 길흉일을 확인할 수 있는 스마트한 만세력 달력
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <Text className="mr-2 mt-1 text-amber-600">✓</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">궁합 분석</Text>
                  <Text className="leading-6 text-gray-600">
                    두 사람의 사주를 비교 분석하여 관계의 조화를 진단합니다
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <Text className="mr-2 mt-1 text-amber-600">✓</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">운세 가이드</Text>
                  <Text className="leading-6 text-gray-600">
                    오늘, 이번 주, 이번 달의 운세를 매일 업데이트하여 제공합니다
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <Text className="mr-2 mt-1 text-amber-600">✓</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">명리학 백과사전</Text>
                  <Text className="leading-6 text-gray-600">
                    천간, 지지, 오행 등 명리학 용어와 개념을 쉽게 설명합니다
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
            <Text className="mb-4 text-xl font-bold text-gray-900">문의하기</Text>
            <Text className="mb-4 leading-6 text-gray-700">
              서비스 이용 중 궁금하신 사항이나 제안하고 싶은 내용이 있으시면 언제든지 연락주세요.
              여러분의 소중한 의견이 사주라떼를 더 나은 서비스로 만듭니다.
            </Text>
            <View className="gap-2">
              <View className="flex-row items-center">
                <Text className="mr-2 w-20 text-sm font-semibold text-gray-600">고객지원</Text>
                <Text className="flex-1 text-gray-900">support@sajulatte.app</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="mr-2 w-20 text-sm font-semibold text-gray-600">사업제휴</Text>
                <Text className="flex-1 text-gray-900">business@sajulatte.app</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="mr-2 w-20 text-sm font-semibold text-gray-600">운영시간</Text>
                <Text className="flex-1 text-gray-900">평일 09:00 - 18:00</Text>
              </View>
            </View>
          </View>

          {/* Philosophy */}
          <View className="rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 p-6">
            <Text className="mb-3 text-xl font-bold text-white">우리의 철학</Text>
            <Text className="leading-7 text-gray-300">
              "운명은 변하지 않는 타고난 것이 아니라, 이해하고 발전시켜 나가는 것입니다."
              {'\n\n'}
              사주라떼는 운명론적 관점을 거부합니다. 사주는 단지 가능성과 경향성을 보여줄 뿐,
              최종적인 삶은 개인의 선택과 노력으로 만들어집니다. 우리는 사주를 통해 자신을 더 깊이
              이해하고, 그 이해를 바탕으로 더 현명한 선택을 하실 수 있도록 돕고자 합니다.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  /* Structured Data for SEO */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '사주라떼',
    url: 'https://sajulatte.app',
    logo: 'https://sajulatte.app/assets/images/icon.png',
    description: '사주라떼는 2026년에 설립된 디지털 사주명리 서비스 전문 기업입니다.',
    email: 'support@sajulatte.app',
    foundingDate: '2026',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@sajulatte.app',
      contactType: 'customer service',
    },
  };

  const seoProps = {
    title: '회사 소개 - 사주라떼',
    description:
      '사주라떼는 20년 이상의 명리학 연구 경험을 가진 전문가팀이 운영하는 디지털 사주명리 서비스입니다. 전통 사주명리학을 현대적인 기술로 재해석하여 누구나 쉽게 자신의 운명을 이해할 수 있도록 돕습니다.',
    keywords: '사주, 명리학, 사주라떼, 운세, 만세력, 디지털 사주, 스타트업',
    url: 'https://sajulatte.app/about',
    type: 'website',
    image: 'https://sajulatte.app/assets/images/og-image.png', // Placeholder
    jsonLd: jsonLd,
  };

  return isWeb ? (
    <FullWidthWebLayout>
      <WebSEO {...seoProps} />
      {content}
    </FullWidthWebLayout>
  ) : (
    <View className="flex-1 bg-white">
      <WebSEO {...seoProps} />
      {content}
    </View>
  );
}
