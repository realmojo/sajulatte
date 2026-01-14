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
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebSEO } from '@/components/ui/WebSEO';

import { ENCYCLOPEDIA_DATA } from '@/lib/utils/encyclopedia';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function EncyclopediaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const toggleItem = (itemTerm: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItems((prev) =>
      prev.includes(itemTerm) ? prev.filter((t) => t !== itemTerm) : [...prev, itemTerm]
    );
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <WebSEO
        title="디지털 부적 - 사주라떼"
        description="나만의 디지털 부적으로 행운을 높여보세요."
      />

      <ScrollView className="flex-1" contentContainerClassName="p-4 pb-10">
        {/* Intro Card */}
        <View className="mb-6 rounded-2xl bg-blue-500 p-6">
          <View className="mb-2 flex-row items-center gap-2">
            <BookOpen size={24} color="white" />
            <Text className="text-lg font-bold text-white">알기 쉬운 사주 이야기</Text>
          </View>
          <Text className="leading-6 text-blue-50">
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
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggleSection(category.id)}
                  className={`flex-row items-center justify-between p-5 ${isExpanded ? 'bg-gray-50' : 'bg-white'}`}>
                  <View className="flex-1 pr-4">
                    <Text className="mb-1 text-lg font-bold text-gray-900">{category.title}</Text>
                    <Text className="text-sm text-gray-500" numberOfLines={1}>
                      {category.description}
                    </Text>
                  </View>
                  {isExpanded ? (
                    <ChevronUp size={20} color="#6b7280" />
                  ) : (
                    <ChevronDown size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>

                {isExpanded && (
                  <View className="border-t border-gray-100 bg-white px-2">
                    {category.items.map((item, index) => {
                      const isItemExpanded = expandedItems.includes(item.term);
                      const isLast = index === category.items.length - 1;

                      return (
                        <TouchableOpacity
                          key={item.term}
                          activeOpacity={0.7}
                          onPress={() => toggleItem(item.term)}
                          className={`p-4 ${!isLast ? 'border-b border-gray-50' : ''}`}>
                          <View className="flex-row items-start justify-between">
                            <View className="flex-1">
                              <View className="mb-1 flex-row items-center gap-2">
                                <Text className="text-base font-bold text-gray-800">
                                  {item.term}
                                </Text>
                                {item.hanja && (
                                  <Text className="rounded bg-amber-50 px-1.5 py-0.5 text-sm font-medium text-amber-600">
                                    {item.hanja}
                                  </Text>
                                )}
                              </View>
                              <Text className="text-sm leading-5 text-gray-600">
                                {item.description}
                              </Text>
                            </View>
                            <View className="ml-2 mt-1">
                              {isItemExpanded ? (
                                <ChevronUp size={16} color="#9ca3af" />
                              ) : (
                                <ChevronDown size={16} color="#9ca3af" />
                              )}
                            </View>
                          </View>

                          {isItemExpanded && item.details && (
                            <View className="mt-3 rounded-lg bg-gray-50 p-3">
                              <Text className="text-sm leading-5 text-gray-700">
                                <Text className="font-bold">💡 상세설명: </Text>
                                {item.details}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
