import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { WebSEO } from '@/components/ui/WebSEO';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';
import { ChevronLeft } from 'lucide-react-native';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <FullWidthWebLayout>
      <WebSEO title="이용약관 - 사주라떼" description="사주라떼 서비스 이용약관을 확인하세요." />

      <View className="flex-1 bg-white">
        {/* Header with Back Button */}
        <View className="border-b border-gray-100 bg-white px-4 py-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center gap-1 self-start rounded-lg p-2 active:bg-gray-100">
            <ChevronLeft size={20} color="#4b5563" />
            <Text className="font-medium text-gray-600">뒤로가기</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="mx-auto max-w-4xl px-6 py-10 md:px-12 md:py-16">
            <View className="mb-10 border-b border-gray-200 pb-8">
              <Text className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                서비스 이용약관
              </Text>
              <Text className="text-lg leading-relaxed text-gray-600">
                본 약관은 사주라떼(이하 "회사")가 제공하는 서비스의 이용조건 및 절차, 이용자와
                회사의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
              </Text>
              <Text className="mt-4 text-sm text-gray-400">시행일: 2026.01.11</Text>
            </View>

            <View className="space-y-10">
              <View className="mb-8">
                <Text className="mb-4 text-xl font-bold text-gray-900">제1조 (목적)</Text>
                <Text className="leading-7 text-gray-700">
                  이 약관은 회사가 운영하는 어플리케이션 및 웹사이트를 통해 제공하는 인터넷 관련
                  서비스(이하 "서비스")를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을
                  규정함을 목적으로 합니다.
                </Text>
              </View>

              <View className="mb-8">
                <Text className="mb-4 text-xl font-bold text-gray-900">제2조 (용어의 정의)</Text>
                <View className="rounded-xl bg-gray-50 p-6">
                  <Text className="leading-7 text-gray-700">
                    <Text className="font-bold">1. "서비스"란</Text> 구현되는 단말기(PC,
                    휴대형단말기 등 각종 유무선 장치를 포함)와 상관없이 "회원"이 이용할 수 있는
                    사주라떼 및 사주라떼 관련 제반 서비스를 의미합니다.{'\n\n'}
                    <Text className="font-bold">2. "회원"이라 함은</Text> 회사의 "서비스"에 접속하여
                    이 약관에 따라 "회사"와 이용계약을 체결하고 "회사"가 제공하는 "서비스"를
                    이용하는 고객을 말합니다.
                  </Text>
                </View>
              </View>

              <View className="mb-8">
                <Text className="mb-4 text-xl font-bold text-gray-900">
                  제3조 (약관의 게시와 개정)
                </Text>
                <Text className="leading-7 text-gray-700">
                  1. "회사"는 이 약관의 내용을 "회원"이 쉽게 알 수 있도록 서비스 초기 화면에
                  게시합니다.{'\n'}
                  2. "회사"는 "약관의규제에관한법률", "정보통신망이용촉진및정보보호등에관한법률" 등
                  관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
                </Text>
              </View>

              <View className="mb-8">
                <Text className="mb-4 text-xl font-bold text-gray-900">
                  제4조 (개인정보보호 의무)
                </Text>
                <Text className="leading-7 text-gray-700">
                  "회사"는 "정보통신망법" 등 관계 법령이 정하는 바에 따라 "회원"의 개인정보를
                  보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련법 및 "회사"의
                  개인정보처리방침이 적용됩니다.
                </Text>
              </View>

              <View className="mb-8">
                <Text className="mb-4 text-xl font-bold text-gray-900">제5조 (면책조항)</Text>
                <View className="rounded-xl bg-gray-50 p-6">
                  <Text className="leading-7 text-gray-700">
                    1. "회사"는 천재지변 또는 이에 준하는 불가항력으로 인하여 "서비스"를 제공할 수
                    없는 경우에는 "서비스" 제공에 관한 책임이 면제됩니다.{'\n'}
                    2. "회사"는 "회원"의 귀책사유로 인한 "서비스" 이용의 장애에 대하여는 책임을 지지
                    않습니다.{'\n'}
                    3. "서비스"에서 제공하는 사주 분석 결과는 명리학적 통계에 기반한 것으로, 그
                    정확성을 보증하지 않으며 참고용으로만 활용되어야 합니다.
                  </Text>
                </View>
              </View>

              <View className="mt-8 border-t border-gray-100 pt-8">
                <Text className="mb-2 text-lg font-bold text-gray-900">부칙</Text>
                <Text className="text-gray-600">본 약관은 2026년 1월 11일부터 적용됩니다.</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </FullWidthWebLayout>
  );
}
