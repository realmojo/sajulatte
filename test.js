const { Solar } = require('lunar-javascript');
const { calculateSidu, getMyEightSaju } = require('./lib/utils/he');
//const {Solar, Lunar, HolidayUtil} = require('lunar-javascript')

let solar = Solar.fromYmdHms(1988, 7, 14, 5, 45, 0);
let eightSaju = getMyEightSaju(1988, 7, 14, 5, 45);
console.log(eightSaju);
// dayStem 일간 (예: "갑", "기" 등)
// 일주 첫번째 글자 추출 (일주: 甲, 乙, 丙, 丁, 戊, 己, 庚, 辛, 壬, 癸)
// 2. 음력 객체로 변환
// const lunar = solar.getLunar();

// // 3. 팔자(EightChar) 객체 가져오기
// const eightChar = lunar.getEightChar();

// // 4. 일주(Day Pillar)의 천간(Gan) 가져오기
// const dayGan = eightChar.getDayGan();

// console.log('일주 전체:', eightChar.getDay()); // 출력: 庚午 (경오)
// console.log('일간(첫 글자):', dayGan); // 출력: 庚 (경)

// // console.log(dayStem);
// // console.log(solar.getLunar());
// let si = calculateSidu(dayGan, solar.getLunar().getHour(), solar.getLunar().getMinute());
// console.log(si);
// // let solar = Solar.fromYmdHms(1988, 11, 15, 12, 53, 0);
console.log(solar.toFullString());
console.log(solar.getLunar().toFullString());
// console.log(solar.getLunar().getYearShengXiao());

// 龙: 용;
// 猪: 돼지;
// 虎: 호랑이;
// 兔: 토끼;
// 龙: 용;
// 蛇: 뱀;
// 马: 말;
// 羊: 양;
// 猴: 원숭이;
// 鸡: 닭;
// 狗: 개;
// 猪: 돼지;

// 一九八八年十月初七
// 戊辰(龙)年
// 癸亥(猪)月
// 甲戌(狗)日
// 午(马)时

// 纳音[大林木 大海水 山头火 路旁土] 星期二 北方玄武 星宿[室火猪](吉) 彭祖百忌[甲不开仓财物耗散 戌不吃犬作怪上床]喜神方位[艮](东北) 阳贵神方位[坤](西南) 阴贵神方位[艮](东北) 福神方位[坎](正北) 财神方位[艮](东北) 冲[(戊辰)龙]煞[北]

// 一九八八年六月初一 戊辰(龙)年 己未(羊)月 庚午(马)日 卯(兔)时 纳音[大林木 天上火 路旁土 城头土] 星期四 东方青龙 星宿[角木蛟](吉) 彭祖百忌[庚不经络织机虚张 午不苫盖屋主更张] 喜神方位[乾](西北) 阳贵神方位[离](正南) 阴贵神方位[艮](东北) 福神方位[坤](西南) 财神方位[震](正东) 冲[(甲子)鼠] 煞[北]
