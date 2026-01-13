import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebSEO } from '@/components/ui/WebSEO';

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <WebSEO
        title="개인정보처리방침 - 사주라떼"
        description="사주라떼 개인정보처리방침을 확인하세요."
      />

      <ScrollView className="flex-1 p-6" contentContainerClassName="pb-10">
        <View className="mb-8">
          <Text className="mb-4 text-2xl font-bold text-gray-900">개인정보처리방침</Text>
          <Text className="mb-6 text-gray-600">
            사주라떼(이하 "회사")는 이용자의 개인정보를 중요시하며, "정보통신망 이용촉진 및
            정보보호"에 관한 법률을 준수하고 있습니다.
          </Text>

          <View className="mb-6">
            <Text className="mb-2 text-lg font-bold text-gray-800">1. 수집하는 개인정보 항목</Text>
            <Text className="leading-6 text-gray-600">
              회사는 사주 분석 및 서비스 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.{'\n'}
              - 수집항목 : 이름, 생년월일, 태어난 시간, 성별{'\n'}- 개인정보 수집방법 : 어플리케이션
              및 홈페이지 내 정보 입력
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-lg font-bold text-gray-800">
              2. 개인정보의 수집 및 이용목적
            </Text>
            <Text className="leading-6 text-gray-600">
              회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.{'\n'}- 서비스 제공: 명리학적
              분석에 기반한 사주풀이 결과 제공, 만세력 달력 표시, 운세 서비스 제공{'\n'}- 회원 관리
              (회원 가입 시): 개인 식별, 서비스 이용 기록 관리
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-lg font-bold text-gray-800">
              3. 개인정보의 보유 및 이용기간
            </Text>
            <Text className="leading-6 text-gray-600">
              원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이
              파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 관계법령에서
              정한 일정한 기간 동안 회원정보를 보관합니다.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-lg font-bold text-gray-800">
              4. 개인정보의 파기절차 및 방법
            </Text>
            <Text className="leading-6 text-gray-600">
              회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이
              파기합니다. 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여
              삭제합니다.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-lg font-bold text-gray-800">
              5. 이용자 및 법정대리인의 권리와 그 행사방법
            </Text>
            <Text className="leading-6 text-gray-600">
              이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며
              가입해지를 요청할 수 있습니다. 개인정보 관리 메뉴를 통해 직접 정보를 수정하거나 삭제할
              수 있습니다.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-lg font-bold text-gray-800">6. 개인정보 보호책임자</Text>
            <Text className="leading-6 text-gray-600">
              회사는 고객의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이
              관련 부서 및 개인정보보호책임자를 지정하고 있습니다.{'\n'}- 이메일 :
              help@sajulatte.app
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
