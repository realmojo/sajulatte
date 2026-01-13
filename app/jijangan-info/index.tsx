import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

export default function JijanganInfoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const JIJANGAN_DATA = [
    { ji: '자(子)', jiHanja: '子', yeogi: '임(壬) 10', junggi: '', jeonggi: '계(癸) 20' },
    { ji: '축(丑)', jiHanja: '丑', yeogi: '계(癸) 9', junggi: '신(辛) 3', jeonggi: '기(己) 18' },
    { ji: '인(寅)', jiHanja: '寅', yeogi: '무(戊) 7', junggi: '병(丙) 7', jeonggi: '갑(甲) 16' },
    { ji: '묘(卯)', jiHanja: '卯', yeogi: '갑(甲) 10', junggi: '', jeonggi: '을(乙) 20' },
    { ji: '진(辰)', jiHanja: '辰', yeogi: '을(乙) 9', junggi: '계(癸) 3', jeonggi: '무(戊) 18' },
    { ji: '사(巳)', jiHanja: '巳', yeogi: '무(戊) 7', junggi: '경(庚) 7', jeonggi: '병(丙) 16' },
    { ji: '오(午)', jiHanja: '午', yeogi: '병(丙) 10', junggi: '기(己) 9', jeonggi: '정(丁) 11' },
    { ji: '미(未)', jiHanja: '未', yeogi: '정(丁) 9', junggi: '을(乙) 3', jeonggi: '기(己) 18' },
    { ji: '신(申)', jiHanja: '申', yeogi: '무(戊) 7', junggi: '임(壬) 7', jeonggi: '경(庚) 16' },
    { ji: '유(酉)', jiHanja: '酉', yeogi: '경(庚) 10', junggi: '', jeonggi: '신(辛) 20' },
    { ji: '술(戌)', jiHanja: '戌', yeogi: '신(辛) 9', junggi: '정(丁) 3', jeonggi: '무(戊) 18' },
    { ji: '해(亥)', jiHanja: '亥', yeogi: '무(戊) 7', junggi: '갑(甲) 7', jeonggi: '임(壬) 16' },
  ];

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerShown: true,
          title: '지장간의 원리',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ChevronLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView contentContainerClassName="p-6 gap-8 pb-20">
        {/* Section 1: Definition */}
        <View className="gap-3">
          <Text className="text-xl font-bold text-gray-900">지장간(地藏干)이란?</Text>
          <View className="rounded-2xl bg-amber-50 p-4">
            <Text className="text-base leading-7 text-gray-800">
              지장간은{' '}
              <Text className="font-bold text-amber-700">'지지(땅) 속에 숨겨진 천간(하늘)'</Text>을
              의미합니다.{'\n\n'}
              겉으로 드러난 지지의 모습과 달리, 그 내면에 잠재된 심리나 가능성, 그리고 운의 흐름에
              따라 변화할 수 있는 복합적인 기운을 나타냅니다.
            </Text>
          </View>
        </View>

        {/* Section 2: Composition */}
        <View className="gap-3">
          <Text className="text-xl font-bold text-gray-900">지장간의 구성</Text>
          <Text className="leading-6 text-gray-600">
            모든 지지는 한 달(약 30일)을 기준으로 하여, 계절의 변화에 따라 세 가지 기운으로
            나뉩니다.
          </Text>

          <View className="mt-2 gap-4">
            <View className="flex-row gap-3">
              <View className="w-16 items-center justify-center rounded-lg bg-blue-100 py-2">
                <Text className="font-bold text-blue-700">여기(餘氣)</Text>
              </View>
              <View className="flex-1 justify-center">
                <Text className="font-medium text-gray-900">지난달의 남은 기운</Text>
                <Text className="text-sm text-gray-500">
                  이전 계절에서 넘어와 초기에 영향을 미치는 기운입니다.
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="w-16 items-center justify-center rounded-lg bg-green-100 py-2">
                <Text className="font-bold text-green-700">중기(中氣)</Text>
              </View>
              <View className="flex-1 justify-center">
                <Text className="font-medium text-gray-900">중간에 머무는 기운</Text>
                <Text className="text-sm text-gray-500">
                  삼합(三合)에 의해 생겨나거나, 계절의 연결고리 역할을 하는 기운입니다.
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="w-16 items-center justify-center rounded-lg bg-red-100 py-2">
                <Text className="font-bold text-red-700">정기(正氣)</Text>
              </View>
              <View className="flex-1 justify-center">
                <Text className="font-medium text-gray-900">본래의 중심 기운</Text>
                <Text className="text-sm text-gray-500">
                  가장 강력하고 기간이 길며, 해당 지지의 정체성을 나타냅니다.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section 3: Table */}
        <View className="gap-3">
          <Text className="text-xl font-bold text-gray-900">12지지 지장간 조견표</Text>
          <View className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {/* Table Header */}
            <View className="flex-row border-b border-gray-200 bg-gray-50 py-3">
              <View className="w-16 items-center">
                <Text className="font-bold text-gray-500">지지</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="font-bold text-gray-500">여기</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="font-bold text-gray-500">중기</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="font-bold text-gray-500">정기</Text>
              </View>
            </View>

            {/* Table Rows */}
            {JIJANGAN_DATA.map((row, idx) => (
              <View
                key={idx}
                className={`flex-row border-b border-gray-100 py-3 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <View className="w-16 items-center justify-center border-r border-gray-100">
                  <Text className="text-lg font-bold text-gray-800">{row.jiHanja}</Text>
                  <Text className="text-xs text-gray-400">{row.ji}</Text>
                </View>
                <View className="flex-1 items-center justify-center">
                  <Text className="text-sm text-gray-600">{row.yeogi}</Text>
                </View>
                <View className="flex-1 items-center justify-center">
                  <Text className="text-sm text-gray-600">{row.junggi || '-'}</Text>
                </View>
                <View className="flex-1 items-center justify-center">
                  <Text className="text-sm font-semibold text-gray-900">{row.jeonggi}</Text>
                </View>
              </View>
            ))}
          </View>
          <Text className="mt-2 text-center text-xs text-gray-400">
            * 숫자는 해당 기운이 관장하는 날짜 수를 의미합니다. (총 30일)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
