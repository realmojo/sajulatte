export interface Celebrity {
  id: string;
  name: string;
  group?: string; // e.g. "BTS", "NewJeans"
  job: string; // e.g. "Singer", "Actor"
  gender: 'male' | 'female';
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour?: string; // HH:mm if known
  imageUrl?: string; // Placeholder for future
}

export const CELEBS: Celebrity[] = [
  {
    id: 'iu',
    name: '아이유',
    job: '가수/배우',
    gender: 'female',
    birthYear: '1993',
    birthMonth: '05',
    birthDay: '16',
  },
  {
    id: 'eunwoo',
    name: '차은우',
    group: 'ASTRO',
    job: '가수/배우',
    gender: 'male',
    birthYear: '1997',
    birthMonth: '03',
    birthDay: '30',
  },
  {
    id: 'karina',
    name: '카리나',
    group: 'aespa',
    job: '가수',
    gender: 'female',
    birthYear: '2000',
    birthMonth: '04',
    birthDay: '11',
  },
  {
    id: 'jungkook',
    name: '정국',
    group: 'BTS',
    job: '가수',
    gender: 'male',
    birthYear: '1997',
    birthMonth: '09',
    birthDay: '01',
  },
  {
    id: 'wonyoung',
    name: '장원영',
    group: 'IVE',
    job: '가수',
    gender: 'female',
    birthYear: '2004',
    birthMonth: '08',
    birthDay: '31',
  },
  {
    id: 'son',
    name: '손흥민',
    job: '축구선수',
    gender: 'male',
    birthYear: '1992',
    birthMonth: '07',
    birthDay: '08',
  },
  {
    id: 'winter',
    name: '윈터',
    group: 'aespa',
    job: '가수',
    gender: 'female',
    birthYear: '2001',
    birthMonth: '01',
    birthDay: '01',
  },
  {
    id: 'v',
    name: '뷔',
    group: 'BTS',
    job: '가수',
    gender: 'male',
    birthYear: '1995',
    birthMonth: '12',
    birthDay: '30',
  },
  {
    id: 'suzume',
    name: '스즈메',
    job: '애니메이션 캐릭터',
    gender: 'female',
    birthYear: '2006',
    birthMonth: '05',
    birthDay: '24',
  },
];
