export interface StoryItem {
  id: string;
  category: string;
  title: string;
  desc: string;
  content: string;
  color: string;
  textColor: string;
  date: string;
}
import { STORY_101 } from './stories/1_basics/101';
import { STORY_102 } from './stories/1_basics/102';
import { STORY_103 } from './stories/1_basics/103';
import { STORY_104 } from './stories/1_basics/104';
import { STORY_105 } from './stories/1_basics/105';
import { STORY_106 } from './stories/1_basics/106';
import { STORY_107 } from './stories/1_basics/107';
import { STORY_108 } from './stories/1_basics/108';
import { STORY_109 } from './stories/1_basics/109';
import { STORY_110 } from './stories/1_basics/110';

import { STORY_201 } from './stories/2_fengshui/201';
import { STORY_202 } from './stories/2_fengshui/202';
import { STORY_203 } from './stories/2_fengshui/203';
import { STORY_204 } from './stories/2_fengshui/204';
import { STORY_205 } from './stories/2_fengshui/205';
import { STORY_206 } from './stories/2_fengshui/206';
import { STORY_207 } from './stories/2_fengshui/207';
import { STORY_208 } from './stories/2_fengshui/208';
import { STORY_209 } from './stories/2_fengshui/209';
import { STORY_210 } from './stories/2_fengshui/210';

import { STORY_301 } from './stories/3_love/301';
import { STORY_302 } from './stories/3_love/302';
import { STORY_303 } from './stories/3_love/303';
import { STORY_304 } from './stories/3_love/304';
import { STORY_305 } from './stories/3_love/305';
import { STORY_306 } from './stories/3_love/306';
import { STORY_307 } from './stories/3_love/307';
import { STORY_308 } from './stories/3_love/308';
import { STORY_309 } from './stories/3_love/309';
import { STORY_310 } from './stories/3_love/310';

import { STORY_401 } from './stories/4_season/401';
import { STORY_402 } from './stories/4_season/402';
import { STORY_403 } from './stories/4_season/403';
import { STORY_404 } from './stories/4_season/404';
import { STORY_405 } from './stories/4_season/405';
import { STORY_406 } from './stories/4_season/406';
import { STORY_407 } from './stories/4_season/407';
import { STORY_408 } from './stories/4_season/408';
import { STORY_409 } from './stories/4_season/409';
import { STORY_410 } from './stories/4_season/410';

import { STORY_501 } from './stories/5_zodiac/501';
import { STORY_502 } from './stories/5_zodiac/502';
import { STORY_503 } from './stories/5_zodiac/503';
import { STORY_504 } from './stories/5_zodiac/504';
import { STORY_505 } from './stories/5_zodiac/505';
import { STORY_506 } from './stories/5_zodiac/506';
import { STORY_507 } from './stories/5_zodiac/507';
import { STORY_508 } from './stories/5_zodiac/508';
import { STORY_509 } from './stories/5_zodiac/509';
import { STORY_510 } from './stories/5_zodiac/510';

export const STORY_DATA: Record<string, StoryItem> = {
  // --- 사주 기초 (Saju Basics) ---
  '101': {
    id: '101',
    category: '사주 기초',
    title: "나의 작은 우주, '일간'이란?",
    desc: '내 사주의 주인공인 일간에 대해 알아봅니다. 일간이 나에게 미치는 영향은 무엇일까요?',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    date: '2025.12.15',
    content: STORY_101,
  },
  '102': {
    id: '102',
    category: '사주 기초',
    title: "사주에 '물'이 많으면 어떤 성격일까?",
    desc: '오행 중 수(水) 기운이 발달한 사람들의 특징. 지혜롭지만 속을 알 수 없는 그들의 매력.',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    date: '2025.12.16',
    content: STORY_102,
  },
  '103': {
    id: '103',
    category: '사주 기초',
    title: '역마살, 정말 나쁜 걸까요?',
    desc: '이동과 변화의 아이콘 역마살. 현대 사회에서는 글로벌 인재의 필수 조건이 되었습니다.',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    date: '2025.12.17',
    content: STORY_103,
  },
  '104': {
    id: '104',
    category: '사주 기초',
    title: '사주 팔자, 바꿀 수 있나요?',
    desc: '운명은 정해진 것일까, 개척하는 것일까? 사주를 대하는 올바른 마음가짐.',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    date: '2025.12.18',
    content: STORY_104,
  },
  '105': {
    id: '105',
    category: '사주 기초',
    title: '천간과 지지, 하늘과 땅의 조화',
    desc: '사주를 구성하는 두 축, 천간(정신)과 지지(현실)의 관계를 쉽게 풀어드립니다.',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    date: '2025.12.19',
    content: STORY_105,
  },
  '106': {
    id: '106',
    category: '사주 기초',
    title: '음양오행설의 기초',
    desc: '목화토금수, 세상 만물을 이루는 다섯 가지 에너지의 상생과 상극.',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    date: '2025.12.20',
    content: STORY_106,
  },
  '107': {
    id: '107',
    category: '사주 기초',
    title: '나에게 필요한 용신(用神) 찾기',
    desc: '내 사주의 균형을 잡아주는 수호신, 용신이란 무엇일까요?',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    date: '2025.12.21',
    content: STORY_107,
  },
  '108': {
    id: '108',
    category: '사주 기초',
    title: '대운: 10년마다 바뀌는 인생의 계절',
    desc: '대운은 큰 행운이 아니라 10년 단위의 운의 흐름을 말합니다.',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    date: '2025.12.22',
    content: STORY_108,
  },
  '109': {
    id: '109',
    category: '사주 기초',
    title: '삼재(三災), 무조건 피해야 할까?',
    desc: '9년마다 돌아오는 3가지 재난. 누구나 겪지만 누구나 망하지는 않습니다.',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    date: '2025.12.23',
    content: STORY_109,
  },
  '110': {
    id: '110',
    category: '사주 기초',
    title: '나의 띠 궁합, 믿어도 될까?',
    desc: '띠만 보고 판단하는 궁합의 함정. 겉궁합과 속궁합의 차이.',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    date: '2025.12.24',
    content: STORY_110,
  },

  // --- 생활 풍수 (Living Feng Shui) ---
  '201': {
    id: '201',
    category: '생활 풍수',
    title: '재물운을 부르는 지갑 정리법',
    desc: '돈이 들어오는 지갑은 무엇이 다를까요? 지금 바로 따라할 수 있는 지갑 풍수 꿀팁.',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    date: '2025.12.14',
    content: STORY_201,
  },
  '202': {
    id: '202',
    category: '생활 풍수',
    title: '현관에 두면 좋은 물건 vs 나쁜 물건',
    desc: '집안의 운기를 결정하는 현관 풍수. 거울 위치 하나로 복이 달아날 수 있습니다.',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    date: '2025.12.15',
    content: STORY_202,
  },
  '203': {
    id: '203',
    category: '생활 풍수',
    title: '침대 머리 방향, 어디가 좋을까?',
    desc: '잠만 잘 자도 운이 좋아집니다. 회두극좌와 나에게 맞는 방위 찾기.',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    date: '2025.12.16',
    content: STORY_203,
  },
  '204': {
    id: '204',
    category: '생활 풍수',
    title: '죽은 식물은 바로 치우세요',
    desc: '드라이플라워나 시든 화분이 집에 있다면 당장 정리해야 하는 이유.',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    date: '2025.12.17',
    content: STORY_204,
  },
  '205': {
    id: '205',
    category: '생활 풍수',
    title: '욕실 문은 꼭 닫아두세요',
    desc: '습기와 나쁜 기운이 나오는 화장실, 간단한 습관으로 건강운 지키기.',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    date: '2025.12.18',
    content: STORY_205,
  },
  '206': {
    id: '206',
    category: '생활 풍수',
    title: '주방의 칼과 가위는 안 보이게',
    desc: '식복(食福)을 관장하는 주방. 날카로운 물건이 나와 있으면 가족 불화가 생깁니다.',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    date: '2025.12.19',
    content: STORY_206,
  },
  '207': {
    id: '207',
    category: '생활 풍수',
    title: '거실에는 가족사진을',
    desc: '가화만사성. 화목한 기운을 만드는 거실 액자 풍수.',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    date: '2025.12.20',
    content: STORY_207,
  },
  '208': {
    id: '208',
    category: '생활 풍수',
    title: '전자레인지와 냉장고는 떨어뜨려라',
    desc: '불과 물의 상극. 주방 가전 배치로 보는 건강 풍수.',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    date: '2025.12.21',
    content: STORY_208,
  },
  '209': {
    id: '209',
    category: '생활 풍수',
    title: '돈을 부르는 그림: 해바라기와 사과',
    desc: '금전운을 올려주는 대표적인 인테리어 소품 그림들.',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    date: '2025.12.22',
    content: STORY_209,
  },
  '210': {
    id: '210',
    category: '생활 풍수',
    title: '깨진 물건 짝 잃은 물건 정리하기',
    desc: '버려야 채워집니다. 집안의 운기를 막는 고장 난 물건들.',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    date: '2025.12.23',
    content: STORY_210,
  },

  // --- 연애 사주 (Love Saju) ---
  '301': {
    id: '301',
    category: '연애 사주',
    title: '나의 도화살 지수는?',
    desc: '인기가 많은 사람들의 사주 특징 3가지.',
    color: 'bg-pink-50',
    textColor: 'text-pink-600',
    date: '2025.12.13',
    content: STORY_301,
  },
  '302': {
    id: '302',
    category: '연애 사주',
    title: '홍염살: 도화살보다 치명적인 매력',
    desc: '특정 사람에게만 강력하게 어필하는 홍염살의 특징.',
    color: 'bg-pink-50',
    textColor: 'text-pink-600',
    date: '2025.12.14',
    content: STORY_302,
  },
  '303': {
    id: '303',
    category: '연애 사주',
    title: '나쁜 남자/여자에게만 끌리는 이유',
    desc: '관살혼잡, 무관사주? 내 연애 스타일이 힘든 사주적 원인.',
    color: 'bg-pink-50',
    textColor: 'text-pink-600',
    date: '2025.12.15',
    content: STORY_303,
  },
  '304': {
    id: '304',
    category: '연애 사주',
    title: '연애 세포가 깨어나는 시기 찾기',
    desc: '올해 연애할 수 있을까? 도화운과 합(合)이 들어오는 해.',
    color: 'bg-pink-50',
    textColor: 'text-pink-600',
    date: '2025.12.16',
    content: STORY_304,
  },
  '305': {
    id: '305',
    category: '연애 사주',
    title: '띠동갑 궁합은 무조건 좋다?',
    desc: '4살 차이는 궁합도 안 본다는 말의 진실.',
    color: 'bg-pink-50',
    textColor: 'text-pink-600',
    date: '2025.12.17',
    content: STORY_305,
  },
  '306': {
    id: '306',
    category: '연애 사주',
    title: '배우자 복이 있는 사주 특징',
    desc: '일지 용신, 관인상생. 좋은 배우자를 만나는 사주 구조.',
    color: 'bg-pink-50',
    textColor: 'text-pink-600',
    date: '2025.12.18',
    content: STORY_306,
  },
  '307': {
    id: '307',
    category: '연애 사주',
    title: '연상 vs 연하, 나에게 맞는 짝은?',
    desc: '사주로 보는 나의 연애 상대 스타일.',
    color: 'bg-pink-50',
    textColor: 'text-pink-600',
    date: '2025.12.19',
    content: STORY_307,
  },
  '308': {
    id: '308',
    category: '연애 사주',
    title: '이별수가 있는 해는 언제일까?',
    desc: '충(沖)과 원진살. 싸움과 갈등을 조심해야 하는 시기.',
    color: 'bg-pink-50',
    textColor: 'text-pink-600',
    date: '2025.12.20',
    content: STORY_308,
  },
  '309': {
    id: '309',
    category: '연애 사주',
    title: '화개살: 옛 연인이 돌아온다',
    desc: '재회운과 관련된 화개살. 추억과 예술의 별.',
    color: 'bg-pink-50',
    textColor: 'text-pink-600',
    date: '2025.12.21',
    content: STORY_309,
  },
  '310': {
    id: '310',
    category: '연애 사주',
    title: '결혼하기 좋은 나이가 따로 있나?',
    desc: '적령기보다 중요한 결혼 운의 타이밍.',
    color: 'bg-pink-50',
    textColor: 'text-pink-600',
    date: '2025.12.22',
    content: STORY_310,
  },

  // --- 절기 지혜 (Seasonal Wisdom) ---
  '401': {
    id: '401',
    category: '절기 지혜',
    title: '입춘에 먹으면 좋은 음식',
    desc: '새해의 시작, 입춘에 무엇을 먹어야 한 해의 운이 좋아질까요?',
    color: 'bg-green-50',
    textColor: 'text-green-600',
    date: '2025.02.04',
    content: STORY_401,
  },
  '402': {
    id: '402',
    category: '절기 지혜',
    title: '동지 팥죽, 왜 먹을까요?',
    desc: '작은 설날 동지. 붉은 팥으로 액운을 막는 날.',
    color: 'bg-green-50',
    textColor: 'text-green-600',
    date: '2025.12.22',
    content: STORY_402,
  },
  '403': {
    id: '403',
    category: '절기 지혜',
    title: '경칩: 개구리가 깨어나는 날',
    desc: '새로운 시작을 알리는 경칩에 해야 할 일.',
    color: 'bg-green-50',
    textColor: 'text-green-600',
    date: '2025.12.05',
    content: STORY_403,
  },
  '404': {
    id: '404',
    category: '절기 지혜',
    title: '단오: 창포물에 머리 감기',
    desc: '여름의 시작, 단오. 양기가 가장 왕성한 날의 풍습.',
    color: 'bg-green-50',
    textColor: 'text-green-600',
    date: '2025.06.10',
    content: STORY_404,
  },
  '405': {
    id: '405',
    category: '절기 지혜',
    title: '삼복더위 이기는 보양식',
    desc: '이열치열. 초복, 중복, 말복에 삼계탕을 먹는 사주학적 이유.',
    color: 'bg-green-50',
    textColor: 'text-green-600',
    date: '2025.07.15',
    content: STORY_405,
  },
  '406': {
    id: '406',
    category: '절기 지혜',
    title: '추석(한가위): 감사의 계절',
    desc: '풍요로운 수확의 기쁨. 조상님께 감사하는 마음.',
    color: 'bg-green-50',
    textColor: 'text-green-600',
    date: '2025.09.17',
    content: STORY_406,
  },
  '407': {
    id: '407',
    category: '절기 지혜',
    title: '대설: 겨울의 본격적인 시작',
    desc: '많은 눈은 풍년의 징조. 겨울을 지혜롭게 나는 법.',
    color: 'bg-green-50',
    textColor: 'text-green-600',
    date: '2025.12.07',
    content: STORY_407,
  },
  '408': {
    id: '408',
    category: '절기 지혜',
    title: '하지: 낮이 가장 긴 날',
    desc: '감자를 먹는 날. 양기가 극에 달한 시기의 섭생.',
    color: 'bg-green-50',
    textColor: 'text-green-600',
    date: '2025.06.21',
    content: STORY_408,
  },
  '409': {
    id: '409',
    category: '절기 지혜',
    title: '춘분과 추분: 낮과 밤의 길이가 같은 날',
    desc: '음양의 조화가 완벽한 균형을 이루는 날.',
    color: 'bg-green-50',
    textColor: 'text-green-600',
    date: '2025.12.20',
    content: STORY_409,
  },
  '410': {
    id: '410',
    category: '절기 지혜',
    title: '소한이 대한보다 춥다?',
    desc: '한국의 재미있는 절기 속담. 가장 추운 때를 이기는 법.',
    color: 'bg-green-50',
    textColor: 'text-green-600',
    date: '2026.12.06',
    content: STORY_410,
  },

  // --- 12지신 (Zodiac Stories) ---
  '501': {
    id: '501',
    category: '12지신',
    title: '쥐띠: 부지런한 저축왕',
    desc: '작지만 영리한 쥐띠의 생존 전략과 성격.',
    color: 'bg-orange-50',
    textColor: 'text-orange-600',
    date: '2026.12.01',
    content: STORY_501,
  },
  '502': {
    id: '502',
    category: '12지신',
    title: '소띠: 우직한 성공의 아이콘',
    desc: '느리지만 멈추지 않는 소띠의 뚝심.',
    color: 'bg-orange-50',
    textColor: 'text-orange-600',
    date: '2026.12.02',
    content: STORY_502,
  },
  '503': {
    id: '503',
    category: '12지신',
    title: '호랑이띠 성격의 비밀',
    desc: '용맹하지만 여린 호랑이띠의 속마음.',
    color: 'bg-orange-50',
    textColor: 'text-orange-600',
    date: '2026.12.20',
    content: STORY_503,
  },
  '504': {
    id: '504',
    category: '12지신',
    title: '토끼띠: 상냥한 평화주의자',
    desc: '재치 있고 감수성이 풍부한 토끼띠의 매력.',
    color: 'bg-orange-50',
    textColor: 'text-orange-600',
    date: '2026.12.04',
    content: STORY_504,
  },
  '505': {
    id: '505',
    category: '12지신',
    title: '용띠: 꿈을 꾸는 로맨티스트',
    desc: '비현실적인 이상주의자? 용띠의 스케일.',
    color: 'bg-orange-50',
    textColor: 'text-orange-600',
    date: '2026.12.05',
    content: STORY_505,
  },
  '506': {
    id: '506',
    category: '12지신',
    title: '뱀띠: 차가운 지성, 뜨거운 열정',
    desc: '매력적이고 완벽주의적인 뱀띠의 성향.',
    color: 'bg-orange-50',
    textColor: 'text-orange-600',
    date: '2026.12.06',
    content: STORY_506,
  },
  '507': {
    id: '507',
    category: '12지신',
    title: '말띠: 자유로운 영혼의 질주',
    desc: '역동적이고 개방적인 말띠의 에너지.',
    color: 'bg-orange-50',
    textColor: 'text-orange-600',
    date: '2026.12.07',
    content: STORY_507,
  },
  '508': {
    id: '508',
    category: '12지신',
    title: '양띠: 따뜻한 배려의 아이콘',
    desc: '순수하고 인정 많은 양띠. 하지만 똥고집?',
    color: 'bg-orange-50',
    textColor: 'text-orange-600',
    date: '2026.12.08',
    content: STORY_508,
  },
  '509': {
    id: '509',
    category: '12지신',
    title: '원숭이띠: 재주 많은 만능 재주꾼',
    desc: '임기응변의 달인. 도전을 즐기는 원숭이띠.',
    color: 'bg-orange-50',
    textColor: 'text-orange-600',
    date: '2026.12.09',
    content: STORY_509,
  },
  '510': {
    id: '510',
    category: '12지신',
    title: '닭띠: 예리한 직관과 선견지명',
    desc: '부지런하고 꼼꼼한 닭띠의 완벽주의.',
    color: 'bg-orange-50',
    textColor: 'text-orange-600',
    date: '2026.12.10',
    content: STORY_510,
  },
};
