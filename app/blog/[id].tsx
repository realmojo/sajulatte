import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebSEO } from '@/components/ui/WebSEO';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';
import { ChevronLeft, Calendar, Clock, Share2 } from 'lucide-react-native';
import { blogContent } from './data';

export default function BlogDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const article = blogContent[id as string];

  if (!article) {
    return (
      <FullWidthWebLayout>
        <View className="flex-1 items-center justify-center p-8">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Text className="text-3xl">😢</Text>
          </View>
          <Text className="mb-2 text-xl font-bold text-gray-900">게시글을 찾을 수 없습니다.</Text>
          <Text className="mb-6 text-gray-500">
            요청하신 문서가 존재하지 않거나 삭제되었습니다.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="rounded-xl bg-amber-500 px-6 py-3">
            <Text className="font-bold text-white">목록으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </FullWidthWebLayout>
    );
  }

  return (
    <FullWidthWebLayout>
      <WebSEO title={`${article.title} - 사주라떼`} description={article.description} />

      {/* Back Button Header (Mobile friendly addition) */}
      <View className="border-b border-gray-100 bg-white px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1 self-start rounded-lg p-2 active:bg-gray-100">
          <ChevronLeft size={20} color="#4b5563" />
          <Text className="font-medium text-gray-600">목록</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Article Header */}
        <View className="border-b border-gray-100 bg-gradient-to-b from-amber-50/50 to-white px-6 py-8 md:px-12 md:py-12">
          <View className="mb-4 flex-row items-center gap-3">
            <View className="rounded-full bg-amber-100 px-3 py-1">
              <Text className="text-xs font-bold text-amber-700">{article.category}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Clock size={14} color="#9ca3af" />
              <Text className="text-sm text-gray-500">{article.readTime} 읽기</Text>
            </View>
          </View>
          <Text className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            {article.title}
          </Text>
          <Text className="mb-4 text-lg leading-relaxed text-gray-600 md:text-xl">
            {article.description}
          </Text>

          <View className="mt-4 flex-row items-center justify-between border-t border-gray-100 pt-4">
            <View className="flex-row items-center gap-2">
              <Calendar size={16} color="#9ca3af" />
              <Text className="text-sm text-gray-400">{article.date}</Text>
            </View>

            {/* Share Button Placeholder */}
            <TouchableOpacity className="rounded-full p-2 hover:bg-gray-100 active:bg-gray-100">
              <Share2 size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Article Content */}
        <View className="px-6 py-8 md:max-w-4xl md:px-12">
          {article.content.map((section: any, index: number) => {
            if (section.type === 'heading') {
              return (
                <Text
                  key={index}
                  className="mb-4 mt-8 text-2xl font-bold leading-snug text-gray-900">
                  {section.text}
                </Text>
              );
            }
            if (section.type === 'paragraph') {
              return (
                <Text key={index} className="mb-4 text-lg leading-8 text-gray-700">
                  {section.text}
                </Text>
              );
            }
            if (section.type === 'list') {
              return (
                <View key={index} className="mb-6 gap-3 rounded-xl bg-gray-50 p-6">
                  {section.items.map((item: string, itemIndex: number) => (
                    <View key={itemIndex} className="flex-row gap-3">
                      <View className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <Text className="flex-1 text-lg leading-7 text-gray-700">{item}</Text>
                    </View>
                  ))}
                </View>
              );
            }
            return null;
          })}
        </View>

        {/* Author Box */}
        <View className="mx-6 mb-12 mt-8 max-w-4xl rounded-3xl bg-amber-50 p-8 md:mx-12">
          <View className="mb-4 flex-row items-center gap-4">
            <View className="h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-amber-200 shadow-sm">
              <Text className="text-2xl">✍️</Text>
            </View>
            <View>
              <Text className="text-lg font-bold text-gray-900">사주라떼 전문가팀</Text>
              <Text className="text-amber-700">명리학 전문 연구원</Text>
            </View>
          </View>
          <Text className="text-lg leading-relaxed text-gray-700">
            20년 이상의 명리학 연구 경험을 가진 전문가들이 정확하고 신뢰할 수 있는 정보를 제공하기
            위해 노력하고 있습니다. 사주라떼와 함께 당신의 운명을 개척하세요.
          </Text>
        </View>
      </ScrollView>
    </FullWidthWebLayout>
  );
}
