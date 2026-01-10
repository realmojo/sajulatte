import React from 'react';
import Svg, {
  Rect,
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Pattern,
  G,
  Text as SvgText,
} from 'react-native-svg';
import { View, Text } from 'react-native';

export type AmuletType =
  | 'wealth'
  | 'love'
  | 'health'
  | 'success'
  | 'safety'
  | 'business'
  | 'peace'
  | 'promotion'
  | 'jackpot'
  | 'harmony';

interface AmuletProps {
  type: AmuletType;
  width?: number;
  height?: number;
}

// Pseudo-Calligraphy Paths (Simulating Traditional Bujuk Strokes)
// These are abstract, jagged lines to mimic Cinnabar brush strokes.
const GLYPHS: Record<AmuletType, string> = {
  wealth:
    'M80 50 Q120 40 140 70 T100 120 T60 160 M90 80 L110 80 M100 80 V150 M70 140 Q100 180 130 140 M80 200 Q100 220 120 200', // Coin/Money flow
  love: 'M70 60 Q100 30 130 60 Q150 90 100 160 Q50 90 70 60 M100 100 L100 180 M80 140 L120 140 M90 200 L110 200', // Connected hearts/Union
  health:
    'M100 40 L100 220 M70 80 L130 80 M80 120 L120 120 M70 160 L130 160 M90 200 L110 220 L90 240', // Bamboo/Spine stability
  success: 'M80 220 L100 40 L120 220 M70 180 H130 M100 40 L130 70 M100 40 L70 70', // Upward Arrow/Peak
  safety: 'M70 60 H130 V200 H70 Z M80 70 V190 M120 70 V190 M70 130 H130', // Shield/Gate
  business: 'M70 200 L70 100 L130 100 L130 200 M60 220 H140 M100 100 V60 M80 80 H120', // Building/Foundation
  peace: 'M70 80 Q100 40 130 80 T100 160 M70 180 Q100 220 130 180 M60 130 H140', // Cloud/Mist
  promotion: 'M100 220 V60 M70 90 L100 60 L130 90 M80 120 L100 100 L120 120', // Climbing ladder
  jackpot: 'M100 130 L70 80 L130 80 Z M100 130 L130 180 L70 180 Z M100 40 V80 M100 180 V220', // Star/Burst
  harmony:
    'M60 130 A40 40 0 1 1 140 130 A40 40 0 1 1 60 130 M70 130 H130 M100 100 V160 M60 60 L80 80 M140 60 L120 80 M60 200 L80 180 M140 200 L120 180', // Circle/Unity
};

// Traditional Hanja for Titles (Simulated/Mapped)
const HANJA_TITLE: Record<AmuletType, string> = {
  wealth: '富',
  love: '愛',
  health: '壽',
  success: '格',
  safety: '護',
  business: '商',
  peace: '安',
  promotion: '昇',
  jackpot: '金',
  harmony: '和',
};

const AMULET_CONFIG: Record<AmuletType, { label: string; sub: string }> = {
  wealth: { label: '만사형통', sub: '소원성취 재물만족' },
  love: { label: '천생연분', sub: '애정충만 인연도래' },
  health: { label: '무병장수', sub: '건강회복 심신안녕' },
  success: { label: '합격기원', sub: '학업성취 시험합격' },
  safety: { label: '액운타파', sub: '삼재소멸 재수대통' },
  business: { label: '사업번창', sub: '영업대길 재수형통' },
  peace: { label: '심신안정', sub: '마음평안 근심소멸' },
  promotion: { label: '승승장구', sub: '관운형통 입신양명' },
  jackpot: { label: '일확천금', sub: '횡재도래 복권당첨' },
  harmony: { label: '인화단결', sub: '가정화목 대인원만' },
};

export const DigitalAmulet = ({ type, width = 200, height = 300 }: AmuletProps) => {
  const config = AMULET_CONFIG[type];
  const glyph = GLYPHS[type];
  const hanja = HANJA_TITLE[type];

  // Authentic Colors
  const PAPER_COLOR_START = '#fceabb'; // Light yellow paper
  const PAPER_COLOR_END = '#f8b500'; // Darker aged paper
  const INK_COLOR = '#b91c1c'; // Deep Cinnabar Red (Paint-like)
  const STAMP_COLOR = '#991b1b';

  return (
    <View className="items-center bg-white shadow-md" style={{ width, height }}>
      <Svg width="100%" height="100%" viewBox="0 0 200 300">
        <Defs>
          <LinearGradient id="paperGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={PAPER_COLOR_START} />
            <Stop offset="0.5" stopColor="#f6d365" />
            <Stop offset="1" stopColor={PAPER_COLOR_END} />
          </LinearGradient>
          <Pattern id="texture" width="4" height="4" patternUnits="userSpaceOnUse">
            <Circle cx="1" cy="1" r="1" fill="#000" opacity="0.05" />
          </Pattern>
        </Defs>

        {/* 1. Paper Background with Texture */}
        <Rect x="0" y="0" width="200" height="300" fill="url(#paperGrad)" />
        <Rect x="0" y="0" width="200" height="300" fill="url(#texture)" />

        {/* 2. Traditional Border (Double Line) */}
        <Rect
          x="10"
          y="10"
          width="180"
          height="280"
          fill="none"
          stroke={INK_COLOR}
          strokeWidth="3"
        />
        <Rect
          x="16"
          y="16"
          width="168"
          height="268"
          fill="none"
          stroke={INK_COLOR}
          strokeWidth="1"
        />

        {/* 3. Top Heading (Hanja) within a Header Box */}
        <G x="100" y="50">
          <Rect
            x="-30"
            y="-20"
            width="60"
            height="40"
            fill="none"
            stroke={INK_COLOR}
            strokeWidth="2"
          />
          <SvgText
            fill={INK_COLOR}
            stroke={INK_COLOR}
            strokeWidth="1"
            fontSize="32"
            x="0"
            y="10"
            textAnchor="middle">
            {hanja}
          </SvgText>
        </G>

        {/* 4. Main Glyph (The "Charm" Drawing) - Simulated Brush Strokes */}
        {/* We use strokeLinecap="round" and strokeLinejoin="round" for a smoother ink feel */}
        <G transform="translate(0, 10)">
          <Path
            d={glyph}
            stroke={INK_COLOR}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
          />
          {/* Overlay slightly offset for "wet ink" effect or depth */}
          <Path
            d={glyph}
            stroke="#7f1d1d"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.5}
          />
        </G>

        {/* 5. Decorative Swirls / "Ghost" characters in background */}
        <Path
          d="M20 20 Q50 50 20 80"
          stroke={INK_COLOR}
          strokeWidth="1"
          fill="none"
          opacity={0.3}
        />
        <Path
          d="M180 20 Q150 50 180 80"
          stroke={INK_COLOR}
          strokeWidth="1"
          fill="none"
          opacity={0.3}
        />
        <Path
          d="M20 280 Q50 250 20 220"
          stroke={INK_COLOR}
          strokeWidth="1"
          fill="none"
          opacity={0.3}
        />
        <Path
          d="M180 280 Q150 250 180 220"
          stroke={INK_COLOR}
          strokeWidth="1"
          fill="none"
          opacity={0.3}
        />

        {/* 6. Vertical Side Text (The "Command") - Left and Right */}
        <SvgText
          x="30"
          y="150"
          stroke={INK_COLOR}
          fill={INK_COLOR}
          fontSize="14"
          textAnchor="middle"
          transform="rotate(0, 30, 150)">
          {config.label.slice(0, 2)}
        </SvgText>
        <SvgText
          x="30"
          y="170"
          stroke={INK_COLOR}
          fill={INK_COLOR}
          fontSize="14"
          textAnchor="middle"
          transform="rotate(0, 30, 170)">
          {config.label.slice(2, 4)}
        </SvgText>

        <SvgText
          x="170"
          y="150"
          stroke={INK_COLOR}
          fill={INK_COLOR}
          fontSize="14"
          textAnchor="middle">
          칙
        </SvgText>
        <SvgText
          x="170"
          y="170"
          stroke={INK_COLOR}
          fill={INK_COLOR}
          fontSize="14"
          textAnchor="middle">
          령
        </SvgText>

        {/* 7. Bottom Seal (Square Stamp) */}
        <G x="100" y="240">
          <Rect
            x="-25"
            y="-25"
            width="50"
            height="50"
            fill="none"
            stroke={STAMP_COLOR}
            strokeWidth="2"
          />
          <Rect x="-22" y="-22" width="44" height="44" fill={STAMP_COLOR} opacity={0.1} />
          <SvgText
            x="0"
            y="5"
            fill={STAMP_COLOR}
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle">
            사주
          </SvgText>
          <SvgText
            x="0"
            y="20"
            fill={STAMP_COLOR}
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle">
            라떼
          </SvgText>
        </G>

        {/* 8. Subtitle (Korean) */}
        <SvgText x="100" y="279" fill={INK_COLOR} fontSize="12" textAnchor="middle">
          {config.sub}
        </SvgText>
      </Svg>
    </View>
  );
};
