import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { Link } from 'expo-router';
import { WebSEO } from '@/components/ui/WebSEO';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';
import { Clock, Calendar, ArrowRight, Sparkles, TrendingUp } from 'lucide-react-native';

// Blog articles data
const blogArticles = [
  {
    id: 'what-is-saju',
    title: '사주명리학이란 무엇인가',
    subtitle: '천년의 지혜를 현대에',
    description:
      '사주명리학의 역사와 기본 원리, 그리고 현대인의 삶에서 어떻게 활용할 수 있는지 상세히 알아봅니다.',
    category: '기초 지식',
    readTime: '8분',
    date: '2026-01-15',
    color: '#3b82f6',
  },
  {
    id: 'ten-heavenly-stems',
    title: '천간(天干) 완벽 가이드',
    subtitle: '열 가지 하늘의 기운',
    description: '갑(甲)부터 계(癸)까지, 십천간의 의미와 특성을 깊이 있게 탐구합니다.',
    category: '기초 지식',
    readTime: '12분',
    date: '2026-01-18',
    color: '#8b5cf6',
  },
  {
    id: 'twelve-earthly-branches',
    title: '지지(地支) 이해하기',
    subtitle: '열두 가지 땅의 에너지',
    description: '자(子)부터 해(亥)까지, 십이지지의 특성과 상호작용을 자세히 설명합니다.',
    category: '기초 지식',
    readTime: '10분',
    date: '2026-01-20',
    color: '#10b981',
  },
  {
    id: 'five-elements-basics',
    title: '오행(五行)의 원리',
    subtitle: '목화토금수의 순환',
    description: '오행의 상생상극 관계와 일상생활에서의 활용법을 알아봅니다.',
    category: '기초 지식',
    readTime: '9분',
    date: '2026-01-22',
    color: '#f59e0b',
  },
  {
    id: 'day-lord-analysis',
    title: '일주(日柱) 분석법',
    subtitle: '나의 본질 이해하기',
    description: '일간을 중심으로 사주를 분석하는 방법과 각 일주의 특성을 상세히 다룹니다.',
    category: '실전 분석',
    readTime: '15분',
    date: '2026-01-25',
    color: '#ec4899',
  },
  {
    id: 'yearly-fortune',
    title: '년운(年運) 해석 가이드',
    subtitle: '1년의 흐름 읽기',
    description: '대운과 세운을 통해 1년의 운세를 정확하게 파악하는 방법을 배웁니다.',
    category: '실전 분석',
    readTime: '11분',
    date: '2026-01-27',
    color: '#06b6d4',
  },
  {
    id: 'marriage-compatibility',
    title: '궁합 보는 법',
    subtitle: '사주로 알아보는 인연',
    description: '사주명리학적 관점에서 궁합을 판단하는 기준과 방법을 설명합니다.',
    category: '실전 분석',
    readTime: '13분',
    date: '2026-01-28',
    color: '#f43f5e',
  },
  {
    id: 'career-guidance',
    title: '사주로 본 직업 적성',
    subtitle: '나에게 맞는 일 찾기',
    description: '사주 구성에 따른 직업 적성과 성공 가능성이 높은 분야를 알아봅니다.',
    category: '실전 활용',
    readTime: '14분',
    date: '2026-01-30',
    color: '#6366f1',
  },
  {
    id: 'wealth-luck',
    title: '재물운 분석',
    subtitle: '사주에서 보는 금전운',
    description: '재성(財星)을 통해 재물운을 파악하고 향상시키는 방법을 다룹니다.',
    category: '실전 활용',
    readTime: '10분',
    date: '2026-02-01',
    color: '#84cc16',
  },
  {
    id: 'health-fortune',
    title: '건강운 해석',
    subtitle: '사주로 보는 건강 관리법',
    description: '사주 오행의 균형을 통해 건강 상태를 진단하고 관리하는 방법을 소개합니다.',
    category: '실전 활용',
    readTime: '12분',
    date: '2026-02-02',
    color: '#f97316',
  },
];

const categories = [
  { name: '전체', color: '#6b7280', count: 10 },
  { name: '기초 지식', color: '#3b82f6', count: 4 },
  { name: '실전 분석', color: '#8b5cf6', count: 3 },
  { name: '실전 활용', color: '#10b981', count: 3 },
];

export default function BlogIndexScreen() {
  const isWeb = Platform.OS === 'web';

  const content = (
    <View className="flex-1">
      {/* Hero Section */}
      <View className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 p-12 shadow-2xl">
        <View className="relative z-10">
          <View className="mb-4 flex-row items-center gap-2">
            <Sparkles size={24} color="#fff" />
            <Text className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Knowledge Base
            </Text>
          </View>
          <Text className="mb-4 text-5xl font-bold text-white">사주명리학 가이드</Text>
          <Text className="max-w-2xl text-xl leading-relaxed text-white/90">
            천년의 지혜를 현대적으로 풀어낸 전문 가이드
          </Text>
          <View className="mt-8 flex-row items-center gap-3">
            <Text className="text-sm font-semibold text-white/80">
              총 {blogArticles.length}개의 아티클
            </Text>
            <View className="h-1 w-1 rounded-full bg-white/60" />
            <Text className="text-sm font-semibold text-white/80">매주 업데이트</Text>
          </View>
        </View>

        {/* Decorative elements */}
        <View
          className="absolute rounded-full bg-white/10"
          style={{ right: -80, top: -80, width: 256, height: 256 }}
        />
        <View
          className="absolute rounded-full bg-white/10"
          style={{ right: 128, bottom: -40, width: 160, height: 160 }}
        />
      </View>

      {/* Category Filter */}
      <View className="mb-8">
        <View className="flex-row flex-wrap gap-3">
          {categories.map((category, index) => (
            <Pressable
              key={index}
              className="flex-row items-center gap-2 rounded-full border-2 bg-white px-6 py-3 shadow-sm transition-all hover:scale-105 hover:shadow-md"
              style={{ borderColor: category.color }}>
              <View className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
              <Text className="font-semibold text-gray-900">{category.name}</Text>
              <View
                className="rounded-full px-2 py-0.5"
                style={{ backgroundColor: category.color + '20' }}>
                <Text className="text-xs font-bold" style={{ color: category.color }}>
                  {category.count}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Articles Grid - Using flex-wrap to create 3 columns */}
      <View className="mb-12 flex-row flex-wrap gap-6">
        {blogArticles.map((article) => (
          <Link key={article.id} href={`/blog/${article.id}` as any} asChild>
            <Pressable
              style={{ width: 'calc(33.333% - 16px)', minWidth: 300 }}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:scale-105 hover:shadow-2xl">
              {/* Colored Header */}
              <View className="h-2" style={{ backgroundColor: article.color }} />

              {/* Content */}
              <View className="p-6">
                {/* Category Badge */}
                <View className="mb-4 flex-row items-center justify-between">
                  <View
                    className="rounded-full px-3 py-1"
                    style={{ backgroundColor: article.color + '20' }}>
                    <Text className="text-xs font-bold" style={{ color: article.color }}>
                      {article.category}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Clock size={14} color="#9ca3af" />
                    <Text className="text-xs text-gray-500">{article.readTime}</Text>
                  </View>
                </View>

                {/* Title */}
                <Text className="mb-2 text-2xl font-bold leading-tight text-gray-900">
                  {article.title}
                </Text>
                <Text className="mb-3 text-sm font-medium text-gray-500">{article.subtitle}</Text>

                {/* Description */}
                <Text className="mb-4 leading-relaxed text-gray-600" numberOfLines={3}>
                  {article.description}
                </Text>

                {/* Footer */}
                <View className="flex-row items-center justify-between border-t border-gray-100 pt-4">
                  <View className="flex-row items-center gap-2">
                    <Calendar size={16} color="#9ca3af" />
                    <Text className="text-sm text-gray-500">{article.date}</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Text className="font-semibold" style={{ color: article.color }}>
                      자세히 보기
                    </Text>
                    <ArrowRight size={16} color={article.color} />
                  </View>
                </View>
              </View>
            </Pressable>
          </Link>
        ))}
      </View>

      {/* Popular Topics Section */}
      <View className="mb-12 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <View className="mb-6 flex-row items-center gap-3">
          <TrendingUp size={24} color="#8b5cf6" />
          <Text className="text-2xl font-bold text-gray-900">인기 주제</Text>
        </View>
        <View className="flex-row flex-wrap gap-4">
          {['천간 이해하기', '지지 분석법', '대운 보는 법', '궁합 비결'].map((topic, index) => (
            <Pressable
              key={index}
              style={{ width: 'calc(25% - 12px)', minWidth: 150 }}
              className="rounded-xl bg-white p-4 shadow-sm transition-all hover:scale-105 hover:shadow-md">
              <Text className="text-center font-semibold text-gray-900">{topic}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Expert Advice */}
      <View className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-8">
        <View className="flex-row items-start gap-4">
          <View className="rounded-full bg-amber-500 p-3">
            <Text className="text-2xl">💡</Text>
          </View>
          <View className="flex-1">
            <Text className="mb-2 text-xl font-bold text-amber-900">전문가의 조언</Text>
            <Text className="leading-7 text-amber-800">
              사주명리학은 수천 년간 축적된 동양의 지혜입니다. 이 가이드는 전문 명리학자들이 직접
              작성하여 정확하고 신뢰할 수 있는 정보를 제공합니다. 단순한 운세가 아닌, 자신을
              이해하고 더 나은 선택을 할 수 있는 인사이트를 얻으시기 바랍니다.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return isWeb ? (
    <FullWidthWebLayout>
      <WebSEO
        title="사주명리학 가이드 - 사주라떼"
        description="사주명리학의 기초부터 실전 활용까지, 전문가가 알려주는 사주 지식 백과사전입니다."
      />
      {content}
    </FullWidthWebLayout>
  ) : (
    <ScrollView className="flex-1 bg-white p-6">
      <WebSEO
        title="사주명리학 가이드 - 사주라떼"
        description="사주명리학의 기초부터 실전 활용까지, 전문가가 알려주는 사주 지식 백과사전입니다."
      />
      {content}
    </ScrollView>
  );
}
