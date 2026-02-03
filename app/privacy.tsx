import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { WebSEO } from '@/components/ui/WebSEO';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';
import { ChevronLeft } from 'lucide-react-native';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <FullWidthWebLayout>
      <WebSEO
        title="개인정보처리방침 - 사주라떼"
        description="사주라떼 개인정보처리방침을 확인하세요."
      />

      <View className="flex-1 bg-white">
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="mx-auto max-w-4xl px-6 py-10 md:px-12 md:py-16">
            <View className="mb-10 border-b border-gray-200 pb-8">
              <Text className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                개인정보처리방침
              </Text>
              <Text className="text-lg leading-relaxed text-gray-600">
                사주라떼(이하 "회사")는 이용자의 개인정보를 중요시하며, "정보통신망 이용촉진 및
                정보보호"에 관한 법률을 준수하고 있습니다.
              </Text>
              <Text className="mt-4 text-sm text-gray-400">최종 수정일: 2026.01.11</Text>
            </View>

            <View className="space-y-10">
              <View className="mb-8">
                <Text className="mb-4 text-xl font-bold text-gray-900">
                  1. 수집하는 개인정보 항목
                </Text>
                <View className="rounded-xl bg-gray-50 p-6">
                  <Text className="leading-7 text-gray-700">
                    회사는 사주 분석 및 서비스 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.
                    {'\n\n'}
                    <Text className="font-bold">• 수집항목 :</Text> 이름, 생년월일, 태어난 시간,
                    성별{'\n'}
                    <Text className="font-bold">• 수집방법 :</Text> 어플리케이션 및 홈페이지 내 정보
                    입력
                  </Text>
                </View>
              </View>

              <View className="mb-8">
                <Text className="mb-4 text-xl font-bold text-gray-900">
                  2. 개인정보의 수집 및 이용목적
                </Text>
                <Text className="leading-7 text-gray-700">
                  회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.{'\n'}•{' '}
                  <Text className="font-bold">서비스 제공 :</Text> 명리학적 분석에 기반한 사주풀이
                  결과 제공, 만세력 달력 표시, 운세 서비스 제공{'\n'}•{' '}
                  <Text className="font-bold">회원 관리 :</Text> 개인 식별, 서비스 이용 기록 관리
                </Text>
              </View>

              <View className="mb-8">
                <Text className="mb-4 text-xl font-bold text-gray-900">
                  3. 개인정보의 보유 및 이용기간
                </Text>
                <Text className="leading-7 text-gray-700">
                  원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이
                  파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는
                  관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
                </Text>
              </View>

              <View className="mb-8">
                <Text className="mb-4 text-xl font-bold text-gray-900">
                  4. 개인정보의 파기절차 및 방법
                </Text>
                <Text className="leading-7 text-gray-700">
                  회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이
                  파기합니다. 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여
                  삭제합니다.
                </Text>
              </View>

              <View className="mb-8">
                <Text className="mb-4 text-xl font-bold text-gray-900">
                  5. 이용자 및 법정대리인의 권리와 행사방법
                </Text>
                <Text className="leading-7 text-gray-700">
                  이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며
                  가입해지를 요청할 수 있습니다. 개인정보 관리 메뉴를 통해 직접 정보를 수정하거나
                  삭제할 수 있습니다.
                </Text>
              </View>

              <View className="mb-8 rounded-xl border border-gray-100 bg-gray-50 p-8">
                <Text className="mb-4 text-xl font-bold text-gray-900">6. 개인정보 보호책임자</Text>
                <Text className="mb-4 leading-7 text-gray-700">
                  회사는 고객의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와
                  같이 관련 부서 및 개인정보보호책임자를 지정하고 있습니다.
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text className="font-bold text-gray-900">이메일 문의:</Text>
                  <Text className="text-blue-600 underline">help@sajulatte.app</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </FullWidthWebLayout>
  );
}
