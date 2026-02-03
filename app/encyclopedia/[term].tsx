import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Share2 } from 'lucide-react-native';
import { WebSEO } from '@/components/ui/WebSEO';
import { getEncyclopediaItem } from '@/lib/utils/encyclopedia';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';

export default function EncyclopediaDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { term } = useLocalSearchParams();
  const isWeb = Platform.OS === 'web';

  const item = typeof term === 'string' ? getEncyclopediaItem(term) : null;

  if (!item) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Stack.Screen options={{ headerShown: false }} />
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-gray-500">항목을 찾을 수 없습니다.</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* Structured Data for SEO: DefinedTerm */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: item.term,
    termCode: item.hanja,
    description: item.description,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: '사주 용어 사전',
      url: 'https://sajulatte.app/encyclopedia',
    },
  };

  const seoProps = {
    title: `${item.term} (${item.hanja || ''}) - 사주 용어 사전`,
    description: `${item.description.slice(0, 150)}... ${item.details ? item.details.slice(0, 50) : ''}`,
    jsonLd: jsonLd,
    url: `https://sajulatte.app/encyclopedia/${encodeURIComponent(item.term)}`,
    keywords: `사주, 용어, ${item.term}, ${item.hanja || ''}, ${item.categoryTitle}, 뜻, 의미`,
  };

  const content = (
    <ScrollView className="flex-1" contentContainerClassName="p-6 pb-20">
      {/* Category Badge */}
      <View className="mb-4 self-start rounded-full bg-blue-50 px-3 py-1">
        <Text className="text-xs font-bold text-blue-600">{item.categoryTitle}</Text>
      </View>

      {/* Title */}
      <View className="mb-6 flex-row items-end gap-3">
        <Text className="text-3xl font-bold text-gray-900">{item.term}</Text>
        {item.hanja && <Text className="mb-1 text-xl font-medium text-gray-400">{item.hanja}</Text>}
      </View>

      {/* Description Section */}
      <View className="mb-8 rounded-2xl bg-gray-50 p-6">
        <Text className="text-lg font-medium leading-8 text-gray-800">{item.description}</Text>
      </View>

      {/* Details Section */}
      {item.details && (
        <View className="gap-3">
          <Text className="text-xl font-bold text-gray-900">상세 설명</Text>
          <Text className="text-base leading-7 text-gray-600">{item.details}</Text>
        </View>
      )}

      {/* AdSense Placement Area (Placeholder) */}
      <View className="mt-12 items-center justify-center rounded-lg bg-gray-100 py-10">
        <Text className="text-sm text-gray-400">Advertisement Area</Text>
      </View>
    </ScrollView>
  );

  if (isWeb) {
    return (
      <FullWidthWebLayout>
        <WebSEO {...seoProps} />
        {content}
      </FullWidthWebLayout>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <WebSEO {...seoProps} />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header (Mobile Only) */}
      <View className="flex-row items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
        <View className="flex-row gap-4">
          <TouchableOpacity>
            <Share2 size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {content}
    </View>
  );
}
