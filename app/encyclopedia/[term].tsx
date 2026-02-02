import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Share2 } from 'lucide-react-native';
import { WebSEO } from '@/components/ui/WebSEO';
import { getEncyclopediaItem } from '@/lib/utils/encyclopedia';

export default function EncyclopediaDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { term } = useLocalSearchParams();

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

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <WebSEO
        title={`${item.term} (${item.hanja || ''}) - 사주 용어 사전`}
        description={`${item.term}의 의미: ${item.description} ${item.details || ''}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'DefinedTerm',
          name: item.term,
          description: item.description,
          inDefinedTermSet: '사주학 용어 사전',
        }}
      />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
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

      <ScrollView className="flex-1" contentContainerClassName="p-6 pb-20">
        {/* Category Badge */}
        <View className="mb-4 self-start rounded-full bg-blue-50 px-3 py-1">
          <Text className="text-xs font-bold text-blue-600">{item.categoryTitle}</Text>
        </View>

        {/* Title */}
        <View className="mb-6 flex-row items-end gap-3">
          <Text className="text-3xl font-bold text-gray-900">{item.term}</Text>
          {item.hanja && (
            <Text className="mb-1 text-xl font-medium text-gray-400">{item.hanja}</Text>
          )}
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
    </View>
  );
}
