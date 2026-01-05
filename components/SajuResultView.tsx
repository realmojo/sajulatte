import * as React from 'react';
import { Circle, CircleHelp, CircleX } from 'lucide-react-native';
import Svg, {
  Circle as SvgCircle,
  ClipPath,
  Defs,
  G,
  Line,
  Marker,
  Path,
  Rect,
  Text as SvgText,
} from 'react-native-svg';
import { Modal, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { getMonthList, getMyEightSaju, getYearList } from '@/lib/utils/latte';

interface SajuResultProps {
  name: string;
  year: number; // YYYY
  month: number;
  day: number;
  hour?: number; // 0-23
  minute?: number;
  gender: 'male' | 'female';
}

export const SajuResultView = ({
  name,
  year,
  month,
  day,
  hour = 0,
  minute = 0,
  gender,
}: SajuResultProps) => {
  // Calculate Saju
  const saju = React.useMemo(() => {
    try {
      return getMyEightSaju(year, month, day, hour, minute, gender);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [year, month, day, hour, minute, gender]);

  const [sewunData, setSewunData] = React.useState<any[]>([]);
  const [selectedAge, setSelectedAge] = React.useState<number | null>(null);
  const [monthData, setMonthData] = React.useState<any[]>([]);
  const [selectedYear, setSelectedYear] = React.useState<number | null>(null);
  const [infoModal, setInfoModal] = React.useState<{ title: string; content: string } | null>(null);

  React.useEffect(() => {
    if (saju && saju.yearList && saju.yearList.length > 0) {
      setSewunData(saju.yearList);
      // 초기 선택된 대운 찾기
      const startYear = saju.yearList[0].year;
      const age = startYear - year + 1;
      setSelectedAge(age);

      // 초기 선택된 세운(연도) 설정 및 월운 데이터 생성
      setSelectedYear(startYear);
      const mList = getMonthList(startYear, saju.meta.ilgan, saju.meta.sajuJiHjs);
      setMonthData(mList);
    }
  }, [saju, year]);

  const handleDaewunPress = (daewunAge: number) => {
    if (!saju) return;
    setSelectedAge(daewunAge);
    // 선택된 대운의 시작 연도 계산
    const startYear = year + daewunAge - 1;
    const newSewun = getYearList(startYear, saju.meta.ilgan, saju.meta.sajuJiHjs);
    setSewunData(newSewun);

    // 대운 변경 시 첫 번째 세운의 월운으로 갱신
    if (newSewun.length > 0) {
      const firstYear = newSewun[0].year;
      setSelectedYear(firstYear);
      const mList = getMonthList(firstYear, saju.meta.ilgan, saju.meta.sajuJiHjs);
      setMonthData(mList);
    }
  };

  const handleYearPress = (targetYear: number) => {
    if (!saju) return;
    setSelectedYear(targetYear);
    const mList = getMonthList(targetYear, saju.meta.ilgan, saju.meta.sajuJiHjs);
    setMonthData(mList);
  };

  const openInfoModal = (type: 'daewun' | 'sewun' | 'wolwun') => {
    const info = {
      daewun: {
        title: '대운 (10년 운)',
        content:
          '10년마다 바뀌는 큰 운의 흐름입니다.\n인생의 큰 계절과 같아서 전체적인 환경과 분위기를 좌우합니다.',
      },
      sewun: {
        title: '세운 (1년 운)',
        content:
          '매년 들어오는 운으로, 그 해의 구체적인 사건이나 상황에 영향을 미칩니다.\n대운이라는 환경 속에서 일어나는 날씨와 같습니다.',
      },
      wolwun: {
        title: '월운 (매월 운)',
        content: '매달 바뀌는 운으로, 세운의 흐름 안에서 구체적인 월별 변화를 보여줍니다.',
      },
    };
    setInfoModal(info[type]);
  };

  if (!saju) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-lg">사주 정보를 계산할 수 없습니다.</Text>
      </View>
    );
  }

  const columns = [saju.hour, saju.day, saju.month, saju.year];

  return (
    <ScrollView contentContainerClassName="p-6 gap-8" className="flex-1 bg-background">
      <View className="gap-2">
        <Text className="mb-2 text-xl font-bold text-foreground">{name}님의 사주명식</Text>
        <View className="gap-2 rounded-lg border border-border bg-card p-4">
          <View className="flex-row items-center gap-2">
            <View className="rounded bg-red-100 px-1.5 py-0.5">
              <Text className="text-xs font-bold text-red-500">양력</Text>
            </View>
            <Text className="text-sm text-foreground">
              {year}년 {month}월 {day}일 {hour.toString().padStart(2, '0')}:
              {minute.toString().padStart(2, '0')} ({gender === 'male' ? '남' : '여'})
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="rounded bg-blue-100 px-1.5 py-0.5">
              <Text className="text-xs font-bold text-blue-500">음력</Text>
            </View>
            <Text className="text-sm text-foreground">{saju.meta.lunar}</Text>
          </View>
          <View className="my-1 h-[1px] bg-border" />
          <Text className="text-sm text-foreground">
            <Text className="font-semibold">일간(본인):</Text> {saju.meta.ilgan}
          </Text>
        </View>
      </View>

      {/* Four Pillars Table */}
      <View className="overflow-hidden rounded-xl border border-gray-300 bg-white">
        {/* Header Row */}
        <View className="flex-row border-b border-gray-200 bg-gray-50">
          <View className="w-12 items-center justify-center p-2" />
          {['생시', '생일', '생월', '생년'].map((title, i) => (
            <View
              key={i}
              className={`flex-1 items-center justify-center p-2 ${
                i > 0 ? 'border-l border-gray-200' : ''
              }`}>
              <Text className="text-sm font-medium text-gray-500">{title}</Text>
            </View>
          ))}
        </View>

        {/* Row 1: 천간 (Gan) */}
        <View className="h-20 flex-row border-b border-gray-200">
          <View className="w-12 items-center justify-center bg-gray-50">
            <Text className="text-xs font-medium text-gray-500">천간</Text>
          </View>
          {columns.map((pillar, i) => (
            <View
              key={i}
              className="flex-1 items-center justify-center gap-1 border-l border-gray-200">
              <Text
                className="text-4xl font-bold"
                style={{
                  color: pillar.gan.color,
                  // @ts-ignore
                  textShadowColor: 'rgba(0,0,0,0.1)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                }}>
                {pillar.gan.hanja}
              </Text>
              <View className="absolute bottom-1 right-2">
                <Text className="text-[10px] font-medium text-gray-400">{pillar.gan.korean}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Row 2: 십성 (Sipsin for Gan) */}
        <View className="flex-row border-b border-gray-200 py-2">
          <View className="w-12 items-center justify-center bg-gray-50">
            <Text className="text-xs font-medium text-gray-500">십성</Text>
          </View>
          {columns.map((pillar, i) => (
            <View key={i} className="flex-1 items-center justify-center border-l border-gray-200">
              <Text className="text-xs font-medium" style={{ color: pillar.gan.color }}>
                {pillar.gan.sipsin || '일간'}
              </Text>
            </View>
          ))}
        </View>

        {/* Row 3: 지지 (Ji) */}
        <View className="h-20 flex-row border-b border-gray-200">
          <View className="w-12 items-center justify-center bg-gray-50">
            <Text className="text-xs font-medium text-gray-500">지지</Text>
          </View>
          {columns.map((pillar, i) => (
            <View
              key={i}
              className="flex-1 items-center justify-center gap-1 border-l border-gray-200">
              <Text
                className="text-4xl font-bold"
                style={{
                  color: pillar.ji.color,
                  // @ts-ignore
                  textShadowColor: 'rgba(0,0,0,0.1)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                }}>
                {pillar.ji.hanja}
              </Text>
              <View className="absolute bottom-1 right-2">
                <Text className="text-[10px] font-medium text-gray-400">{pillar.ji.korean}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Row 4: 십성 (Sipsin for Ji) */}
        <View className="flex-row border-b border-gray-200 py-2">
          <View className="w-12 items-center justify-center bg-gray-50">
            <Text className="text-xs font-medium text-gray-500">십성</Text>
          </View>
          {columns.map((pillar, i) => (
            <View key={i} className="flex-1 items-center justify-center border-l border-gray-200">
              <Text className="text-xs font-medium" style={{ color: pillar.ji.color }}>
                {pillar.ji.sipsin || '-'}
              </Text>
            </View>
          ))}
        </View>

        {/* Row 5: 지장간 (Jijangan) */}
        <View className="flex-row border-b border-gray-200 py-2">
          <View className="w-12 items-center justify-center bg-gray-50">
            <Text className="text-xs font-medium text-gray-500">지장간</Text>
          </View>
          {columns.map((pillar, i) => (
            <View key={i} className="flex-1 items-center justify-center border-l border-gray-200">
              <Text className="text-xs font-medium text-gray-600">{pillar.ji.jijangan || '-'}</Text>
            </View>
          ))}
        </View>

        {/* Row 6: 12운성 (12Wunsung) */}
        <View className="flex-row border-b border-gray-200 py-2">
          <View className="w-12 items-center justify-center bg-gray-50">
            <Text className="text-xs font-medium text-gray-500">12운성</Text>
          </View>
          {columns.map((pillar, i) => (
            <View key={i} className="flex-1 items-center justify-center border-l border-gray-200">
              <Text className="text-xs font-medium text-gray-600">{pillar.ji.wunsung || '-'}</Text>
            </View>
          ))}
        </View>

        {/* Row 7: 12신살 (12Shinsal) */}
        <View className="flex-row py-2">
          <View className="w-12 items-center justify-center bg-gray-50">
            <Text className="text-xs font-medium text-gray-500">12신살</Text>
          </View>
          {columns.map((pillar, i) => (
            <View key={i} className="flex-1 items-center justify-center border-l border-gray-200">
              <Text className="text-xs font-medium text-gray-600">{pillar.ji.shinsal || '-'}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Strength Graph */}
      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-semibold text-foreground">신강/신약지수</Text>
          <TouchableOpacity onPress={() => openInfoModal('daewun')}>
            <CircleHelp size={16} color="#A3A3A3" />
          </TouchableOpacity>
        </View>
        <View className="rounded-xl border border-border bg-card p-5">
          {/* Indicators */}
          <View className="mb-4 flex-row gap-4">
            {[
              { label: '득령', value: saju.strength?.flags.deukRyeong, color: '#3B82F6' },
              { label: '득지', value: saju.strength?.flags.deukJi, color: '#EF4444' },
              { label: '득시', value: saju.strength?.flags.deukSi, color: '#EF4444' },
              { label: '득세', value: saju.strength?.flags.deukSe, color: '#3B82F6' },
            ].map((item, i) => (
              <View key={i} className="flex-row items-center gap-1">
                <Text className="text-sm text-gray-600">{item.label}</Text>
                {item.value ? (
                  <Circle size={14} color={item.color} fill={item.color} />
                ) : (
                  <CircleX size={14} color="#EF4444" />
                )}
              </View>
            ))}
          </View>

          <Text className="mb-1 text-base leading-6 text-foreground">
            {name}님은 <Text className="font-bold">{saju.strength?.verdict} 사주</Text>입니다.
          </Text>
          <Text className="mb-6 text-sm text-muted-foreground">
            {saju.strength?.ratio}%의 사람이 여기에 해당합니다.
          </Text>

          {/* Chart */}
          <View className="h-48 w-full flex-row items-end justify-between px-2">
            {['극약', '태약', '신약', '중화\n신약', '중화\n신강', '신강', '태강', '극왕'].map(
              (label, i) => {
                const isMe = saju.strength?.verdict.replace(' ', '') === label.replace('\n', '');
                // Distribution data
                const ratios = [3.2, 8.5, 16.1, 22.2, 22.2, 16.1, 8.5, 3.2];
                const heightPct = (ratios[i] / 25) * 100; // 25 is approx max (22.2)

                return (
                  <View key={i} className="flex-1 items-center gap-2">
                    <View className="w-full flex-1 items-center justify-end">
                      {/* SVG Line would go here ideally, but for now using relative positioning for dots */}
                      {/* Simplified Bar/Point visualization */}
                      <View className="w-full rounded-t-sm bg-gray-100" style={{ height: '100%' }}>
                        {/* Line connector simulation could be done with SVG overlay,
                          but here we just show the structure.
                          To match the image perfectly we need SVG.
                          Let's draw the SVG overlay on top of this container.
                       */}
                      </View>
                    </View>
                    <Text className="text-center text-[10px] text-gray-500">{label}</Text>
                  </View>
                );
              }
            )}

            {/* SVG Overlay for the Line Chart */}
            <View className="absolute left-0 right-0 top-0 h-40" pointerEvents="none">
              <Svg height="100%" width="100%">
                {/* 
                   We need to compute points. 
                   With 8 items, each takes 12.5% width. center is 6.25%, 18.75%...
                */}
                {[3.2, 8.5, 16.1, 22.2, 22.2, 16.1, 8.5, 3.2].map((val, i, arr) => {
                  if (i === arr.length - 1) return null;
                  const x1 = `${(i * 100) / 8 + 100 / 16}%`;
                  const y1 = `${100 - (val / 25) * 80}%`; // Scaling factor
                  const x2 = `${((i + 1) * 100) / 8 + 100 / 16}%`;
                  const y2 = `${100 - (arr[i + 1] / 25) * 80}%`;
                  return (
                    <Line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#525252"
                      strokeWidth="1.5"
                    />
                  );
                })}
                {/* My Point */}
                {[3.2, 8.5, 16.1, 22.2, 22.2, 16.1, 8.5, 3.2].map((val, i) => {
                  const label = [
                    '극약',
                    '태약',
                    '신약',
                    '중화신약',
                    '중화신강',
                    '신강',
                    '태강',
                    '극왕',
                  ][i];
                  const isMe = saju.strength?.verdict === label;
                  if (!isMe) return null;

                  const x = `${(i * 100) / 8 + 100 / 16}%`;
                  const y = `${100 - (val / 25) * 80}%`;

                  return (
                    <React.Fragment key={i}>
                      <SvgCircle cx={x} cy={y} r="5" fill="#4B5563" />
                      <SvgText
                        // @ts-ignore
                        x={x}
                        y={y}
                        dy="20"
                        fontSize="12"
                        fontWeight="bold"
                        fill="#4B5563"
                        textAnchor="middle">
                        나
                      </SvgText>
                    </React.Fragment>
                  );
                })}
              </Svg>
            </View>
          </View>
        </View>
      </View>

      {/* Five Elements Distribution */}
      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-semibold text-foreground">
            나의 오행: {saju.day.gan.korean} ({saju.day.gan.hanja})
          </Text>
        </View>

        <View className="rounded-xl border border-border bg-card p-4">
          {/* Legend */}
          <View className="mb-4 flex-row gap-4">
            <View className="flex-row items-center gap-1">
              <Svg width="20" height="10">
                <Defs>
                  <Marker
                    id="arrowBlue"
                    markerWidth="4"
                    markerHeight="4"
                    refX="2"
                    refY="2"
                    orient="auto">
                    <Path d="M0,0 L0,4 L4,2 z" fill="#3B82F6" />
                  </Marker>
                </Defs>
                <Line
                  x1="0"
                  y1="5"
                  x2="15"
                  y2="5"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  markerEnd="url(#arrowBlue)"
                />
              </Svg>
              <Text className="text-sm text-gray-600">생(生)</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Svg width="20" height="10">
                <Defs>
                  <Marker
                    id="arrowRed"
                    markerWidth="4"
                    markerHeight="4"
                    refX="2"
                    refY="2"
                    orient="auto">
                    <Path d="M0,0 L0,4 L4,2 z" fill="#EF4444" />
                  </Marker>
                </Defs>
                <Line
                  x1="0"
                  y1="5"
                  x2="15"
                  y2="5"
                  stroke="#EF4444"
                  strokeWidth="2"
                  markerEnd="url(#arrowRed)"
                />
              </Svg>
              <Text className="text-sm text-gray-600">극(剋)</Text>
            </View>
          </View>

          {/* Diagram */}
          <View className="h-[320px] w-full items-center justify-center">
            <Svg width="300" height="300" viewBox="0 0 300 300">
              <Defs>
                <Marker
                  id="blueArrow"
                  markerWidth="6"
                  markerHeight="6"
                  refX="5"
                  refY="3"
                  orient="auto">
                  <Path d="M0,0 L0,6 L6,3 z" fill="#3B82F6" />
                </Marker>
                <Marker
                  id="redArrow"
                  markerWidth="6"
                  markerHeight="6"
                  refX="5"
                  refY="3"
                  orient="auto">
                  <Path d="M0,0 L0,6 L6,3 z" fill="#EF4444" />
                </Marker>
              </Defs>

              {(() => {
                const center = { x: 150, y: 150 };
                const radius = 100; // Circle arrangement radius
                const circleRadius = 38; // Individual circle radius

                // 1. Determine My Element Index
                const ilganHanja = saju.meta.ilgan;
                let myElemIndex = 0;
                const GAN_ORDER = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
                const ELEM_ORDER = ['WOOD', 'FIRE', 'EARTH', 'METAL', 'WATER'];
                const ELEM_KR = {
                  WOOD: '목',
                  FIRE: '화',
                  EARTH: '토',
                  METAL: '금',
                  WATER: '수',
                };
                const SIPSIN_NAMES = ['비겁', '식상', '재성', '관성', '인성'];
                const COLORS = {
                  WOOD: '#4ADE80',
                  FIRE: '#F87171',
                  EARTH: '#FACC15',
                  METAL: '#9CA3AF',
                  WATER: '#60A5FA',
                };

                const myIdx = GAN_ORDER.indexOf(ilganHanja);
                const myElemKey = ELEM_ORDER[Math.floor(myIdx / 2)]; // 0: Wood, 1: Fire...
                const shift = ELEM_ORDER.indexOf(myElemKey); // Rotation needed

                const sortedElems = [...ELEM_ORDER.slice(shift), ...ELEM_ORDER.slice(0, shift)];

                // 2. Points
                const points = sortedElems.map((_, i) => {
                  const angle = (-90 + i * 72) * (Math.PI / 180);
                  return {
                    x: center.x + radius * Math.cos(angle),
                    y: center.y + radius * Math.sin(angle),
                  };
                });

                return (
                  <>
                    {/* Arrows Layer */}
                    {points.map((p, i) => {
                      const next = points[(i + 1) % 5]; // Blue Arrow Target
                      const star = points[(i + 2) % 5]; // Red Arrow Target

                      // Shorten line to not overlap circle
                      // Vector math for trimming
                      const trim = circleRadius + 5;
                      const getTrimmedLine = (p1: any, p2: any) => {
                        const dx = p2.x - p1.x;
                        const dy = p2.y - p1.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const ratio = (dist - trim) / dist;
                        const startRatio = trim / dist;
                        return {
                          x1: p1.x + dx * startRatio,
                          y1: p1.y + dy * startRatio,
                          x2: p1.x + dx * ratio,
                          y2: p1.y + dy * ratio,
                        };
                      };

                      const blueL = getTrimmedLine(p, next);
                      const redL = getTrimmedLine(p, star);

                      return (
                        <G key={`arrows-${i}`}>
                          <Line
                            x1={blueL.x1}
                            y1={blueL.y1}
                            x2={blueL.x2}
                            y2={blueL.y2}
                            stroke="#3B82F6"
                            strokeWidth="2"
                            markerEnd="url(#blueArrow)"
                          />
                          <Line
                            x1={redL.x1}
                            y1={redL.y1}
                            x2={redL.x2}
                            y2={redL.y2}
                            stroke="#EF4444"
                            strokeWidth="2"
                            opacity={0.6}
                            markerEnd="url(#redArrow)"
                          />
                        </G>
                      );
                    })}

                    {/* Circles Layer */}
                    {sortedElems.map((elemKey, i) => {
                      const p = points[i];
                      const data = saju.distributions?.[elemKey] || {
                        count: 0,
                        percent: 0,
                      };
                      // @ts-ignore
                      const elemName = ELEM_KR[elemKey];
                      const sipsin = SIPSIN_NAMES[i];
                      // @ts-ignore
                      const color = COLORS[elemKey];

                      // Fill calculation
                      const fillHeight = (data.percent / 100) * (circleRadius * 2);
                      const fillY = p.y + circleRadius - fillHeight;

                      return (
                        <G key={`circle-${i}`}>
                          <Defs>
                            <ClipPath id={`clip-${i}`}>
                              <Rect
                                x={p.x - circleRadius}
                                y={fillY}
                                width={circleRadius * 2}
                                height={fillHeight}
                              />
                            </ClipPath>
                          </Defs>

                          {/* Background Circle */}
                          <SvgCircle
                            cx={p.x}
                            cy={p.y}
                            r={circleRadius}
                            fill="white"
                            stroke="#E5E7EB"
                            strokeWidth="2"
                          />

                          {/* Level Fill */}
                          <SvgCircle
                            cx={p.x}
                            cy={p.y}
                            r={circleRadius}
                            fill={color}
                            opacity={0.5}
                            clipPath={`url(#clip-${i})`}
                          />

                          {/* Text */}
                          <SvgText
                            x={p.x}
                            y={p.y - 5}
                            fontSize="14"
                            fontWeight="bold"
                            fill="#374151"
                            textAnchor="middle">
                            {elemName}({sipsin})
                          </SvgText>
                          <SvgText
                            x={p.x}
                            y={p.y + 15}
                            fontSize="16"
                            fontWeight="bold"
                            fill="#1F2937"
                            textAnchor="middle">
                            {data.percent.toFixed(1)}%
                          </SvgText>
                        </G>
                      );
                    })}
                  </>
                );
              })()}
            </Svg>
          </View>

          {/* Detailed Interpretations */}
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">상세 해석</Text>
            <View className="gap-3 rounded-xl border border-border bg-card p-4">
              {/* NaYin */}
              <View>
                <Text className="mb-2 text-sm font-bold text-gray-700">납음 (소리 오행)</Text>
                <View className="flex-row gap-2">
                  {[
                    { label: '년주', value: saju.details?.nayin.year },
                    { label: '월주', value: saju.details?.nayin.month },
                    { label: '일주', value: saju.details?.nayin.day },
                    { label: '시주', value: saju.details?.nayin.hour },
                  ].map((item, i) => (
                    <View key={i} className="flex-1 items-center gap-1 rounded bg-gray-50 p-2">
                      <Text className="text-xs text-gray-500">{item.label}</Text>
                      <Text
                        className="text-center text-xs font-medium text-gray-800"
                        numberOfLines={2}>
                        {item.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="my-1 h-[1px] bg-border" />

              {/* 28 Xiu & Chong/Sha */}
              <View className="flex-row gap-4">
                <View className="flex-1 gap-1">
                  <Text className="text-sm font-bold text-gray-700">28수 (별자리)</Text>
                  <Text className="text-sm text-gray-600">{saju.details?.xiu}</Text>
                </View>
                <View className="flex-1 gap-1">
                  <Text className="text-sm font-bold text-gray-700">충(沖) / 살(煞)</Text>
                  <View className="gap-1">
                    <Text className="text-xs text-gray-600">
                      <Text className="font-semibold text-red-500">충:</Text> {saju.details?.chong}
                    </Text>
                    <Text className="text-xs text-gray-600">
                      <Text className="font-semibold text-gray-800">살방위:</Text>{' '}
                      {saju.details?.sha}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="my-1 h-[1px] bg-border" />

              {/* PengZu */}
              <View className="gap-1">
                <Text className="text-sm font-bold text-gray-700">팽조백기 (금기사항)</Text>
                <View className="gap-1.5 rounded bg-gray-50 p-3">
                  <Text className="text-xs leading-4 text-gray-600">
                    <Text className="font-semibold text-gray-800">천간:</Text>{' '}
                    {saju.details?.pengzu.gan}
                  </Text>
                  <Text className="text-xs leading-4 text-gray-600">
                    <Text className="font-semibold text-gray-800">지지:</Text>{' '}
                    {saju.details?.pengzu.zhi}
                  </Text>
                </View>
              </View>

              <View className="my-1 h-[1px] bg-border" />

              {/* Positions */}
              <View className="gap-2">
                <Text className="text-sm font-bold text-gray-700">신살 방위 (길신)</Text>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    {
                      label: '희신',
                      value: saju.details?.positions.xi,
                      bg: 'bg-blue-50',
                      text: 'text-blue-700',
                    },
                    {
                      label: '재신',
                      value: saju.details?.positions.cai,
                      bg: 'bg-yellow-50',
                      text: 'text-yellow-700',
                    },
                    {
                      label: '복신',
                      value: saju.details?.positions.fu,
                      bg: 'bg-green-50',
                      text: 'text-green-700',
                    },
                    {
                      label: '양귀인',
                      value: saju.details?.positions.yangGui,
                      bg: 'bg-purple-50',
                      text: 'text-purple-700',
                    },
                    {
                      label: '음귀인',
                      value: saju.details?.positions.yinGui,
                      bg: 'bg-purple-50',
                      text: 'text-purple-700',
                    },
                  ].map((item, i) => (
                    <View key={i} className={`rounded px-2.5 py-1.5 ${item.bg}`}>
                      <Text className={`text-xs font-medium ${item.text}`}>
                        {item.label}: {item.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Daeun List */}
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-semibold text-foreground">대운</Text>
            <TouchableOpacity onPress={() => openInfoModal('daewun')}>
              <CircleHelp size={16} color="#A3A3A3" />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-muted-foreground">대운수: {saju.lifeList.daewunSu}</Text>
            <Text className="text-sm text-muted-foreground">({saju.lifeList.directionText})</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2">
          {saju.lifeList.list.map((item: any, index: number) => {
            const isSelected = selectedAge === item.age;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleDaewunPress(item.age)}
                key={index}
                className={`w-10 items-center gap-1.5 rounded-lg border p-1.5 py-2 ${
                  isSelected ? 'border-primary bg-primary/10' : 'border-border bg-card'
                }`}>
                <Text
                  className={`text-[10px] font-medium ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                  {item.age}
                </Text>

                {/* Gan */}
                <View className="items-center gap-0.5">
                  <Text className="text-[10px] text-muted-foreground">{item.gan.sipsin}</Text>
                  <View
                    className="h-7 w-7 items-center justify-center rounded-full border border-border"
                    style={{ backgroundColor: item.gan.color }}>
                    <Text
                      className="text-base font-bold text-white"
                      style={{
                        textShadowColor: 'rgba(0,0,0,1)',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 2,
                      }}>
                      {item.gan.hanja}
                    </Text>
                  </View>
                </View>

                {/* Ji */}
                <View className="items-center gap-0.5">
                  <View
                    className="h-7 w-7 items-center justify-center rounded-full border border-border"
                    style={{ backgroundColor: item.ji.color }}>
                    <Text
                      className="text-base font-bold text-white"
                      style={{
                        textShadowColor: 'rgba(0,0,0,1)',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 2,
                      }}>
                      {item.ji.hanja}
                    </Text>
                  </View>
                  <Text className="text-[10px] text-muted-foreground">{item.ji.sipsin}</Text>
                  <Text className="text-[10px] font-medium text-muted-foreground">
                    {item.ji.wunsung}
                  </Text>
                  {/* 12 Shin-sal */}
                  {item.ji.shinsal?.map((sal: string, idx: number) => (
                    <Text key={idx} className="text-[10px] text-muted-foreground opacity-80">
                      {sal}
                    </Text>
                  ))}
                </View>

                <Text className="text-center text-[10px] text-muted-foreground" numberOfLines={1}>
                  {item.gan.korean}
                  {item.ji.korean}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Sewun List */}
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-semibold text-foreground">세운 (10년)</Text>
            <TouchableOpacity onPress={() => openInfoModal('sewun')}>
              <CircleHelp size={16} color="#A3A3A3" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2">
          {sewunData.map((item: any, index: number) => {
            const isSelected = selectedYear === item.year;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleYearPress(item.year)}
                key={index}
                className={`w-10 items-center gap-1.5 rounded-lg border p-1.5 py-2 ${
                  isSelected ? 'border-primary bg-primary/10' : 'border-border bg-card'
                }`}>
                <Text
                  className={`text-[10px] font-medium ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                  {item.year}
                </Text>

                {/* Gan */}
                <View className="items-center gap-0.5">
                  <Text className="text-[10px] text-muted-foreground">{item.gan.sipsin}</Text>
                  <View
                    className="h-7 w-7 items-center justify-center rounded-full border border-border"
                    style={{ backgroundColor: item.gan.color }}>
                    <Text
                      className="text-base font-bold text-white"
                      style={{
                        textShadowColor: 'rgba(0,0,0,1)',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 2,
                      }}>
                      {item.gan.hanja}
                    </Text>
                  </View>
                </View>

                {/* Ji */}
                <View className="items-center gap-0.5">
                  <View
                    className="h-7 w-7 items-center justify-center rounded-full border border-border"
                    style={{ backgroundColor: item.ji.color }}>
                    <Text
                      className="text-base font-bold text-white"
                      style={{
                        textShadowColor: 'rgba(0,0,0,1)',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 2,
                      }}>
                      {item.ji.hanja}
                    </Text>
                  </View>
                  <Text className="text-[10px] text-muted-foreground">{item.ji.sipsin}</Text>
                  <Text className="text-[10px] font-medium text-muted-foreground">
                    {item.ji.wunsung}
                  </Text>
                  {/* 12 Shin-sal */}
                  {item.ji.shinsals?.map((sal: string, idx: number) => (
                    <Text key={idx} className="text-[10px] text-muted-foreground opacity-80">
                      {sal}
                    </Text>
                  ))}
                </View>

                <Text className="text-center text-[10px] text-muted-foreground" numberOfLines={1}>
                  {item.gan.korean}
                  {item.ji.korean}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Wolwun List */}
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-semibold text-foreground">월운 (12개월)</Text>
            <TouchableOpacity onPress={() => openInfoModal('wolwun')}>
              <CircleHelp size={16} color="#A3A3A3" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2">
          {monthData.map((item: any, index: number) => (
            <View
              key={index}
              className="w-10 items-center gap-1.5 rounded-lg border border-border bg-card p-1.5 py-2">
              <Text className="text-[10px] font-medium text-muted-foreground">{item.month}월</Text>

              {/* Gan */}
              <View className="items-center gap-0.5">
                <Text className="text-[10px] text-muted-foreground">{item.gan.sipsin}</Text>
                <View
                  className="h-7 w-7 items-center justify-center rounded-full border border-border"
                  style={{ backgroundColor: item.gan.color }}>
                  <Text
                    className="text-base font-bold text-white"
                    style={{
                      textShadowColor: 'rgba(0,0,0,1)',
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 2,
                    }}>
                    {item.gan.hanja}
                  </Text>
                </View>
              </View>

              {/* Ji */}
              <View className="items-center gap-0.5">
                <View
                  className="h-7 w-7 items-center justify-center rounded-full border border-border"
                  style={{ backgroundColor: item.ji.color }}>
                  <Text
                    className="text-base font-bold text-white"
                    style={{
                      textShadowColor: 'rgba(0,0,0,1)',
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 2,
                    }}>
                    {item.ji.hanja}
                  </Text>
                </View>
                <Text className="text-[10px] text-muted-foreground">{item.ji.sipsin}</Text>
                <Text className="text-[10px] font-medium text-muted-foreground">
                  {item.ji.wunsung}
                </Text>
                {/* 12 Shin-sal */}
                {item.ji.shinsals?.map((sal: string, idx: number) => (
                  <Text key={idx} className="text-[10px] text-muted-foreground opacity-80">
                    {sal}
                  </Text>
                ))}
              </View>

              <Text className="text-center text-[10px] text-muted-foreground" numberOfLines={1}>
                {item.gan.korean}
                {item.ji.korean}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <Modal
        visible={!!infoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoModal(null)}>
        <TouchableWithoutFeedback onPress={() => setInfoModal(null)}>
          <View className="flex-1 items-center justify-center bg-black/50 p-6">
            <TouchableWithoutFeedback>
              <View className="w-full max-w-sm gap-4 rounded-xl bg-white p-6 shadow-xl">
                <Text className="text-lg font-bold text-gray-900">{infoModal?.title}</Text>
                <Text className="leading-6 text-gray-600">{infoModal?.content}</Text>
                <TouchableOpacity
                  onPress={() => setInfoModal(null)}
                  className="mt-2 items-center rounded-lg bg-gray-100 py-3">
                  <Text className="font-semibold text-gray-900">확인</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};
