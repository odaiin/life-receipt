"use client";

import { useMemo } from "react";

interface WantedTheme {
  crimes: string[];
  bounty: number;
  danger_level: string;
  criminal_alias: string;
  criminal_portrait: string;
  crime_story: string;
  notorious_actions: string[];
  last_seen: string;
  special_warning: string;
}

interface AnalyzeResponse {
  user_info: {
    year: number;
    month: number;
    day: number;
    gender: string;
    mbti: string;
  };
  saju_analysis: {
    day_master: string;
    day_master_korean: string;
  };
  theme_data?: {
    wanted?: WantedTheme;
  };
}

interface WantedViewProps {
  data: AnalyzeResponse;
}

// 원피스 스타일 캐릭터 초상화
const OnePiecePortrait = ({ type, gender }: { type: string; gender: string }) => {
  const isMale = gender === "male";

  // 스킨 컬러
  const skinColor = "#F5D6BA";
  const skinShadow = "#E5C6AA";
  const outlineColor = "#1a1a1a";

  const portraits: Record<string, JSX.Element> = {
    // INTJ - 냉철한 전략가
    mastermind: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        {/* 배경 */}
        <rect width="200" height="250" fill="#d4c4a8" />
        {/* 목 */}
        <path d="M 80 200 L 80 250 L 120 250 L 120 200" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        {/* 얼굴 윤곽 - 각진 턱 */}
        <path d="M 45 80 Q 40 120 50 160 Q 70 210 100 215 Q 130 210 150 160 Q 160 120 155 80"
              fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        {/* 얼굴 그림자 */}
        <path d="M 130 100 Q 150 140 140 180 Q 120 200 100 210" fill={skinShadow} opacity="0.5" />
        {/* 머리카락 - 올빽 스타일 */}
        <path d="M 35 90 Q 30 40 70 25 Q 100 15 130 25 Q 170 40 165 90 L 155 85 Q 155 50 100 40 Q 50 50 45 85 Z"
              fill="#1a1a1a" stroke={outlineColor} strokeWidth="2" />
        {/* 안경 */}
        <rect x="55" y="95" width="35" height="28" rx="3" fill="none" stroke={outlineColor} strokeWidth="3" />
        <rect x="110" y="95" width="35" height="28" rx="3" fill="none" stroke={outlineColor} strokeWidth="3" />
        <line x1="90" y1="108" x2="110" y2="108" stroke={outlineColor} strokeWidth="3" />
        <line x1="55" y1="108" x2="45" y2="103" stroke={outlineColor} strokeWidth="2" />
        <line x1="145" y1="108" x2="155" y2="103" stroke={outlineColor} strokeWidth="2" />
        {/* 안경 렌즈 반사 */}
        <path d="M 60 100 L 70 100 L 65 105" fill="#ffffff" opacity="0.4" />
        <path d="M 115 100 L 125 100 L 120 105" fill="#ffffff" opacity="0.4" />
        {/* 눈 (안경 뒤로 보이는) */}
        <ellipse cx="72" cy="108" rx="8" ry="5" fill="#1a1a1a" />
        <ellipse cx="128" cy="108" rx="8" ry="5" fill="#1a1a1a" />
        <circle cx="70" cy="107" r="2" fill="#ffffff" />
        <circle cx="126" cy="107" r="2" fill="#ffffff" />
        {/* 날카로운 눈썹 */}
        <path d="M 55 88 L 90 85" stroke={outlineColor} strokeWidth="4" strokeLinecap="round" />
        <path d="M 145 88 L 110 85" stroke={outlineColor} strokeWidth="4" strokeLinecap="round" />
        {/* 코 */}
        <path d="M 100 110 L 95 145 L 100 150 L 105 145" fill="none" stroke={outlineColor} strokeWidth="2" />
        {/* 입 - 냉소적 미소 */}
        <path d="M 75 175 Q 100 185 125 175" fill="none" stroke={outlineColor} strokeWidth="3" />
        <path d="M 80 175 L 85 172" stroke={outlineColor} strokeWidth="2" />
      </svg>
    ),
    // INTP - 해커
    hacker: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <rect width="200" height="250" fill="#d4c4a8" />
        {/* 후드 */}
        <path d="M 25 250 Q 15 150 40 80 Q 70 30 100 25 Q 130 30 160 80 Q 185 150 175 250"
              fill="#2a2a2a" stroke={outlineColor} strokeWidth="3" />
        <path d="M 35 250 Q 30 160 50 100 Q 75 55 100 50 Q 125 55 150 100 Q 170 160 165 250"
              fill="#1a1a1a" stroke={outlineColor} strokeWidth="2" />
        {/* 얼굴 (그림자 속) */}
        <ellipse cx="100" cy="140" rx="50" ry="60" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        <ellipse cx="115" cy="145" rx="40" ry="55" fill={skinShadow} opacity="0.4" />
        {/* 헝클어진 앞머리 */}
        <path d="M 60 95 Q 55 80 70 75 L 80 90" fill="#1a1a1a" />
        <path d="M 75 90 Q 75 70 90 68 L 95 88" fill="#1a1a1a" />
        <path d="M 90 85 Q 95 65 110 65 L 108 85" fill="#1a1a1a" />
        <path d="M 105 85 Q 115 68 130 75 L 125 95" fill="#1a1a1a" />
        {/* 피곤한 눈 */}
        <ellipse cx="75" cy="130" rx="15" ry="8" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <ellipse cx="125" cy="130" rx="15" ry="8" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <circle cx="75" cy="130" r="6" fill="#3a5a3a" />
        <circle cx="125" cy="130" r="6" fill="#3a5a3a" />
        <circle cx="73" cy="128" r="2" fill="#ffffff" />
        <circle cx="123" cy="128" r="2" fill="#ffffff" />
        {/* 다크서클 */}
        <path d="M 60 138 Q 75 145 90 138" fill="none" stroke="#a090a0" strokeWidth="3" opacity="0.5" />
        <path d="M 110 138 Q 125 145 140 138" fill="none" stroke="#a090a0" strokeWidth="3" opacity="0.5" />
        {/* 코 */}
        <path d="M 100 135 L 97 160 L 103 160" fill="none" stroke={outlineColor} strokeWidth="2" />
        {/* 무표정한 입 */}
        <line x1="85" y1="180" x2="115" y2="180" stroke={outlineColor} strokeWidth="3" />
      </svg>
    ),
    // ENTJ - 보스
    boss: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <rect width="200" height="250" fill="#d4c4a8" />
        {/* 정장 칼라 */}
        <path d="M 60 220 L 40 250 L 80 250 L 100 230 L 120 250 L 160 250 L 140 220" fill="#1a1a1a" stroke={outlineColor} strokeWidth="2" />
        <path d="M 90 230 L 100 250 L 110 230" fill="#ffffff" />
        {/* 굵은 목 */}
        <rect x="70" y="195" width="60" height="40" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        {/* 각진 얼굴 */}
        <path d="M 40 75 L 35 140 Q 50 200 100 210 Q 150 200 165 140 L 160 75"
              fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        <path d="M 130 90 Q 155 130 150 180 Q 130 200 100 205" fill={skinShadow} opacity="0.4" />
        {/* 대머리 + 흉터 */}
        <ellipse cx="100" cy="65" rx="62" ry="45" fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        <path d="M 60 50 L 80 80 L 75 85" stroke="#8b0000" strokeWidth="4" fill="none" />
        {/* 사나운 눈 */}
        <path d="M 50 100 L 85 95 L 90 110 L 50 115 Z" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <path d="M 150 100 L 115 95 L 110 110 L 150 115 Z" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <circle cx="70" cy="105" r="8" fill="#4a3000" />
        <circle cx="130" cy="105" r="8" fill="#4a3000" />
        <circle cx="68" cy="103" r="3" fill="#ffffff" />
        <circle cx="128" cy="103" r="3" fill="#ffffff" />
        {/* 험악한 눈썹 */}
        <path d="M 45 85 L 92 78" stroke={outlineColor} strokeWidth="6" strokeLinecap="round" />
        <path d="M 155 85 L 108 78" stroke={outlineColor} strokeWidth="6" strokeLinecap="round" />
        {/* 넓은 코 */}
        <path d="M 100 105 L 92 150 Q 100 160 108 150 L 100 105" fill={skinShadow} stroke={outlineColor} strokeWidth="2" />
        {/* 시가 물고 있는 입 */}
        <path d="M 70 175 L 90 178 L 90 185 L 70 182 Z" fill={skinShadow} stroke={outlineColor} strokeWidth="2" />
        <rect x="85" y="176" width="40" height="10" rx="3" fill="#5a3a1a" stroke={outlineColor} strokeWidth="1" />
        <ellipse cx="128" cy="181" rx="5" ry="5" fill="#ff6600" />
      </svg>
    ),
    // ENTP - 사기꾼
    conman: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <rect width="200" height="250" fill="#d4c4a8" />
        {/* 목 */}
        <rect x="80" y="200" width="40" height="50" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        {/* 멋진 얼굴 */}
        <ellipse cx="100" cy="130" rx="55" ry="70" fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        <ellipse cx="120" cy="135" rx="40" ry="60" fill={skinShadow} opacity="0.3" />
        {/* 중절모 */}
        <ellipse cx="100" cy="58" rx="65" ry="18" fill="#1a1a1a" stroke={outlineColor} strokeWidth="2" />
        <path d="M 40 58 Q 50 20 100 10 Q 150 20 160 58" fill="#2a2a2a" stroke={outlineColor} strokeWidth="2" />
        <rect x="45" y="45" width="110" height="15" fill="#2a2a2a" />
        <rect x="60" y="48" width="80" height="8" fill="#8b0000" />
        {/* 웨이브 머리카락 */}
        <path d="M 50 75 Q 45 90 55 95" fill="#2a1a0a" />
        <path d="M 150 75 Q 155 90 145 95" fill="#2a1a0a" />
        {/* 윙크하는 눈 */}
        <ellipse cx="70" cy="120" rx="18" ry="12" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <circle cx="70" cy="120" r="8" fill="#4a3020" />
        <circle cx="68" cy="118" r="3" fill="#ffffff" />
        {/* 윙크 */}
        <path d="M 110 118 Q 130 110 150 120" stroke={outlineColor} strokeWidth="4" fill="none" />
        {/* 세련된 눈썹 */}
        <path d="M 50 105 Q 70 98 90 105" stroke={outlineColor} strokeWidth="3" fill="none" />
        <path d="M 150 108 L 115 105" stroke={outlineColor} strokeWidth="3" />
        {/* 코 */}
        <path d="M 100 125 L 95 155 Q 100 162 105 155" fill="none" stroke={outlineColor} strokeWidth="2" />
        {/* 매력적인 미소 */}
        <path d="M 65 175 Q 100 200 135 175" fill="#ffffff" stroke={outlineColor} strokeWidth="3" />
        <path d="M 70 178 Q 100 195 130 178" fill="#ffffff" />
        {/* 반짝이는 이빨 */}
        <line x1="85" y1="178" x2="85" y2="188" stroke={outlineColor} strokeWidth="1" />
        <line x1="100" y1="178" x2="100" y2="190" stroke={outlineColor} strokeWidth="1" />
        <line x1="115" y1="178" x2="115" y2="188" stroke={outlineColor} strokeWidth="1" />
      </svg>
    ),
    // INFJ - 예언자
    psychic: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <rect width="200" height="250" fill="#d4c4a8" />
        {/* 목 */}
        <rect x="85" y="195" width="30" height="55" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        {/* 신비로운 얼굴 */}
        <ellipse cx="100" cy="125" rx="50" ry="65" fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        {/* 긴 머리카락 */}
        <path d="M 30 100 Q 20 150 25 250" fill="#1a0a20" stroke={outlineColor} strokeWidth="2" />
        <path d="M 40 90 Q 25 140 30 250" fill="#2a1a30" stroke={outlineColor} strokeWidth="1" />
        <path d="M 170 100 Q 180 150 175 250" fill="#1a0a20" stroke={outlineColor} strokeWidth="2" />
        <path d="M 160 90 Q 175 140 170 250" fill="#2a1a30" stroke={outlineColor} strokeWidth="1" />
        {/* 머리 위 */}
        <ellipse cx="100" cy="65" rx="55" ry="35" fill="#1a0a20" stroke={outlineColor} strokeWidth="2" />
        <path d="M 50 80 Q 55 60 100 50 Q 145 60 150 80" fill="#2a1a30" />
        {/* 신비한 눈 */}
        <ellipse cx="70" cy="120" rx="18" ry="15" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <ellipse cx="130" cy="120" rx="18" ry="15" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <circle cx="70" cy="122" r="10" fill="#6a1b9a" />
        <circle cx="130" cy="122" r="10" fill="#6a1b9a" />
        <circle cx="70" cy="122" r="5" fill="#1a1a1a" />
        <circle cx="130" cy="122" r="5" fill="#1a1a1a" />
        <circle cx="68" cy="119" r="3" fill="#ffffff" />
        <circle cx="128" cy="119" r="3" fill="#ffffff" />
        {/* 이마의 점 */}
        <circle cx="100" cy="85" r="5" fill="#9c27b0" stroke={outlineColor} strokeWidth="1" />
        {/* 가는 눈썹 */}
        <path d="M 50 105 Q 70 100 88 108" stroke={outlineColor} strokeWidth="2" fill="none" />
        <path d="M 150 105 Q 130 100 112 108" stroke={outlineColor} strokeWidth="2" fill="none" />
        {/* 코 */}
        <path d="M 100 125 L 97 155 L 103 155" fill="none" stroke={outlineColor} strokeWidth="2" />
        {/* 신비로운 미소 */}
        <path d="M 85 175 Q 100 182 115 175" fill="none" stroke={outlineColor} strokeWidth="2" />
      </svg>
    ),
    // INFP - 시인
    poet: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <rect width="200" height="250" fill="#d4c4a8" />
        {/* 목 */}
        <rect x="82" y="195" width="36" height="55" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        {/* 부드러운 얼굴 */}
        <ellipse cx="100" cy="130" rx="52" ry="65" fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        <ellipse cx="115" cy="135" rx="40" ry="55" fill={skinShadow} opacity="0.3" />
        {/* 덥수룩한 머리 */}
        <path d="M 35 120 Q 25 60 60 35 Q 100 15 140 35 Q 175 60 165 120" fill="#3a2a1a" stroke={outlineColor} strokeWidth="2" />
        <path d="M 45 100 Q 40 50 100 35 Q 160 50 155 100" fill="#4a3a2a" />
        {/* 헝클어진 앞머리 */}
        <path d="M 55 85 Q 50 60 70 55 Q 65 75 75 90" fill="#3a2a1a" />
        <path d="M 70 80 Q 75 55 95 50 Q 85 70 90 85" fill="#3a2a1a" />
        <path d="M 130 80 Q 125 55 105 50 Q 115 70 110 85" fill="#3a2a1a" />
        <path d="M 145 85 Q 150 60 130 55 Q 135 75 125 90" fill="#3a2a1a" />
        {/* 크고 반짝이는 눈 */}
        <ellipse cx="70" cy="125" rx="20" ry="18" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <ellipse cx="130" cy="125" rx="20" ry="18" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <ellipse cx="72" cy="128" rx="12" ry="12" fill="#4fc3f7" />
        <ellipse cx="132" cy="128" rx="12" ry="12" fill="#4fc3f7" />
        <circle cx="72" cy="128" r="6" fill="#1a1a1a" />
        <circle cx="132" cy="128" r="6" fill="#1a1a1a" />
        <circle cx="68" cy="122" r="4" fill="#ffffff" />
        <circle cx="128" cy="122" r="4" fill="#ffffff" />
        <circle cx="76" cy="132" r="2" fill="#ffffff" />
        <circle cx="136" cy="132" r="2" fill="#ffffff" />
        {/* 부드러운 눈썹 */}
        <path d="M 48 108 Q 70 102 92 110" stroke={outlineColor} strokeWidth="2" fill="none" />
        <path d="M 152 108 Q 130 102 108 110" stroke={outlineColor} strokeWidth="2" fill="none" />
        {/* 코 */}
        <path d="M 100 130 L 97 160 L 103 160" fill="none" stroke={outlineColor} strokeWidth="2" />
        {/* 수줍은 미소 */}
        <path d="M 88 180 Q 100 188 112 180" fill="none" stroke={outlineColor} strokeWidth="2" />
      </svg>
    ),
    // ENFJ - 카리스마
    charity: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <rect width="200" height="250" fill="#d4c4a8" />
        {/* 정장 */}
        <path d="M 55 220 L 35 250 L 85 250 L 100 235 L 115 250 L 165 250 L 145 220" fill="#2a4a2a" stroke={outlineColor} strokeWidth="2" />
        <path d="M 92 235 L 100 250 L 108 235" fill="#ffffff" />
        {/* 목 */}
        <rect x="80" y="195" width="40" height="35" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        {/* 훈훈한 얼굴 */}
        <ellipse cx="100" cy="125" rx="55" ry="68" fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        <ellipse cx="118" cy="130" rx="42" ry="58" fill={skinShadow} opacity="0.3" />
        {/* 단정한 헤어 */}
        <path d="M 40 100 Q 35 50 70 30 Q 100 20 130 30 Q 165 50 160 100" fill="#2a1a0a" stroke={outlineColor} strokeWidth="2" />
        <path d="M 50 90 Q 50 55 100 40 Q 150 55 150 90" fill="#3a2a1a" />
        {/* 선한 웃는 눈 */}
        <path d="M 55 115 Q 72 105 90 118" stroke={outlineColor} strokeWidth="4" fill="none" />
        <path d="M 145 115 Q 128 105 110 118" stroke={outlineColor} strokeWidth="4" fill="none" />
        {/* 눈썹 */}
        <path d="M 55 105 Q 72 98 90 105" stroke={outlineColor} strokeWidth="3" fill="none" />
        <path d="M 145 105 Q 128 98 110 105" stroke={outlineColor} strokeWidth="3" fill="none" />
        {/* 코 */}
        <path d="M 100 120 L 95 155 Q 100 162 105 155" fill="none" stroke={outlineColor} strokeWidth="2" />
        {/* 따뜻한 미소 */}
        <path d="M 65 175 Q 100 205 135 175" fill="#ffffff" stroke={outlineColor} strokeWidth="3" />
        <path d="M 70 178 Q 100 200 130 178" fill="#ffffff" />
      </svg>
    ),
    // ENFP - 파티광
    party: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <rect width="200" height="250" fill="#d4c4a8" />
        {/* 목 */}
        <rect x="82" y="195" width="36" height="55" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        {/* 밝은 얼굴 */}
        <ellipse cx="100" cy="130" rx="55" ry="68" fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        {/* 화려한 머리 (스파이키) */}
        <path d="M 30 110 Q 25 70 50 40 L 65 70 Q 55 50 75 25 L 85 55 Q 85 30 100 15 L 105 50 Q 110 25 125 30 L 120 60 Q 135 35 155 50 L 145 80 Q 165 55 175 90 Q 175 120 160 130"
              fill="#ff6f00" stroke={outlineColor} strokeWidth="2" />
        <path d="M 45 100 Q 50 60 100 45 Q 150 60 155 100" fill="#ff8f00" />
        {/* 반짝이는 큰 눈 */}
        <ellipse cx="68" cy="125" rx="22" ry="20" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <ellipse cx="132" cy="125" rx="22" ry="20" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <circle cx="70" cy="128" r="12" fill="#ff4081" />
        <circle cx="134" cy="128" r="12" fill="#7c4dff" />
        <circle cx="70" cy="128" r="6" fill="#1a1a1a" />
        <circle cx="134" cy="128" r="6" fill="#1a1a1a" />
        <circle cx="66" cy="122" r="5" fill="#ffffff" />
        <circle cx="130" cy="122" r="5" fill="#ffffff" />
        {/* 눈썹 */}
        <path d="M 44 105 Q 68 95 92 108" stroke={outlineColor} strokeWidth="3" fill="none" />
        <path d="M 156 105 Q 132 95 108 108" stroke={outlineColor} strokeWidth="3" fill="none" />
        {/* 코 */}
        <path d="M 100 130 L 97 158 L 103 158" fill="none" stroke={outlineColor} strokeWidth="2" />
        {/* 만면에 미소 */}
        <path d="M 55 175 Q 100 220 145 175" fill="#ffffff" stroke={outlineColor} strokeWidth="3" />
        <path d="M 60 178 Q 100 212 140 178" fill="#ffffff" />
        <line x1="80" y1="180" x2="80" y2="195" stroke={outlineColor} strokeWidth="1" />
        <line x1="100" y1="180" x2="100" y2="200" stroke={outlineColor} strokeWidth="1" />
        <line x1="120" y1="180" x2="120" y2="195" stroke={outlineColor} strokeWidth="1" />
      </svg>
    ),
    // ISTJ - 엄격함
    strict: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <rect width="200" height="250" fill="#d4c4a8" />
        {/* 정장 */}
        <path d="M 55 215 L 35 250 L 85 250 L 100 230 L 115 250 L 165 250 L 145 215" fill="#1a1a2a" stroke={outlineColor} strokeWidth="2" />
        <path d="M 92 230 L 100 250 L 108 230" fill="#ffffff" />
        {/* 목 */}
        <rect x="78" y="190" width="44" height="35" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        {/* 각진 얼굴 */}
        <path d="M 45 80 L 40 130 Q 55 200 100 205 Q 145 200 160 130 L 155 80"
              fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        {/* 짧은 머리 (군인 스타일) */}
        <path d="M 45 85 Q 45 45 100 35 Q 155 45 155 85" fill="#2a2a2a" stroke={outlineColor} strokeWidth="2" />
        <path d="M 50 80 Q 55 50 100 42 Q 145 50 150 80" fill="#3a3a3a" />
        {/* 날카로운 눈 */}
        <path d="M 55 110 L 90 105 L 90 125 L 55 125 Z" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <path d="M 145 110 L 110 105 L 110 125 L 145 125 Z" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <circle cx="72" cy="115" r="7" fill="#3a3a3a" />
        <circle cx="128" cy="115" r="7" fill="#3a3a3a" />
        <circle cx="70" cy="113" r="2" fill="#ffffff" />
        <circle cx="126" cy="113" r="2" fill="#ffffff" />
        {/* 찌푸린 눈썹 */}
        <path d="M 50 95 L 92 88" stroke={outlineColor} strokeWidth="5" strokeLinecap="round" />
        <path d="M 150 95 L 108 88" stroke={outlineColor} strokeWidth="5" strokeLinecap="round" />
        {/* 코 */}
        <path d="M 100 115 L 95 150 L 100 155 L 105 150" fill="none" stroke={outlineColor} strokeWidth="2" />
        {/* 일자 입 */}
        <line x1="75" y1="175" x2="125" y2="175" stroke={outlineColor} strokeWidth="4" />
      </svg>
    ),
    // ISFJ - 요리사
    caring: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <rect width="200" height="250" fill="#d4c4a8" />
        {/* 앞치마 끈 */}
        <path d="M 70 220 L 50 250" stroke="#d4a574" strokeWidth="5" />
        <path d="M 130 220 L 150 250" stroke="#d4a574" strokeWidth="5" />
        {/* 목 */}
        <rect x="82" y="190" width="36" height="40" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        {/* 둥근 얼굴 */}
        <ellipse cx="100" cy="120" rx="55" ry="65" fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        <ellipse cx="115" cy="125" rx="42" ry="55" fill={skinShadow} opacity="0.3" />
        {/* 단정히 묶은 머리 */}
        <ellipse cx="100" cy="60" rx="52" ry="30" fill="#4a3020" stroke={outlineColor} strokeWidth="2" />
        <circle cx="100" cy="40" r="15" fill="#4a3020" stroke={outlineColor} strokeWidth="2" />
        <path d="M 55 80 Q 55 55 100 45 Q 145 55 145 80" fill="#5a4030" />
        {/* 친근한 눈 */}
        <ellipse cx="70" cy="115" rx="16" ry="14" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <ellipse cx="130" cy="115" rx="16" ry="14" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <circle cx="72" cy="118" r="8" fill="#5d4037" />
        <circle cx="132" cy="118" r="8" fill="#5d4037" />
        <circle cx="70" cy="115" r="3" fill="#ffffff" />
        <circle cx="130" cy="115" r="3" fill="#ffffff" />
        {/* 눈썹 */}
        <path d="M 52 100 Q 70 95 88 102" stroke={outlineColor} strokeWidth="2" fill="none" />
        <path d="M 148 100 Q 130 95 112 102" stroke={outlineColor} strokeWidth="2" fill="none" />
        {/* 코 */}
        <path d="M 100 118 L 97 145 L 103 145" fill="none" stroke={outlineColor} strokeWidth="2" />
        {/* 다정한 미소 */}
        <path d="M 70 160 Q 100 185 130 160" fill="none" stroke={outlineColor} strokeWidth="3" />
        {/* 볼터치 */}
        <ellipse cx="55" cy="140" rx="12" ry="8" fill="#ffcdd2" opacity="0.6" />
        <ellipse cx="145" cy="140" rx="12" ry="8" fill="#ffcdd2" opacity="0.6" />
      </svg>
    ),
    // ESTJ - 관리자
    manager: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <rect width="200" height="250" fill="#d4c4a8" />
        {/* 제복 */}
        <path d="M 50 215 L 30 250 L 85 250 L 100 235 L 115 250 L 170 250 L 150 215" fill="#1a3a5a" stroke={outlineColor} strokeWidth="2" />
        <path d="M 92 235 L 100 250 L 108 235" fill="#ffffff" />
        {/* 계급장 */}
        <rect x="55" y="225" width="18" height="10" fill="#ffd700" stroke={outlineColor} strokeWidth="1" />
        <rect x="127" y="225" width="18" height="10" fill="#ffd700" stroke={outlineColor} strokeWidth="1" />
        {/* 굵은 목 */}
        <rect x="75" y="190" width="50" height="35" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        {/* 강인한 얼굴 */}
        <path d="M 42 85 L 38 140 Q 55 205 100 210 Q 145 205 162 140 L 158 85"
              fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        {/* 짧은 머리 */}
        <path d="M 42 90 Q 40 45 100 32 Q 160 45 158 90" fill="#2a2a2a" stroke={outlineColor} strokeWidth="2" />
        <path d="M 48 85 Q 50 52 100 42 Q 150 52 152 85" fill="#3a3a3a" />
        {/* 위엄있는 눈 */}
        <path d="M 52 108 L 88 103 L 88 123 L 52 123 Z" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <path d="M 148 108 L 112 103 L 112 123 L 148 123 Z" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <circle cx="70" cy="113" r="8" fill="#1a3a5a" />
        <circle cx="130" cy="113" r="8" fill="#1a3a5a" />
        <circle cx="68" cy="111" r="3" fill="#ffffff" />
        <circle cx="128" cy="111" r="3" fill="#ffffff" />
        {/* 강한 눈썹 */}
        <path d="M 48 92 L 90 85" stroke={outlineColor} strokeWidth="6" strokeLinecap="round" />
        <path d="M 152 92 L 110 85" stroke={outlineColor} strokeWidth="6" strokeLinecap="round" />
        {/* 코 */}
        <path d="M 100 110 L 94 150 Q 100 158 106 150" fill={skinShadow} stroke={outlineColor} strokeWidth="2" />
        {/* 굳은 입 */}
        <line x1="75" y1="175" x2="125" y2="175" stroke={outlineColor} strokeWidth="4" />
      </svg>
    ),
    // ESFJ - 사교적
    neighbor: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <rect width="200" height="250" fill="#d4c4a8" />
        {/* 화려한 옷 */}
        <path d="M 55 210 L 35 250 L 165 250 L 145 210" fill="#e91e63" stroke={outlineColor} strokeWidth="2" />
        {/* 목걸이 */}
        <ellipse cx="100" cy="210" rx="25" ry="8" fill="none" stroke="#ffd700" strokeWidth="3" />
        {/* 목 */}
        <rect x="82" y="185" width="36" height="35" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        {/* 둥근 얼굴 */}
        <ellipse cx="100" cy="115" rx="55" ry="65" fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        <ellipse cx="115" cy="120" rx="42" ry="55" fill={skinShadow} opacity="0.3" />
        {/* 풍성한 머리 (펌) */}
        <ellipse cx="100" cy="60" rx="58" ry="35" fill="#5a3020" stroke={outlineColor} strokeWidth="2" />
        <circle cx="50" cy="75" r="20" fill="#5a3020" />
        <circle cx="150" cy="75" r="20" fill="#5a3020" />
        <circle cx="60" cy="58" r="15" fill="#5a3020" />
        <circle cx="140" cy="58" r="15" fill="#5a3020" />
        <path d="M 50 85 Q 55 55 100 45 Q 145 55 150 85" fill="#6a4030" />
        {/* 반짝이는 눈 */}
        <ellipse cx="70" cy="110" rx="17" ry="15" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <ellipse cx="130" cy="110" rx="17" ry="15" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <circle cx="72" cy="113" r="9" fill="#5d4037" />
        <circle cx="132" cy="113" r="9" fill="#5d4037" />
        <circle cx="69" cy="109" r="4" fill="#ffffff" />
        <circle cx="129" cy="109" r="4" fill="#ffffff" />
        {/* 눈썹 */}
        <path d="M 50 95 Q 70 88 90 98" stroke={outlineColor} strokeWidth="2" fill="none" />
        <path d="M 150 95 Q 130 88 110 98" stroke={outlineColor} strokeWidth="2" fill="none" />
        {/* 코 */}
        <path d="M 100 115 L 97 145 L 103 145" fill="none" stroke={outlineColor} strokeWidth="2" />
        {/* 활짝 웃는 입 */}
        <path d="M 62 158 Q 100 195 138 158" fill="#ffffff" stroke={outlineColor} strokeWidth="3" />
        <path d="M 67 162 Q 100 190 133 162" fill="#ffffff" />
        {/* 볼터치 */}
        <ellipse cx="50" cy="135" rx="12" ry="8" fill="#ffcdd2" opacity="0.7" />
        <ellipse cx="150" cy="135" rx="12" ry="8" fill="#ffcdd2" opacity="0.7" />
      </svg>
    ),
    // ISTP - 메카닉
    mechanic: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <rect width="200" height="250" fill="#d4c4a8" />
        {/* 작업복 */}
        <path d="M 50 210 L 30 250 L 170 250 L 150 210" fill="#455a64" stroke={outlineColor} strokeWidth="2" />
        <rect x="60" y="220" width="25" height="20" fill="#546e7a" stroke={outlineColor} strokeWidth="1" />
        {/* 목 */}
        <rect x="78" y="185" width="44" height="35" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        {/* 각진 얼굴 */}
        <path d="M 45 85 L 40 135 Q 55 200 100 205 Q 145 200 160 135 L 155 85"
              fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        {/* 기름때 */}
        <ellipse cx="135" cy="145" rx="10" ry="6" fill="#37474f" opacity="0.5" />
        {/* 짧은 머리 */}
        <path d="M 45 90 Q 45 45 100 35 Q 155 45 155 90" fill="#212121" stroke={outlineColor} strokeWidth="2" />
        <path d="M 50 85 Q 55 50 100 42 Q 145 50 150 85" fill="#2a2a2a" />
        {/* 날카로운 눈 */}
        <path d="M 55 110 L 90 107 L 90 123 L 55 120 Z" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <path d="M 145 110 L 110 107 L 110 123 L 145 120 Z" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <circle cx="72" cy="115" r="7" fill="#455a64" />
        <circle cx="128" cy="115" r="7" fill="#455a64" />
        <circle cx="70" cy="113" r="2" fill="#ffffff" />
        <circle cx="126" cy="113" r="2" fill="#ffffff" />
        {/* 무심한 눈썹 */}
        <line x1="55" y1="98" x2="90" y2="98" stroke={outlineColor} strokeWidth="4" />
        <line x1="145" y1="98" x2="110" y2="98" stroke={outlineColor} strokeWidth="4" />
        {/* 코 */}
        <path d="M 100 112 L 95 148 L 100 153 L 105 148" fill="none" stroke={outlineColor} strokeWidth="2" />
        {/* 무표정한 입 */}
        <line x1="80" y1="173" x2="120" y2="173" stroke={outlineColor} strokeWidth="3" />
      </svg>
    ),
    // ISFP - 예술가
    artist: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <rect width="200" height="250" fill="#d4c4a8" />
        {/* 물감 얼룩 */}
        <circle cx="170" cy="30" r="12" fill="#f44336" opacity="0.4" />
        <circle cx="30" cy="220" r="15" fill="#2196f3" opacity="0.3" />
        {/* 목 */}
        <rect x="82" y="190" width="36" height="50" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        {/* 부드러운 얼굴 */}
        <ellipse cx="100" cy="125" rx="52" ry="65" fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        {/* 긴 헝클어진 머리 */}
        <path d="M 30 130 Q 20 80 55 45 Q 100 20 145 45 Q 180 80 170 130 Q 175 180 165 250"
              fill="#1a1a1a" stroke={outlineColor} strokeWidth="2" />
        <path d="M 35 120 Q 30 70 100 40 Q 170 70 165 120" fill="#2a2a2a" />
        <path d="M 30 130 Q 25 180 35 250" fill="#1a1a1a" />
        {/* 앞머리 */}
        <path d="M 55 90 Q 50 60 75 55 L 70 85" fill="#1a1a1a" />
        <path d="M 68 85 Q 75 55 100 50 L 95 80" fill="#1a1a1a" />
        {/* 꿈꾸는 눈 */}
        <ellipse cx="70" cy="120" rx="18" ry="16" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <ellipse cx="130" cy="120" rx="18" ry="16" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <ellipse cx="72" cy="123" rx="11" ry="11" fill="#7c4dff" />
        <ellipse cx="132" cy="123" rx="11" ry="11" fill="#7c4dff" />
        <circle cx="72" cy="123" r="5" fill="#1a1a1a" />
        <circle cx="132" cy="123" r="5" fill="#1a1a1a" />
        <circle cx="68" cy="118" r="4" fill="#ffffff" />
        <circle cx="128" cy="118" r="4" fill="#ffffff" />
        {/* 눈썹 */}
        <path d="M 50 105 Q 70 100 90 108" stroke={outlineColor} strokeWidth="2" fill="none" />
        <path d="M 150 105 Q 130 100 110 108" stroke={outlineColor} strokeWidth="2" fill="none" />
        {/* 코 */}
        <path d="M 100 125 L 97 155 L 103 155" fill="none" stroke={outlineColor} strokeWidth="2" />
        {/* 신비로운 미소 */}
        <path d="M 85 175 Q 100 183 115 175" fill="none" stroke={outlineColor} strokeWidth="2" />
      </svg>
    ),
    // ESTP - 도박사
    extreme: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <rect width="200" height="250" fill="#d4c4a8" />
        {/* 가죽 재킷 */}
        <path d="M 45 210 L 25 250 L 175 250 L 155 210" fill="#1a1a1a" stroke={outlineColor} strokeWidth="2" />
        <path d="M 48 218 L 55 212 L 62 225" stroke="#2a2a2a" strokeWidth="2" fill="none" />
        <path d="M 152 218 L 145 212 L 138 225" stroke="#2a2a2a" strokeWidth="2" fill="none" />
        {/* 굵은 목 */}
        <rect x="75" y="188" width="50" height="35" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        {/* 거친 얼굴 */}
        <path d="M 42 85 L 38 135 Q 52 200 100 205 Q 148 200 162 135 L 158 85"
              fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        <ellipse cx="120" cy="140" rx="35" ry="50" fill={skinShadow} opacity="0.3" />
        {/* 흉터 */}
        <path d="M 125 80 L 145 105" stroke="#c62828" strokeWidth="3" fill="none" />
        {/* 스파이키 머리 */}
        <path d="M 42 90 L 50 50 L 65 75 L 75 35 L 90 65 L 100 25 L 110 65 L 125 35 L 135 75 L 150 50 L 158 90"
              fill="#3e2723" stroke={outlineColor} strokeWidth="2" />
        <path d="M 48 85 Q 55 55 100 45 Q 145 55 152 85" fill="#4e3733" />
        {/* 도발적인 눈 */}
        <path d="M 52 108 L 88 103 L 88 125 L 52 122 Z" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <path d="M 148 108 L 112 103 L 112 125 L 148 122 Z" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <circle cx="70" cy="113" r="8" fill="#b71c1c" />
        <circle cx="130" cy="113" r="8" fill="#b71c1c" />
        <circle cx="68" cy="111" r="3" fill="#ffffff" />
        <circle cx="128" cy="111" r="3" fill="#ffffff" />
        {/* 도발적 눈썹 */}
        <path d="M 48 93 L 90 86" stroke={outlineColor} strokeWidth="5" strokeLinecap="round" />
        <path d="M 152 93 L 110 86" stroke={outlineColor} strokeWidth="5" strokeLinecap="round" />
        {/* 코 */}
        <path d="M 100 110 L 94 148 Q 100 155 106 148" fill="none" stroke={outlineColor} strokeWidth="2" />
        {/* 도발적 미소 */}
        <path d="M 65 170 Q 100 195 135 170" fill="none" stroke={outlineColor} strokeWidth="3" />
        <path d="M 70 173 Q 100 190 130 173" fill="#ffffff" />
      </svg>
    ),
    // ESFP - 쇼맨
    showman: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <rect width="200" height="250" fill="#d4c4a8" />
        {/* 화려한 재킷 */}
        <path d="M 45 210 L 25 250 L 175 250 L 155 210" fill="#c62828" stroke={outlineColor} strokeWidth="2" />
        <path d="M 50 218 L 55 250" stroke="#ffd700" strokeWidth="3" />
        <path d="M 150 218 L 145 250" stroke="#ffd700" strokeWidth="3" />
        <path d="M 92 225 L 100 250 L 108 225" fill="#ffd700" />
        {/* 목 */}
        <rect x="80" y="190" width="40" height="30" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        {/* 매력적인 얼굴 */}
        <ellipse cx="100" cy="120" rx="55" ry="68" fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        <ellipse cx="118" cy="125" rx="42" ry="58" fill={skinShadow} opacity="0.3" />
        {/* 화려한 헤어 */}
        <path d="M 35 100 Q 30 50 70 28 Q 100 18 130 28 Q 170 50 165 100" fill="#1a1a1a" stroke={outlineColor} strokeWidth="2" />
        <path d="M 45 90 Q 50 50 100 38 Q 150 50 155 90" fill="#2a2a2a" />
        {/* 빛나는 효과 */}
        <path d="M 55 65 Q 50 50 65 45" stroke="#ffd700" strokeWidth="2" fill="none" />
        <path d="M 145 65 Q 150 50 135 45" stroke="#ffd700" strokeWidth="2" fill="none" />
        {/* 윙크하는 눈 */}
        <ellipse cx="68" cy="115" rx="18" ry="15" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <circle cx="70" cy="118" r="10" fill="#5d4037" />
        <circle cx="67" cy="114" r="4" fill="#ffffff" />
        {/* 윙크 */}
        <path d="M 110 115 Q 130 105 150 118" stroke={outlineColor} strokeWidth="4" fill="none" />
        {/* 눈썹 */}
        <path d="M 48 100 Q 68 92 90 102" stroke={outlineColor} strokeWidth="3" fill="none" />
        <path d="M 152 102 L 115 100" stroke={outlineColor} strokeWidth="3" />
        {/* 코 */}
        <path d="M 100 118 L 96 150 Q 100 157 104 150" fill="none" stroke={outlineColor} strokeWidth="2" />
        {/* 스타 스마일 */}
        <path d="M 58 165 Q 100 205 142 165" fill="#ffffff" stroke={outlineColor} strokeWidth="3" />
        <path d="M 63 168 Q 100 198 137 168" fill="#ffffff" />
        <line x1="80" y1="170" x2="80" y2="185" stroke={outlineColor} strokeWidth="1" />
        <line x1="100" y1="170" x2="100" y2="190" stroke={outlineColor} strokeWidth="1" />
        <line x1="120" y1="170" x2="120" y2="185" stroke={outlineColor} strokeWidth="1" />
      </svg>
    ),
    // 기본
    default: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        <rect width="200" height="250" fill="#d4c4a8" />
        <rect x="82" y="195" width="36" height="55" fill={skinColor} stroke={outlineColor} strokeWidth="2" />
        <ellipse cx="100" cy="120" rx="55" ry="68" fill={skinColor} stroke={outlineColor} strokeWidth="3" />
        <ellipse cx="100" cy="60" rx="55" ry="35" fill="#4a3a2a" stroke={outlineColor} strokeWidth="2" />
        <ellipse cx="70" cy="115" rx="15" ry="12" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <ellipse cx="130" cy="115" rx="15" ry="12" fill="#ffffff" stroke={outlineColor} strokeWidth="2" />
        <circle cx="70" cy="117" r="7" fill="#3a3a3a" />
        <circle cx="130" cy="117" r="7" fill="#3a3a3a" />
        <path d="M 100 125 L 97 155 L 103 155" fill="none" stroke={outlineColor} strokeWidth="2" />
        <path d="M 80 175 Q 100 185 120 175" fill="none" stroke={outlineColor} strokeWidth="3" />
      </svg>
    ),
  };

  return portraits[type] || portraits.default;
};

// 세계정부 마크 SVG
const WorldGovernmentSeal = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {/* 외부 원 */}
    <circle cx="50" cy="50" r="45" fill="none" stroke="#1a3a6a" strokeWidth="3" opacity="0.7" />
    <circle cx="50" cy="50" r="38" fill="none" stroke="#1a3a6a" strokeWidth="2" opacity="0.5" />
    {/* 중앙 십자가 모양 */}
    <path d="M 50 15 L 50 85 M 15 50 L 85 50" stroke="#1a3a6a" strokeWidth="4" opacity="0.6" />
    {/* 4개의 원 (세계정부 상징) */}
    <circle cx="50" cy="25" r="8" fill="#1a3a6a" opacity="0.5" />
    <circle cx="50" cy="75" r="8" fill="#1a3a6a" opacity="0.5" />
    <circle cx="25" cy="50" r="8" fill="#1a3a6a" opacity="0.5" />
    <circle cx="75" cy="50" r="8" fill="#1a3a6a" opacity="0.5" />
    {/* 중앙 원 */}
    <circle cx="50" cy="50" r="12" fill="#1a3a6a" opacity="0.4" />
    {/* W.G. 텍스트 */}
    <text x="50" y="55" textAnchor="middle" fontSize="10" fill="#1a3a6a" fontWeight="bold" opacity="0.8">W.G.</text>
  </svg>
);

export default function WantedView({ data }: WantedViewProps) {
  const { user_info, theme_data } = data;
  const wanted = theme_data?.wanted;

  if (!wanted) {
    return <div className="text-white text-center p-8">수배 데이터 로딩 중...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      {/* 원피스 스타일 수배 전단 */}
      <div className="relative">
        {/* 세계정부 워터마크 (배경) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
          <div className="w-64 h-64">
            <WorldGovernmentSeal />
          </div>
        </div>

        {/* 양피지 배경 */}
        <div
          className="relative rounded-sm overflow-hidden"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, rgba(255,250,240,0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(139,90,43,0.1) 0%, transparent 50%),
              linear-gradient(135deg, #f5e6c8 0%, #e8d4a8 25%, #f0deb8 50%, #e5d0a0 75%, #f2e2c0 100%)
            `,
            boxShadow: "0 8px 25px rgba(0,0,0,0.4), inset 0 0 80px rgba(139,90,43,0.15)",
            border: "3px solid #8b7355",
          }}
        >
          {/* 구겨진 종이 텍스처 오버레이 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(139,90,43,0.03) 10px,
                  rgba(139,90,43,0.03) 20px
                )
              `,
            }}
          />

          <div className="px-5 pt-5 pb-8 relative z-10">
            {/* WANTED 타이틀 - 더 과장된 스타일 */}
            <div className="text-center mb-1">
              <h1
                className="text-6xl font-black tracking-wider"
                style={{
                  fontFamily: "Impact, 'Arial Black', sans-serif",
                  color: "#8b0000",
                  textShadow: `
                    3px 3px 0 #5a0000,
                    -2px -2px 0 #3a0000,
                    2px -2px 0 #4a0000,
                    -2px 2px 0 #4a0000,
                    0 4px 8px rgba(0,0,0,0.3)
                  `,
                  letterSpacing: "0.2em",
                }}
              >
                WANTED
              </h1>
            </div>

            {/* 장식 라인 */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-amber-800 to-transparent" />
              <span className="text-amber-800 text-xs">★</span>
              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-amber-800 to-transparent" />
            </div>

            {/* DEAD OR ALIVE */}
            <div className="text-center mb-4">
              <p
                className="text-xl font-black tracking-[0.3em]"
                style={{
                  fontFamily: "Impact, sans-serif",
                  color: "#4a2a0a",
                  textShadow: "1px 1px 0 rgba(255,255,255,0.3)",
                }}
              >
                DEAD OR ALIVE
              </p>
            </div>

            {/* 초상화 프레임 - 더 원피스스러운 테두리 */}
            <div className="flex justify-center mb-4">
              <div
                className="relative"
                style={{
                  width: "220px",
                  height: "270px",
                  background: "#c9b896",
                  padding: "8px",
                  border: "6px solid #5a3a1a",
                  borderRadius: "4px",
                  boxShadow: `
                    inset 0 0 20px rgba(0,0,0,0.2),
                    0 4px 10px rgba(0,0,0,0.3),
                    inset 3px 3px 0 rgba(255,255,255,0.1)
                  `,
                }}
              >
                {/* 내부 테두리 */}
                <div
                  className="absolute inset-2 border-2 rounded-sm pointer-events-none"
                  style={{ borderColor: "#8b7355" }}
                />
                <div className="w-full h-full overflow-hidden">
                  <OnePiecePortrait type={wanted.criminal_portrait} gender={user_info.gender} />
                </div>
              </div>
            </div>

            {/* 별명 */}
            <div className="text-center mb-3">
              <p
                className="text-3xl font-black"
                style={{
                  fontFamily: "Impact, 'Arial Black', sans-serif",
                  color: "#1a1a1a",
                  textShadow: "2px 2px 0 rgba(255,255,255,0.3)",
                  letterSpacing: "0.05em",
                }}
              >
                &ldquo;{wanted.criminal_alias}&rdquo;
              </p>
            </div>

            {/* 현상금 - 더 강조 */}
            <div className="text-center mb-2">
              <div
                className="inline-block px-6 py-2 rounded"
                style={{
                  background: "linear-gradient(180deg, #f5e6c8 0%, #e5d0a0 100%)",
                  border: "2px solid #8b7355",
                }}
              >
                <p
                  className="text-5xl font-black"
                  style={{
                    fontFamily: "Impact, 'Arial Black', sans-serif",
                    color: "#1a1a1a",
                    textShadow: "2px 2px 0 rgba(139,90,43,0.3)",
                    letterSpacing: "0.02em",
                  }}
                >
                  <span className="text-3xl">฿</span>{wanted.bounty.toLocaleString()}<span className="text-2xl">-</span>
                </p>
              </div>
            </div>

            {/* MARINE 스탬프 - 더 원피스스럽게 */}
            <div className="absolute bottom-12 right-4 transform rotate-[-20deg]">
              <div
                className="px-4 py-2 rounded-sm"
                style={{
                  border: "4px solid #1a3a6a",
                  color: "#1a3a6a",
                  fontFamily: "Impact, sans-serif",
                  fontSize: "1.3rem",
                  fontWeight: "900",
                  letterSpacing: "0.15em",
                  opacity: 0.75,
                  textShadow: "1px 1px 0 rgba(255,255,255,0.5)",
                }}
              >
                MARINE
              </div>
            </div>

            {/* 세계정부 승인 마크 */}
            <div className="absolute bottom-10 left-4 w-16 h-16 transform rotate-[10deg] opacity-60">
              <WorldGovernmentSeal />
            </div>
          </div>

          {/* 하단 장식 */}
          <div className="h-3 bg-gradient-to-r from-amber-900/20 via-amber-800/30 to-amber-900/20" />
        </div>

        {/* 죄목 태그 */}
        <div
          className="mt-4 p-4 rounded-sm"
          style={{
            background: "linear-gradient(135deg, #f5e6c8 0%, #e8d4a8 100%)",
            border: "3px solid #8b7355",
            boxShadow: "inset 0 0 15px rgba(139,90,43,0.1)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-800">⚓</span>
            <h3 className="font-black text-sm tracking-wider" style={{ color: "#5a3a1a" }}>주요 죄목</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {wanted.crimes.map((crime, idx) => (
              <span
                key={idx}
                className="text-sm px-3 py-1 rounded-sm font-bold"
                style={{
                  backgroundColor: "#d4c4a8",
                  color: "#3a2a1a",
                  border: "2px solid #8b7355",
                  boxShadow: "1px 1px 0 rgba(0,0,0,0.1)",
                }}
              >
                {crime}
              </span>
            ))}
          </div>
        </div>

        {/* 범죄 스토리 */}
        <div
          className="mt-3 p-4 rounded-sm"
          style={{
            background: "linear-gradient(135deg, #f5e6c8 0%, #e8d4a8 100%)",
            border: "3px solid #8b7355",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-800">📜</span>
            <h3 className="font-black text-sm tracking-wider" style={{ color: "#5a3a1a" }}>범죄 기록</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#3a2a1a", fontFamily: "serif" }}>
            {wanted.crime_story}
          </p>
        </div>

        {/* 악명 높은 행적 */}
        <div
          className="mt-3 p-4 rounded-sm"
          style={{
            background: "linear-gradient(180deg, #8b0000 0%, #5a0000 100%)",
            border: "3px solid #3a0000",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span>☠️</span>
            <h3 className="font-black text-sm tracking-wider text-amber-100">악명 높은 행적</h3>
          </div>
          <ul className="text-sm space-y-2">
            {wanted.notorious_actions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2 text-amber-50">
                <span className="text-amber-300 mt-0.5">▸</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 목격 정보 & 경고 */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div
            className="p-3 rounded-sm"
            style={{
              background: "linear-gradient(135deg, #1a3a6a 0%, #0a2a4a 100%)",
              border: "2px solid #0a1a3a",
            }}
          >
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs">🔍</span>
              <h4 className="font-bold text-xs text-blue-200">최근 목격</h4>
            </div>
            <p className="text-xs text-blue-100">{wanted.last_seen}</p>
          </div>
          <div
            className="p-3 rounded-sm"
            style={{
              background: "linear-gradient(135deg, #4a0a0a 0%, #2a0000 100%)",
              border: "2px solid #1a0000",
            }}
          >
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs">⚡</span>
              <h4 className="font-bold text-xs text-red-200">특별 경고</h4>
            </div>
            <p className="text-xs text-red-100">{wanted.special_warning}</p>
          </div>
        </div>

        {/* MARINE 하단 바 */}
        <div
          className="mt-4 p-2 text-center rounded-sm"
          style={{
            background: "linear-gradient(135deg, #1a3a6a 0%, #0a2a5a 100%)",
            border: "2px solid #0a1a3a",
          }}
        >
          <p className="text-xs font-bold tracking-[0.3em] text-blue-100">
            WORLD GOVERNMENT · MARINE HEADQUARTERS
          </p>
        </div>

        {/* 면책 */}
        <p className="text-center text-xs mt-4 opacity-40" style={{ color: "#5a4a3a" }}>
          ※ 이 수배서는 재미를 위한 가상의 콘텐츠입니다
        </p>
      </div>
    </div>
  );
}
