"use client";

import { Press_Start_2P } from "next/font/google";
import { useMemo } from "react";

// Google Fonts - 픽셀 폰트
const pixelFont = Press_Start_2P({
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
}

interface LoveViewProps {
  data: AnalyzeResponse;
}

// 공략 난이도 데이터
const DIFFICULTY_DB: Record<string, number> = {
  INTJ: 5, INTP: 5, INFJ: 5, ISTP: 4,
  ENTJ: 4, ISTJ: 4, INFP: 4, ISFP: 3,
  ENTP: 3, ENFJ: 3, ISFJ: 3, ESTP: 2,
  ENFP: 2, ESFJ: 2, ESFP: 1, ESTJ: 2,
};

// 공략 팁 데이터베이스
const TIP_DB: Record<string, string[]> = {
  ENTP: ["논쟁에서 일부러 져주면 호감 UP", "새로운 아이디어를 던져주세요", "지루하면 바로 도망갑니다"],
  ENTJ: ["능력을 보여주면 관심 상승", "효율적인 데이트 코스 필수", "칭찬보다 인정이 중요"],
  ENFP: ["관심을 많이 주세요!! 많이!!", "즉흥 이벤트 = 호감 폭발", "3일 안에 고백 타이밍 잡기"],
  ENFJ: ["고민 상담 들어주기", "선물보다 진심 어린 말 한마디", "다른 사람 칭찬하면 질투함"],
  INTP: ["혼자 있는 시간 존중하기", "지적 대화로 어필", "감정 표현 강요 금지"],
  INTJ: ["먼저 다가가야 합니다", "쓸데없는 잡담 자제", "장기 계획을 함께 세우기"],
  INFP: ["감성적인 선물 효과 만점", "이상과 꿈을 응원해주기", "상처 주면 영원히 기억함"],
  INFJ: ["속마음을 먼저 보여주기", "1:1 대화를 선호합니다", "문 닫히면 끝... 조심!"],
  ESTP: ["스릴 넘치는 데이트 추천", "행동으로 보여주세요", "잔소리 = 게임 오버"],
  ESTJ: ["약속은 무조건 지키기", "명확한 의사표현 필수", "칭찬하면 의외로 약함"],
  ESFP: ["파티나 모임에 함께 가기", "즐거운 분위기 유지", "먹을 걸 주면 조용해짐"],
  ESFJ: ["가족과 친구 소개받으면 승리", "기념일 절대 잊지 마세요", "칭찬 많이, 관심 많이!"],
  ISTP: ["취미 존중이 핵심", "간섭하지 않기", "행동으로 진심 표현하기"],
  ISTJ: ["신뢰가 최우선", "일관된 모습 보여주기", "급작스러운 변화 금지"],
  ISFP: ["예술적 감각 인정해주기", "조용한 데이트 선호", "강요하면 도망갑니다"],
  ISFJ: ["진심 어린 감사 표현", "안정적인 모습 어필", "가끔은 리드해주세요"],
};

// 특성 데이터
const TRAIT_DB: Record<string, { charm: string; weakness: string }> = {
  ENTP: { charm: "말빨 + 재치", weakness: "오래 못 붙잡음" },
  ENTJ: { charm: "카리스마", weakness: "무서움" },
  ENFP: { charm: "밝은 에너지", weakness: "변덕" },
  ENFJ: { charm: "따뜻한 배려", weakness: "오지랖" },
  INTP: { charm: "신비로움", weakness: "연락두절" },
  INTJ: { charm: "똑똒함", weakness: "냉정함" },
  INFP: { charm: "순수함", weakness: "현실도피" },
  INFJ: { charm: "깊은 공감", weakness: "문닫기" },
  ESTP: { charm: "자유로움", weakness: "바람끼(?)" },
  ESTJ: { charm: "듬직함", weakness: "꼰대력" },
  ESFP: { charm: "Fun Fun!", weakness: "계획 없음" },
  ESFJ: { charm: "살림 능력", weakness: "눈치 집착" },
  ISTP: { charm: "쿨함", weakness: "말수 적음" },
  ISTJ: { charm: "신뢰감", weakness: "재미없음" },
  ISFP: { charm: "감성", weakness: "우유부단" },
  ISFJ: { charm: "헌신", weakness: "자기희생" },
};

// 호감도 바 컴포넌트
function LoveMeter({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-2xl ${i <= level ? "text-pink-500" : "text-gray-400"}`}
          style={{ textShadow: i <= level ? "0 0 10px rgba(236, 72, 153, 0.5)" : "none" }}
        >
          {i <= level ? "♥" : "♡"}
        </span>
      ))}
    </div>
  );
}

// 대화창 컴포넌트
function DialogBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-white border-4 border-pink-400 rounded-lg p-4 shadow-lg">
      {/* 픽셀 코너 장식 */}
      <div className="absolute -top-1 -left-1 w-3 h-3 bg-pink-400" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-400" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-pink-400" />
      {children}
    </div>
  );
}

export default function LoveView({ data }: LoveViewProps) {
  const { user_info, saju_analysis } = data;

  // 공략 난이도
  const difficulty = DIFFICULTY_DB[user_info.mbti] || 3;

  // 공략 팁 선택
  const tips = useMemo(() => {
    const tipList = TIP_DB[user_info.mbti] || TIP_DB["ENTP"];
    return tipList[Math.floor(Math.random() * tipList.length)];
  }, [user_info.mbti]);

  // 특성
  const traits = TRAIT_DB[user_info.mbti] || TRAIT_DB["ENTP"];

  // 초기 호감도 (랜덤)
  const initialLove = useMemo(() => Math.floor(Math.random() * 3) + 1, []);

  // 나이
  const age = new Date().getFullYear() - user_info.year;

  return (
    <div className={`${pixelFont.className} relative max-w-sm mx-auto`}>
      {/* 하트 배경 패턴 */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: `
            repeating-linear-gradient(
              45deg,
              #fce7f3 0px,
              #fce7f3 10px,
              #fbcfe8 10px,
              #fbcfe8 20px
            )
          `,
          boxShadow: "0 4px 20px rgba(236, 72, 153, 0.3)",
        }}
      >
        {/* 게임 UI 프레임 */}
        <div className="bg-pink-200 border-4 border-pink-500 rounded-lg p-4">
          {/* 상단 바 */}
          <div className="bg-gradient-to-r from-pink-400 to-purple-400 -mx-4 -mt-4 px-4 py-2 mb-4 rounded-t">
            <p className="text-white text-xs text-center tracking-wider">
              ♥ CHARACTER STATUS ♥
            </p>
          </div>

          {/* 캐릭터 정보 */}
          <div className="text-center mb-4">
            <div className="inline-block bg-white border-4 border-pink-400 p-4 rounded-lg">
              {/* MBTI 대형 표시 */}
              <p
                className="text-3xl text-pink-600 mb-1"
                style={{
                  textShadow: "2px 2px 0 #f9a8d4",
                }}
              >
                {user_info.mbti}
              </p>
              <p className="text-[8px] text-pink-400">
                {user_info.gender === "male" ? "♂ BOY" : "♀ GIRL"} / {age}세
              </p>
            </div>
          </div>

          {/* 호감도 미터 */}
          <div className="bg-white border-2 border-pink-300 rounded p-3 mb-4">
            <p className="text-[8px] text-pink-600 mb-2">LOVE METER</p>
            <div className="flex justify-center">
              <LoveMeter level={initialLove} />
            </div>
            <p className="text-[6px] text-pink-400 text-center mt-1">
              (현재 호감도: {initialLove * 20}%)
            </p>
          </div>

          {/* 스탯 바 */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[8px] text-pink-600 w-16">CHARM</span>
              <div className="flex-1 bg-pink-100 h-4 border border-pink-300 rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 to-pink-500"
                  style={{ width: "75%" }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] text-pink-600 w-16">MYSTERY</span>
              <div className="flex-1 bg-purple-100 h-4 border border-purple-300 rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-500"
                  style={{ width: `${difficulty * 18}%` }}
                />
              </div>
            </div>
          </div>

          {/* 공략 난이도 */}
          <div className="text-center mb-4">
            <p className="text-[8px] text-pink-600 mb-1">공략 난이도</p>
            <p className="text-yellow-500 text-lg">
              {"★".repeat(difficulty)}
              {"☆".repeat(5 - difficulty)}
            </p>
            <p className="text-[6px] text-pink-400">
              {difficulty >= 4 ? "HARD MODE" : difficulty >= 2 ? "NORMAL" : "EASY"}
            </p>
          </div>

          {/* 특성 */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-[8px]">
            <div className="bg-pink-50 border border-pink-200 p-2 rounded">
              <p className="text-pink-500">매력 포인트</p>
              <p className="text-pink-700">{traits.charm}</p>
            </div>
            <div className="bg-red-50 border border-red-200 p-2 rounded">
              <p className="text-red-500">주의 사항</p>
              <p className="text-red-700">{traits.weakness}</p>
            </div>
          </div>

          {/* 사주 기반 속성 */}
          <div className="bg-purple-50 border border-purple-200 p-2 rounded mb-4">
            <p className="text-[8px] text-purple-600 mb-1">히든 속성</p>
            <p className="text-[7px] text-purple-800">
              {saju_analysis.day_master_korean}({saju_analysis.day_master}) 일간 / {saju_analysis.main_trait_korean} 강화
            </p>
          </div>
        </div>

        {/* 대화창 - 공략 팁 */}
        <div className="mt-4">
          <DialogBox>
            <p className="text-[8px] text-pink-600 mb-2">♥ 공략 TIP ♥</p>
            <p className="text-[10px] text-gray-700 leading-relaxed">
              "{tips}"
            </p>
            <div className="mt-3 flex justify-end">
              <span className="text-[8px] text-pink-400 animate-pulse">
                ▶ CLICK TO CONTINUE
              </span>
            </div>
          </DialogBox>
        </div>

        {/* 하단 버튼 (장식용) */}
        <div className="mt-4 flex justify-center gap-2">
          <button className="bg-pink-400 hover:bg-pink-500 text-white text-[8px] px-4 py-2 rounded border-b-4 border-pink-600 active:border-b-0 active:mt-1 transition-all">
            SAVE
          </button>
          <button className="bg-purple-400 hover:bg-purple-500 text-white text-[8px] px-4 py-2 rounded border-b-4 border-purple-600 active:border-b-0 active:mt-1 transition-all">
            LOAD
          </button>
        </div>

        {/* 푸터 */}
        <p className="text-center text-[6px] text-pink-400 mt-4">
          ♥ DESTINY LOVE SIM v1.0 ♥
        </p>
      </div>
    </div>
  );
}
