import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { ChevronDown, ChevronUp, ChevronRight, BookOpen } from 'lucide-react-native';
import { WebSEO } from '@/components/ui/WebSEO';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';

import { ENCYCLOPEDIA_DATA } from '@/lib/utils/encyclopedia';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function EncyclopediaScreen() {
  const isWeb = Platform.OS === 'web';
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const content = (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="pb-10">
        {/* Intro Card */}
        <View className="mb-8 rounded-2xl bg-blue-500 p-8 shadow-lg">
          <View className="mb-3 flex-row items-center gap-3">
            <BookOpen size={28} color="white" />
            <Text className="text-2xl font-bold text-white">알기 쉬운 사주 이야기</Text>
          </View>
          <Text className="text-lg leading-7 text-blue-50">
            어렵게만 느껴졌던 사주 용어들, 이제 쉽고 명쾌하게 이해해보세요. 궁금한 카테고리를 눌러
            자세한 내용을 확인할 수 있습니다.
          </Text>
        </View>

        <View className="gap-4">
          {ENCYCLOPEDIA_DATA.map((category) => {
            const isExpanded = expandedSection === category.id;

            return (
              <View
                key={category.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggleSection(category.id)}
                  className={`flex-row items-center justify-between p-6 ${isExpanded ? 'bg-gray-50' : 'bg-white'}`}>
                  <View className="flex-1 pr-4">
                    <Text className="mb-2 text-xl font-bold text-gray-900">{category.title}</Text>
                    <Text className="text-sm text-gray-500" numberOfLines={1}>
                      {category.description}
                    </Text>
                  </View>
                  {isExpanded ? (
                    <ChevronUp size={24} color="#6b7280" />
                  ) : (
                    <ChevronDown size={24} color="#6b7280" />
                  )}
                </TouchableOpacity>

                {isExpanded && (
                  <View className="border-t border-gray-100 bg-white px-2">
                    {category.items.map((item, index) => {
                      const isLast = index === category.items.length - 1;

                      return (
                        <Link key={item.term} href={`/encyclopedia/${item.term}`} asChild>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            className={`p-5 transition-all hover:bg-gray-50 ${!isLast ? 'border-b border-gray-50' : ''}`}>
                            <View className="flex-row items-center justify-between">
                              <View className="flex-1 pr-2">
                                <View className="mb-2 flex-row items-center gap-2">
                                  <Text className="text-lg font-bold text-gray-800">
                                    {item.term}
                                  </Text>
                                  {item.hanja && (
                                    <Text className="rounded bg-amber-50 px-2 py-1 text-sm font-medium text-amber-600">
                                      {item.hanja}
                                    </Text>
                                  )}
                                </View>
                                <Text className="leading-6 text-gray-600" numberOfLines={2}>
                                  {item.description}
                                </Text>
                              </View>
                              <ChevronRight size={20} color="#9ca3af" />
                            </View>
                          </TouchableOpacity>
                        </Link>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );

  return isWeb ? (
    <FullWidthWebLayout>
      <WebSEO
        title="사주 용어 사전 - 사주라떼"
        description="어려운 사주 용어를 쉽게 풀어드립니다. 사주, 팔자, 천간, 지지 등 핵심 개념을 알아보세요."
      />
      {content}
    </FullWidthWebLayout>
  ) : (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <WebSEO
        title="사주 용어 사전 - 사주라떼"
        description="어려운 사주 용어를 쉽게 풀어드립니다. 사주, 팔자, 천간, 지지 등 핵심 개념을 알아보세요."
      />
      {content}
    </ScrollView>
  );
}
