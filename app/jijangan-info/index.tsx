import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Zap, Sparkles, Anchor, TreeDeciduous, Info } from 'lucide-react-native';

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
                <Text className="font-bold text-blue-700">여기</Text>
                <Text className="font-bold text-blue-700">(餘氣)</Text>
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
                <Text className="font-bold text-green-700">중기</Text>
                <Text className="font-bold text-green-700">(中氣)</Text>
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
                <Text className="font-bold text-red-700">정기</Text>
                <Text className="font-bold text-red-700">(正氣)</Text>
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

        {/* Section 4: Classification of Branches (생지, 왕지, 고지) */}
        <View className="gap-3">
          <Text className="text-xl font-bold text-gray-900">지지의 특성에 따른 지장간</Text>
          <Text className="leading-6 text-gray-600">
            12지지는 그 특성에 따라 크게 세 그룹으로 나뉘며, 지장간의 구성 패턴도 다릅니다.
          </Text>

          {/* 인신사해 (맹지) */}
          <View className="rounded-xl border border-rose-100 bg-rose-50/50 p-4">
            <View className="mb-2 flex-row items-center gap-2">
              <View className="rounded-lg bg-rose-100 p-1.5">
                <Zap size={16} color="#be123c" />
              </View>
              <Text className="text-lg font-bold text-rose-800">
                생지(生地): 인(寅), 신(申), 사(巳), 해(亥)
              </Text>
            </View>
            <Text className="text-sm leading-6 text-gray-700">
              • 계절이 시작되는 기운으로 역동적입니다.{'\n'}• 여기(7일), 중기(7일), 정기(16일)로
              구성됩니다.{'\n'}• 중기는 다음 게절의 생지 기운을 미리 품고 있습니다.
            </Text>
          </View>

          {/* 자오묘유 (왕지) */}
          <View className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
            <View className="mb-2 flex-row items-center gap-2">
              <View className="rounded-lg bg-violet-100 p-1.5">
                <Sparkles size={16} color="#6d28d9" />
              </View>
              <Text className="text-lg font-bold text-violet-800">
                왕지(旺地): 자(子), 오(午), 묘(卯), 유(酉)
              </Text>
            </View>
            <Text className="text-sm leading-6 text-gray-700">
              • 계절의 절정으로 기운이 가장 순수하고 강력합니다.{'\n'}• 오(午)를 제외하면 중기가
              없고, 여기(10일)와 정기(20일)로만 구성되어 순수한 기운을 자랑합니다.
            </Text>
          </View>

          {/* 진술축미 (고지) */}
          <View className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
            <View className="mb-2 flex-row items-center gap-2">
              <View className="rounded-lg bg-amber-100 p-1.5">
                <Anchor size={16} color="#b45309" />
              </View>
              <Text className="text-lg font-bold text-amber-800">
                고지(庫地): 진(辰), 술(戌), 축(丑), 미(未)
              </Text>
            </View>
            <Text className="text-sm leading-6 text-gray-700">
              • 계절을 마무리하고 환절기 역할을 합니다.{'\n'}• 여기(9일), 중기(3일), 정기(18일)로
              구성됩니다.{'\n'}• 잡기(雜氣)라고도 하며, 여러 기운이 섞여 있어 복잡다단합니다.
            </Text>
          </View>
        </View>

        {/* Section 5: Practical Application (통근과 투출) */}
        <View className="gap-3">
          <Text className="text-xl font-bold text-gray-900">지장간은 어떻게 해석하나요?</Text>

          <View className="flex-row gap-4">
            {/* 통근 */}
            <View className="flex-1 rounded-2xl border border-gray-200 bg-white p-4">
              <View className="mb-3 items-center">
                <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <TreeDeciduous size={20} color="#059669" />
                </View>
                <Text className="text-lg font-bold text-emerald-800">통근(通根)</Text>
              </View>
              <Text className="text-center text-xs leading-5 text-gray-600">
                천간의 글자가 지장간에 같은 오행을 뿌리 내 린 것.{' '}
                <Text className="font-bold">힘이 있고 튼튼하다</Text>고 해석합니다.
              </Text>
            </View>

            {/* 투출 */}
            <View className="flex-1 rounded-2xl border border-gray-200 bg-white p-4">
              <View className="mb-3 items-center">
                <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-sky-100">
                  <Info size={20} color="#0284c7" />
                </View>
                <Text className="text-lg font-bold text-sky-800">투출(透出)</Text>
              </View>
              <Text className="text-center text-xs leading-5 text-gray-600">
                지장간에 숨어있던 글자가 천간으로 드러난 것.{' '}
                <Text className="font-bold">잠재력이 세상 밖으로 발현</Text>된 것입니다.
              </Text>
            </View>
          </View>

          <View className="mt-2 rounded-xl bg-gray-50 p-4">
            <Text className="text-sm leading-6 text-gray-700">
              💡 <Text className="font-bold">심리 분석의 열쇠:</Text>
              {'\n'}
              지장간은 무의식이나 속마음을 나타내기도 합니다. 겉으로는 밝아 보여도(천간), 지장간에
              우울한 기운이 있다면 남모를 고민이 깊을 수 있습니다.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
