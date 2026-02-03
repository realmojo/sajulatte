import { View, Text, ScrollView, Pressable, Linking, Platform } from 'react-native';
import { WebSEO } from '@/components/ui/WebSEO';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';

export default function ContactScreen() {
  const isWeb = Platform.OS === 'web';

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@sajulatte.app');
  };

  const handleBusinessEmailPress = () => {
    Linking.openURL('mailto:business@sajulatte.app');
  };

  const content = (
    <View className="flex-1">
      {/* Header */}
      <View className="mb-8 rounded-2xl bg-gradient-to-b from-amber-600 to-amber-500 p-12">
        <Text className="mb-3 text-5xl font-bold text-white">문의하기</Text>
        <Text className="text-xl text-amber-50">
          궁금한 점이나 불편한 사항이 있으신가요?{'\n'}
          언제든 편하게 연락주세요.
        </Text>
      </View>

      {/* Contact Methods Grid */}
      <View className="mb-12 flex-row flex-wrap gap-6">
        {/* Customer Support */}
        <Pressable
          onPress={handleEmailPress}
          style={{ width: 'calc(50% - 12px)', minWidth: 300 }}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:scale-105 active:opacity-70">
          <View className="p-8">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
              <Text className="text-3xl">📧</Text>
            </View>
            <Text className="mb-2 text-2xl font-bold text-gray-900">고객 지원</Text>
            <Text className="mb-4 text-lg leading-7 text-gray-600">
              서비스 이용 중 문제가 발생하거나 궁금한 점이 있으시면 언제든 문의해주세요.
            </Text>
            <View className="rounded-lg bg-amber-50 p-4">
              <Text className="text-lg font-semibold text-amber-800">support@sajulatte.app</Text>
            </View>
            <Text className="mt-3 text-sm text-gray-500">
              평일 09:00 - 18:00 (주말 및 공휴일 휴무){'\n'}
              평균 응답 시간: 24시간 이내
            </Text>
          </View>
        </Pressable>

        {/* Business Inquiry */}
        <Pressable
          onPress={handleBusinessEmailPress}
          style={{ width: 'calc(50% - 12px)', minWidth: 300 }}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:scale-105 active:opacity-70">
          <View className="p-8">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
              <Text className="text-3xl">💼</Text>
            </View>
            <Text className="mb-2 text-2xl font-bold text-gray-900">비즈니스 문의</Text>
            <Text className="mb-4 text-lg leading-7 text-gray-600">
              제휴, 협업, 광고 등 비즈니스 관련 문의는 별도 이메일로 연락주세요.
            </Text>
            <View className="rounded-lg bg-blue-50 p-4">
              <Text className="text-lg font-semibold text-blue-800">business@sajulatte.app</Text>
            </View>
          </View>
        </Pressable>

        {/* Bug Report */}
        <View
          style={{ width: 'calc(50% - 12px)', minWidth: 300 }}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <View className="p-8">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
              <Text className="text-3xl">🐛</Text>
            </View>
            <Text className="mb-2 text-2xl font-bold text-gray-900">버그 리포트</Text>
            <Text className="mb-4 text-lg leading-7 text-gray-600">
              앱 사용 중 오류나 버그를 발견하셨나요? 자세한 내용을 알려주시면 빠르게 수정하겠습니다.
            </Text>
            <View className="gap-3">
              <Text className="text-gray-600">📱 기기 모델</Text>
              <Text className="text-gray-600">📊 OS 버전</Text>
              <Text className="text-gray-600">🎯 발생 상황 (스크린샷 포함)</Text>
            </View>
          </View>
        </View>

        {/* Feature Request */}
        <View
          style={{ width: 'calc(50% - 12px)', minWidth: 300 }}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <View className="p-8">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
              <Text className="text-3xl">💡</Text>
            </View>
            <Text className="mb-2 text-2xl font-bold text-gray-900">기능 제안</Text>
            <Text className="text-lg leading-7 text-gray-600">
              사주라떼를 더 좋은 서비스로 만들어 주세요. 원하시는 기능이나 개선사항을 제안해주시면
              적극 검토하겠습니다.
            </Text>
          </View>
        </View>
      </View>

      {/* Office Info */}
      <View className="mb-8 rounded-2xl bg-gray-50 p-8">
        <Text className="mb-6 text-2xl font-bold text-gray-900">회사 정보</Text>
        <View className="gap-4">
          <View>
            <Text className="mb-1 text-sm font-semibold text-gray-500">상호명</Text>
            <Text className="text-lg text-gray-900">사주라떼</Text>
          </View>
          <View>
            <Text className="mb-1 text-sm font-semibold text-gray-500">대표 이메일</Text>
            <Text className="text-lg text-gray-900">help@sajulatte.app</Text>
          </View>
          <View>
            <Text className="mb-1 text-sm font-semibold text-gray-500">고객센터 운영시간</Text>
            <Text className="text-lg text-gray-900">평일 09:00 - 18:00 (주말, 공휴일 휴무)</Text>
          </View>
        </View>
      </View>

      {/* FAQ Link */}
      <View className="mb-8 rounded-2xl border-2 border-amber-200 bg-amber-50 p-8">
        <Text className="mb-2 text-xl font-bold text-amber-900">🔍 자주 묻는 질문</Text>
        <Text className="mb-4 text-lg leading-7 text-amber-800">
          문의하시기 전에 FAQ 페이지를 먼저 확인해보세요.{'\n'}
          대부분의 질문에 대한 답변을 빠르게 찾으실 수 있습니다.
        </Text>
        <Text className="font-semibold text-amber-600">→ FAQ 페이지 바로가기</Text>
      </View>

      {/* Response Time Notice */}
      <View className="rounded-2xl bg-blue-50 p-8">
        <Text className="mb-2 text-xl font-bold text-blue-900">📬 답변 안내</Text>
        <Text className="text-lg leading-7 text-blue-800">
          접수된 문의는 순차적으로 처리되며, 영업일 기준 24시간 내 답변드립니다. 주말이나 공휴일에
          접수된 문의는 익일 영업일에 확인 후 답변해드립니다.
        </Text>
      </View>
    </View>
  );

  return isWeb ? (
    <FullWidthWebLayout>
      <WebSEO
        title="문의하기 - 사주라떼"
        description="사주라떼에 궁금한 점이나 제안사항이 있으신가요? 언제든지 편하게 연락주세요. 빠르고 친절하게 답변해드리겠습니다."
      />
      {content}
    </FullWidthWebLayout>
  ) : (
    <ScrollView className="flex-1 bg-white p-6">
      <WebSEO
        title="문의하기 - 사주라떼"
        description="사주라떼에 궁금한 점이나 제안사항이 있으신가요? 언제든지 편하게 연락주세요. 빠르고 친절하게 답변해드리겠습니다."
      />
      {content}
    </ScrollView>
  );
}
