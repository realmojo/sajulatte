import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useState } from 'react';
import { WebSEO } from '@/components/ui/WebSEO';
import { Link } from 'expo-router';
import { FullWidthWebLayout } from '@/components/FullWidthWebLayout';

const faqData = [
  {
    category: '서비스 이용',
    questions: [
      {
        q: '사주라떼는 무료로 이용할 수 있나요?',
        a: '네, 사주라떼의 기본 기능은 모두 무료로 이용하실 수 있습니다. 사주 조회, 만세력 달력, 기본 운세 분석 등 핵심 기능을 무료로 제공하고 있습니다. 추가적인 프리미엄 기능은 향후 제공될 예정입니다.',
      },
      {
        q: '정확한 사주 분석을 위해 무엇이 필요한가요?',
        a: '정확한 사주 분석을 위해서는 생년월일과 태어난 시간이 필요합니다. 특히 태어난 시간(시주)은 사주 팔자의 4분의 1을 차지하므로 매우 중요합니다. 만약 태어난 시간을 모르신다면 가족분들께 문의하시거나 출생신고서를 확인해보시기 바랍니다.',
      },
      {
        q: '입력한 개인정보는 안전하게 보관되나요?',
        a: '네, 사용자의 개인정보는 암호화되어 안전하게 저장됩니다. 저희는 개인정보보호법을 철저히 준수하며, 사용자의 동의 없이 어떠한 정보도 제3자에게 제공하지 않습니다. 자세한 내용은 개인정보처리방침을 참고해주세요.',
      },
      {
        q: '앱과 웹 모두 사용할 수 있나요?',
        a: '네, 사주라떼는 모바일 앱과 웹사이트 모두에서 이용 가능합니다. 동일한 계정으로 로그인하시면 어떤 기기에서든 저장된 정보를 확인하실 수 있습니다.',
      },
    ],
  },
  {
    category: '사주 해석',
    questions: [
      {
        q: '사주 결과가 좋지 않게 나왔는데, 바꿀 수 있나요?',
        a: '사주는 변하지 않는 타고난 기질과 흐름을 보여줍니다. 하지만 운명은 정해진 것이 아닙니다. 사주는 가능성과 경향성을 나타내는 것이며, 실제 삶은 개인의 선택과 노력에 따라 얼마든지 달라질 수 있습니다. 사주를 자기 이해와 더 나은 선택을 위한 도구로 활용하시기 바랍니다.',
      },
      {
        q: '사주 분석 결과가 실제와 다른 것 같아요.',
        a: '사주 해석은 일반적인 경향성을 나타내며, 개인의 환경과 경험에 따라 다르게 나타날 수 있습니다. 또한 전체 팔자의 조화와 대운의 흐름을 종합적으로 봐야 정확한 해석이 가능합니다. 보다 정확한 분석을 원하시면 전문 명리학자의 상담을 받아보시는 것을 권장합니다.',
      },
      {
        q: '사주에서 나쁜 신살이 많다고 나왔어요.',
        a: '신살(神煞)은 사주의 보조적인 요소로, 전체적인 맥락에서 해석해야 합니다. 나쁜 신살이 있어도 전체 사주의 균형이 좋고 대운이 좋으면 큰 문제가 되지 않습니다. 반대로 좋은 신살이 많아도 사주가 불균형하면 효과가 제한적입니다. 신살에만 집착하지 마시고 전체적인 흐름을 보시기 바랍니다.',
      },
      {
        q: '대운과 세운은 무엇인가요?',
        a: '대운은 10년 단위로 변하는 큰 운의 흐름이고, 세운은 1년 단위로 변하는 운의 흐름입니다. 사주 팔자는 변하지 않지만, 대운과 세운은 끊임없이 변화하며 인생의 기복을 만듭니다. 좋은 대운기에는 노력이 결실을 맺기 쉽고, 어려운 대운기에는 인내와 준비가 필요합니다.',
      },
    ],
  },
  {
    category: '기능 관련',
    questions: [
      {
        q: '만세력 달력은 어떻게 활용하나요?',
        a: '만세력 달력은 매일의 천간과 지지, 좋은 날과 나쁜 날 등을 확인할 수 있는 기능입니다. 중요한 일을 시작하거나 결정할 때, 이사나 계약 등 큰일을 할 때 길일을 선택하는 데 활용할 수 있습니다. 또한 자신의 일진을 확인하여 하루를 계획하는 데 참고할 수 있습니다.',
      },
      {
        q: '궁합 기능은 어떻게 사용하나요?',
        a: '궁합 기능에서는 두 사람의 사주를 입력하면 천간과 지지의 조화, 용신의 보완 관계 등을 종합적으로 분석하여 궁합을 판단합니다. 연인, 부부, 사업 파트너 등 다양한 관계의 궁합을 확인할 수 있습니다. 다만 궁합이 나쁘다고 해서 관계가 실패하는 것은 아니며, 서로의 다름을 이해하고 존중하는 것이 더 중요합니다.',
      },
      {
        q: '저장 기능은 어떻게 사용하나요?',
        a: '자주 보는 사주나 관심 있는 날짜 등을 저장하여 빠르게 확인할 수 있습니다. 가족이나 친구의 사주를 저장해두면 생일이나 중요한 날에 운세를 확인하기 편리합니다. 저장된 정보는 설정 메뉴에서 관리할 수 있습니다.',
      },
      {
        q: '오늘의 운세는 매일 바뀌나요?',
        a: '네, 오늘의 운세는 매일 자정에 업데이트됩니다. 오늘의 일진과 시운을 기반으로 종합운, 애정운, 금전운, 건강운 등을 분석하여 제공합니다. 아침에 오늘의 운세를 확인하면 하루를 준비하는 데 도움이 됩니다.',
      },
    ],
  },
  {
    category: '기술 지원',
    questions: [
      {
        q: '앱이 실행되지 않거나 오류가 발생해요.',
        a: '먼저 앱을 최신 버전으로 업데이트했는지 확인해주세요. 문제가 계속되면 앱을 완전히 종료한 후 재실행하거나, 기기를 재부팅해보세요. 그래도 해결되지 않으면 support@sajulatte.app으로 문의해주시면 신속히 도와드리겠습니다.',
      },
      {
        q: '푸시 알림이 오지 않아요.',
        a: '기기의 설정에서 사주라떼 앱의 알림 권한이 허용되어 있는지 확인해주세요. iOS의 경우 설정 > 알림 > 사주라떼에서, Android의 경우 설정 > 앱 > 사주라떼 > 알림에서 확인하실 수 있습니다. 앱 내 설정에서도 알림이 켜져 있는지 확인해주세요.',
      },
      {
        q: '계정을 삭제하고 싶어요.',
        a: '앱 내 설정 메뉴에서 계정 관리 > 계정 삭제를 선택하시면 됩니다. 계정을 삭제하면 저장된 모든 정보가 영구적으로 삭제되며 복구할 수 없으니 신중하게 결정해주세요. 도움이 필요하시면 support@sajulatte.app으로 문의해주세요.',
      },
      {
        q: '사주 데이터를 내보낼 수 있나요?',
        a: '현재는 데이터 내보내기 기능이 제공되지 않지만, 향후 업데이트에서 추가될 예정입니다. 사주 결과 화면을 스크린샷으로 저장하시거나, 필요한 정보를 메모해두시는 것을 권장합니다.',
      },
    ],
  },
  {
    category: '명리학 지식',
    questions: [
      {
        q: '사주명리학은 과학적으로 검증되었나요?',
        a: '사주명리학은 수천 년간의 통계적 경험과 철학적 사유를 바탕으로 한 전통 학문입니다. 현대 과학의 방법론으로 완전히 검증된 것은 아니지만, 많은 사람들이 자기 이해와 삶의 방향 설정에 유용한 도구로 활용하고 있습니다. 절대적인 믿음보다는 참고와 성찰의 도구로 접근하시기 바랍니다.',
      },
      {
        q: '양력과 음력 중 어떤 것으로 사주를 봐야 하나요?',
        a: '사주는 음양력이 아닌 절기력(24절기)을 기준으로 합니다. 절기력은 태양의 움직임을 기준으로 하는 달력으로, 양력에 가깝지만 정확히 같지는 않습니다. 사주라떼는 입력된 양력 생일을 자동으로 절기력으로 변환하여 정확한 사주를 산출합니다.',
      },
      {
        q: '쌍둥이는 사주가 같은데 왜 운명이 다른가요?',
        a: '쌍둥이라도 태어난 시각이 다르면 시주가 달라 사주가 완전히 같지 않을 수 있습니다. 같은 사주라도 성별, 태어난 지역, 성장 환경, 부모의 사주, 그리고 개인의 선택과 노력에 따라 인생이 달라질 수 있습니다. 사주는 가능성을 보여주는 것이지 확정된 미래가 아닙니다.',
      },
      {
        q: '사주를 개명으로 바꿀 수 있나요?',
        a: '사주 자체는 태어난 시간에 의해 결정되므로 개명으로 바꿀 수 없습니다. 하지만 이름은 평생 사용하며 자신을 표현하는 수단이므로, 좋은 이름으로 개명하면 긍정적인 영향을 미칠 수 있다고 봅니다. 개명을 고려하신다면 전문가와 상담하시기 바랍니다.',
      },
    ],
  },
];

export default function FAQScreen() {
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);
  const isWeb = Platform.OS === 'web';

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setExpandedIndex(expandedIndex === key ? null : key);
  };

  const content = (
    <View className="flex-1">
      {/* Header */}
      <View className="mb-8 rounded-2xl bg-gradient-to-b from-amber-50 to-white p-8">
        <Text className="mb-3 text-4xl font-bold text-gray-900">자주 묻는 질문</Text>
        <Text className="text-lg leading-relaxed text-gray-600">
          사용자분들이 자주 문의하시는 내용을 모았습니다.{'\n'}
          찾으시는 답변이 없다면 support@sajulatte.app으로 문의해주세요.
        </Text>
      </View>

      {/* FAQ Categories */}
      <View className="gap-8">
        {faqData.map((category, categoryIndex) => (
          <View key={categoryIndex}>
            <View className="mb-4 flex-row items-center">
              <View className="mr-2 h-6 w-1 rounded-full bg-amber-600" />
              <Text className="text-xl font-bold text-gray-900">{category.category}</Text>
            </View>

            <View className="gap-3">
              {category.questions.map((item, questionIndex) => {
                const key = `${categoryIndex}-${questionIndex}`;
                const isExpanded = expandedIndex === key;

                return (
                  <Pressable
                    key={questionIndex}
                    onPress={() => toggleQuestion(categoryIndex, questionIndex)}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <View className="flex-row items-center justify-between bg-gray-50 p-4">
                      <Text className="flex-1 pr-3 font-semibold text-gray-900">Q. {item.q}</Text>
                      <Text className="text-xl text-amber-600">{isExpanded ? '−' : '+'}</Text>
                    </View>

                    {isExpanded && (
                      <View className="border-t border-gray-100 bg-white p-4">
                        <Text className="leading-6 text-gray-700">
                          <Text className="font-semibold text-amber-600">A. </Text>
                          {item.a}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </View>

      {/* Contact CTA */}
      <View className="mt-12 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 p-8">
        <Text className="mb-2 text-2xl font-bold text-white">더 궁금한 점이 있으신가요?</Text>
        <Text className="mb-4 text-lg leading-7 text-amber-50">
          FAQ에서 답을 찾지 못하셨다면 언제든 문의해주세요.{'\n'}
          빠르고 정확하게 답변해드리겠습니다.
        </Text>
        <View className="rounded-lg bg-white/20 p-4">
          <Text className="text-lg font-semibold text-white">📧 support@sajulatte.app</Text>
        </View>
      </View>
    </View>
  );

  return isWeb ? (
    <FullWidthWebLayout>
      <WebSEO
        title="자주 묻는 질문 - 사주라떼"
        description="사주라떼 이용 중 궁금한 점을 빠르게 해결하세요. 서비스 이용, 사주 해석, 기술 지원 등 다양한 질문에 대한 답변을 제공합니다."
      />
      {content}
    </FullWidthWebLayout>
  ) : (
    <ScrollView className="flex-1 bg-white p-6">
      <WebSEO
        title="자주 묻는 질문 - 사주라떼"
        description="사주라떼 이용 중 궁금한 점을 빠르게 해결하세요. 서비스 이용, 사주 해석, 기술 지원 등 다양한 질문에 대한 답변을 제공합니다."
      />
      {content}
    </ScrollView>
  );
}
