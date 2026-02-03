import { View, Text, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { WebSEO } from '@/components/ui/WebSEO';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';
import { Clock, Calendar, ArrowRight, Sparkles, TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import { blogArticles, categories } from './data';

export default function BlogIndexScreen() {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredArticles = blogArticles.filter(
    (article) => selectedCategory === '전체' || article.category === selectedCategory
  );

  /* Structured Data for SEO: Blog */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '사주명리학 가이드 - 사주라떼',
    description: '사주명리학의 기초부터 실전 활용까지, 전문가가 알려주는 사주 지식 백과사전',
    url: 'https://sajulatte.app/blog',
    blogPost: blogArticles.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.description,
      datePublished: article.date,
      author: {
        '@type': 'Organization',
        name: '사주라떼',
      },
      url: `https://sajulatte.app/blog/${article.id}`,
    })),
  };

  const seoProps = {
    title: '사주명리학 가이드 - 사주라떼',
    description:
      '사주명리학의 기초부터 실전 활용까지, 전문가가 알려주는 사주 지식 백과사전입니다. 천간, 지지, 십신 등 다양한 주제를 다룹니다.',
    keywords: '사주 공부, 명리학 강의, 사주 블로그, 천간 지지, 십신, 운세 보는 법',
    url: 'https://sajulatte.app/blog',
    type: 'blog',
    image: 'https://sajulatte.app/assets/images/og-image.png',
    jsonLd: jsonLd,
  };

  return (
    <FullWidthWebLayout>
      <WebSEO {...seoProps} />
      <View className="flex-1 px-4 md:px-0">
        {/* Hero Section */}
        <View className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 p-6 md:mb-12 md:p-12">
          <View className="relative z-10">
            <View className="mb-4 flex-row items-center gap-2">
              <Sparkles size={24} color="#fff" />
              <Text className="text-sm font-semibold uppercase tracking-wider text-white/90">
                Knowledge Base
              </Text>
            </View>
            <Text className="mb-4 text-3xl font-bold text-white md:text-5xl">
              사주명리학 가이드
            </Text>
            <Text className="max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
              천년의 지혜를 현대적으로 풀어낸 전문 가이드
            </Text>
            <View className="mt-8 flex-row items-center gap-3">
              <Text className="text-sm font-semibold text-white/80">
                총 {filteredArticles.length}개의 아티클
                {selectedCategory !== '전체' && ` (${selectedCategory})`}
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
            {/* Native Safe Scroll Wrapper if needed, or just flex-wrap view for web */}
            <View className="flex-row flex-wrap gap-2 md:gap-3">
              {categories.map((category, index) => {
                const isSelected = selectedCategory === category.name;
                return (
                  <Pressable
                    key={index}
                    onPress={() => setSelectedCategory(category.name)}
                    className={`flex-row items-center gap-2 rounded-full border-2 px-4 py-2 transition-all active:scale-95 md:px-6 md:py-3 ${
                      isSelected ? 'border-gray-900 bg-gray-900' : 'bg-white hover:scale-105'
                    }`}
                    style={!isSelected ? { borderColor: category.color } : {}}>
                    {!isSelected && (
                      <View
                        className="h-2 w-2 rounded-full md:h-3 md:w-3"
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    <Text
                      className={`text-sm font-semibold md:text-base ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                      {category.name}
                    </Text>
                    <View
                      className="rounded-full px-2 py-0.5"
                      style={{
                        backgroundColor: isSelected
                          ? 'rgba(255,255,255,0.2)'
                          : category.color + '20',
                      }}>
                      <Text
                        className="text-[10px] font-bold md:text-xs"
                        style={{ color: isSelected ? '#fff' : category.color }}>
                        {category.count}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Articles Grid */}
        <View className="mb-12 flex-row flex-wrap gap-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Link key={article.id} href={`/blog/${article.id}` as any} asChild>
                <Pressable className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:scale-105 active:bg-gray-50 md:w-[47%] lg:w-[31%]">
                  {/* Colored Header */}
                  <View className="h-2" style={{ backgroundColor: article.color }} />

                  {/* Content */}
                  <View className="p-5 md:p-6">
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
                    <Text className="mb-2 text-xl font-bold leading-tight text-gray-900 md:text-2xl">
                      {article.title}
                    </Text>
                    <Text className="mb-3 text-sm font-medium text-gray-500">
                      {article.subtitle}
                    </Text>

                    {/* Description */}
                    <Text
                      className="mb-4 text-sm leading-relaxed text-gray-600 md:text-base"
                      numberOfLines={3}>
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
            ))
          ) : (
            <View className="w-full items-center justify-center py-20">
              <Text className="text-lg text-gray-400">해당 카테고리에 글이 없습니다.</Text>
            </View>
          )}
        </View>

        {/* Popular Topics Section */}
        <View className="mb-12 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 md:p-8">
          <View className="mb-6 flex-row items-center gap-3">
            <TrendingUp size={24} color="#8b5cf6" />
            <Text className="text-xl font-bold text-gray-900 md:text-2xl">인기 주제</Text>
          </View>
          <View className="flex-row flex-wrap gap-4">
            {[
              { title: '천간 이해하기', id: 'ten-heavenly-stems' },
              { title: '지지 분석법', id: 'twelve-earthly-branches' },
              { title: '대운 보는 법', id: 'yearly-fortune' },
              { title: '궁합 비결', id: 'marriage-compatibility' },
            ].map((item, index) => (
              <Link key={index} href={`/blog/${item.id}` as any} asChild>
                <Pressable className="w-full rounded-xl bg-white p-4 transition-all hover:scale-105 active:bg-gray-100 md:w-[23%]">
                  <Text className="text-center font-semibold text-gray-900">{item.title}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        {/* Expert Advice */}
        <View className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 md:p-8">
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
    </FullWidthWebLayout>
  );
}
