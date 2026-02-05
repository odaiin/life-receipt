"use client";

import { Rye, Special_Elite } from "next/font/google";
import { useMemo } from "react";

// Google Fonts - 서부 영화 스타일 폰트
const wantedFont = Rye({
  weight: "400",
  subsets: ["latin"],
});

const typewriterFont = Special_Elite({
  weight: "400",
  subsets: ["latin"],
});

// 타입 정의
interface SajuPillar {
  stem: string;
  branch: string;
  stem_korean: string;
  branch_korean: string;
}

interface WantedTheme {
  crimes: string[];
  bounty: number;
  danger_level: string;
}

interface ThemeData {
  receipt: {
    items: { name: string; price: number }[];
    total: number;
  };
  wanted: WantedTheme;
}

interface SajuAnalysis {
  year_pillar: SajuPillar;
  month_pillar: SajuPillar;
  day_pillar: SajuPillar;
  hour_pillar: SajuPillar | null;
  day_master: string;
  day_master_korean: string;
  day_master_element: string;
  five_elements: {
    Wood: number;
    Fire: number;
    Earth: number;
    Metal: number;
    Water: number;
  };
  main_trait: string;
  main_trait_korean: string;
  lacking_traits: string[];
  lacking_traits_korean: string[];
}

interface AnalyzeResponse {
  user_info: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    gender: string;
    mbti: string;
  };
  saju_analysis: SajuAnalysis;
  theme_data?: ThemeData;
}

interface WantedViewProps {
  data: AnalyzeResponse;
}

// 현상금 포맷팅 함수
function formatBounty(bounty: number): string {
  return `$${bounty.toLocaleString()}`;
}

// 낡은 종이 테두리 효과
function OldPaperBorder() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* 외곽 테두리 */}
      <div className="absolute inset-2 border-4 border-amber-900/60" />
      <div className="absolute inset-4 border-2 border-amber-900/40" />
      {/* 코너 장식 */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-amber-900/70" />
      <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-amber-900/70" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-amber-900/70" />
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-amber-900/70" />
    </div>
  );
}

// 별 장식 컴포넌트
function StarDecoration() {
  return (
    <div className="flex justify-center items-center gap-2 my-2">
      <span className="text-amber-900/70 text-xl">&#9733;</span>
      <span className="text-amber-900/70 text-sm">&#9733;</span>
      <span className="text-amber-900/70 text-xl">&#9733;</span>
    </div>
  );
}

export default function WantedView({ data }: WantedViewProps) {
  const { user_info, saju_analysis, theme_data } = data;

  // 현상수배 데이터 (theme_data가 없으면 기본값)
  const wantedData = theme_data?.wanted || {
    crimes: ["데이터 없음"],
    bounty: 0,
    danger_level: "WANTED",
  };

  // 포스터 일련번호
  const posterNumber = useMemo(() => {
    return `NO. ${String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0")}`;
  }, []);

  // 위험도에 따른 색상
  const getDangerColor = (level: string) => {
    switch (level) {
      case "EXTREMELY DANGEROUS":
        return "text-red-800";
      case "HIGHLY DANGEROUS":
        return "text-red-700";
      case "DANGEROUS":
        return "text-orange-700";
      default:
        return "text-amber-900";
    }
  };

  return (
    <div className={`${wantedFont.className} relative max-w-sm mx-auto`}>
      {/* 낡은 종이 배경 */}
      <div
        className="relative p-8"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(139, 90, 43, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(139, 90, 43, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, #d4a574 0%, #c9a066 25%, #d4a574 50%, #b8956a 75%, #d4a574 100%)
          `,
          boxShadow: `
            inset 0 0 100px rgba(139, 90, 43, 0.3),
            0 4px 20px rgba(0, 0, 0, 0.3)
          `,
        }}
      >
        <OldPaperBorder />

        {/* WANTED 타이틀 */}
        <div className="text-center mb-2 relative z-10">
          <h1
            className="text-5xl md:text-6xl font-bold text-amber-900 tracking-[0.2em] drop-shadow-lg"
            style={{
              textShadow: "2px 2px 0 #8b5a2b, -1px -1px 0 #d4a574",
            }}
          >
            WANTED
          </h1>
        </div>

        {/* DEAD OR ALIVE */}
        <div className="text-center mb-4 relative z-10">
          <p
            className="text-lg tracking-[0.3em] text-amber-900/90 font-bold"
            style={{
              textShadow: "1px 1px 0 rgba(139, 90, 43, 0.3)",
            }}
          >
            DEAD OR ALIVE
          </p>
        </div>

        <StarDecoration />

        {/* 머그샷 스타일 정보 박스 */}
        <div className="relative z-10 my-4">
          <div
            className="border-4 border-amber-900/70 bg-amber-100/50 p-4 text-center mx-auto max-w-[280px]"
            style={{
              boxShadow: "inset 0 0 20px rgba(139, 90, 43, 0.2)",
            }}
          >
            {/* MBTI 대형 표시 */}
            <p
              className="text-5xl font-bold text-amber-900 mb-2"
              style={{
                textShadow: "2px 2px 0 rgba(139, 90, 43, 0.3)",
              }}
            >
              {user_info.mbti}
            </p>

            {/* 사주 일주 */}
            <div className="flex justify-center gap-2 mb-2">
              <span className="text-3xl text-amber-900">
                {saju_analysis.day_pillar.stem}
              </span>
              <span className="text-3xl text-amber-900">
                {saju_analysis.day_pillar.branch}
              </span>
            </div>

            {/* 일주 한글 */}
            <p className={`${typewriterFont.className} text-sm text-amber-800`}>
              "{saju_analysis.day_master_korean}일간" / {saju_analysis.main_trait_korean}
            </p>
          </div>
        </div>

        <StarDecoration />

        {/* 죄목 리스트 */}
        <div className="relative z-10 text-center mb-4">
          <p className="text-xl tracking-[0.2em] text-amber-900/80 mb-3 font-bold">
            - CRIMES -
          </p>
          <div className={`${typewriterFont.className} space-y-2`}>
            {wantedData.crimes.map((crime, index) => (
              <p
                key={index}
                className="text-sm text-amber-900/90 leading-relaxed"
              >
                {index + 1}. {crime}
              </p>
            ))}
          </div>
        </div>

        {/* 위험도 표시 */}
        <div className="relative z-10 text-center mb-4">
          <p
            className={`text-lg tracking-[0.1em] font-bold ${getDangerColor(wantedData.danger_level)}`}
            style={{
              textShadow: "1px 1px 0 rgba(139, 90, 43, 0.2)",
            }}
          >
            &#9888; {wantedData.danger_level} &#9888;
          </p>
        </div>

        <StarDecoration />

        {/* 현상금 */}
        <div className="relative z-10 text-center mb-4">
          <p className="text-xl tracking-[0.2em] text-amber-900/80 mb-2">
            - REWARD -
          </p>
          <p
            className="text-4xl md:text-5xl font-bold text-red-800"
            style={{
              textShadow: "2px 2px 0 rgba(139, 90, 43, 0.4)",
            }}
          >
            {formatBounty(wantedData.bounty)}
          </p>
        </div>

        {/* 푸터 정보 */}
        <div className={`${typewriterFont.className} relative z-10 text-center text-xs text-amber-900/70 mt-6 space-y-1`}>
          <p>
            BORN: {user_info.year}.{String(user_info.month).padStart(2, "0")}.{String(user_info.day).padStart(2, "0")}
            {" / "}
            {user_info.gender === "male" ? "MALE" : "FEMALE"}
          </p>
          <p className="tracking-widest mt-2">{posterNumber}</p>
          <p className="italic mt-2">
            "Personality cannot be hidden."
          </p>
        </div>

        {/* 하단 장식 */}
        <div className="text-center mt-4 relative z-10">
          <p className="text-xs text-amber-900/50 tracking-[0.3em]">
            DESTINY SHERIFF DEPT.
          </p>
        </div>
      </div>
    </div>
  );
}
