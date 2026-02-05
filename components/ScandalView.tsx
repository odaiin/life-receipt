"use client";

import { useState } from "react";

interface ScandalTheme {
  celebrity_name: string;
  celebrity_mbti: string;
  celebrity_keyword: string;
  celebrity_birthdate: string;
  celebrity_image_query: string;
  compatibility_score: number;
  match_reason: string;
  article_reasons: string[];
  celebrity_main_element: string;
  headline: string;
  article_body: string;
}

interface SajuAnalysis {
  day_master: string;
  day_master_korean: string;
  day_master_element: string;
  main_trait: string;
  main_trait_korean: string;
}

interface AnalyzeResponse {
  user_info: {
    year: number;
    month: number;
    day: number;
    mbti: string;
    gender: string;
  };
  saju_analysis: SajuAnalysis;
  theme_data?: {
    scandal?: ScandalTheme;
  };
}

interface ScandalViewProps {
  data: AnalyzeResponse;
}

// 궁합 점수에 따른 등급
const getCompatibilityGrade = (score: number) => {
  if (score >= 90) return { grade: "S", label: "천생연분", color: "text-pink-500" };
  if (score >= 80) return { grade: "A", label: "찰떡궁합", color: "text-red-500" };
  if (score >= 70) return { grade: "B", label: "좋은 인연", color: "text-orange-500" };
  if (score >= 60) return { grade: "C", label: "발전 가능", color: "text-yellow-500" };
  return { grade: "D", label: "노력 필요", color: "text-gray-500" };
};

// 오행 한글 변환
const elementToKorean = (element: string) => {
  const map: { [key: string]: string } = {
    Wood: "목(木)", Fire: "화(火)", Earth: "토(土)",
    Metal: "금(金)", Water: "수(水)", Unknown: "?",
  };
  return map[element] || element;
};

export default function ScandalView({ data }: ScandalViewProps) {
  const { user_info, saju_analysis, theme_data } = data;
  const scandal = theme_data?.scandal;
  const [showDetails, setShowDetails] = useState(false);

  if (!scandal) {
    return <div className="text-white text-center p-8">스캔들 데이터 로딩 중...</div>;
  }

  const grade = getCompatibilityGrade(scandal.compatibility_score);
  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="max-w-lg mx-auto">
      {/* 뉴스 카드 */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
        {/* 헤더 - DESTINY 로고 */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-2xl tracking-wider">
                DESTINY
              </span>
              <span className="bg-yellow-400 text-red-700 text-xs font-bold px-2 py-0.5 rounded">
                EXCLUSIVE
              </span>
            </div>
            <span className="text-white/80 text-xs">{dateStr}</span>
          </div>
        </div>

        {/* 속보 배너 */}
        <div className="bg-red-500 text-white text-center py-1 text-sm font-bold animate-pulse">
          BREAKING NEWS
        </div>

        {/* 메인 헤드라인 */}
        <div className="px-4 py-4 border-b border-gray-200">
          <h1 className="text-xl font-black text-gray-900 leading-tight">
            {scandal.headline}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            속보 | 연예 | 궁합분석
          </p>
        </div>

        {/* 메인 이미지 영역 - 커플 매칭 */}
        <div className="px-4 py-6 bg-gradient-to-b from-pink-50 to-white">
          <div className="flex items-center justify-center gap-4">
            {/* 사용자 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-3xl">
                  {user_info.gender === "male" ? "👨" : "👩"}
                </span>
              </div>
              <p className="mt-2 font-bold text-gray-800">YOU</p>
              <p className="text-xs text-gray-500">{user_info.mbti}</p>
            </div>

            {/* 하트 애니메이션 */}
            <div className="flex flex-col items-center">
              <div className="text-4xl animate-pulse">💕</div>
              <div className={`text-2xl font-black ${grade.color} mt-1`}>
                {scandal.compatibility_score}%
              </div>
              <div className={`text-xs font-bold ${grade.color}`}>
                {grade.label}
              </div>
            </div>

            {/* 연예인 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center shadow-lg relative overflow-hidden">
                <span className="text-white text-3xl">⭐</span>
                {/* 스파클 효과 */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
              <p className="mt-2 font-bold text-gray-800">{scandal.celebrity_name}</p>
              <p className="text-xs text-gray-500">{scandal.celebrity_keyword}</p>
            </div>
          </div>

          {/* 궁합 점수 바 */}
          <div className="mt-6 px-4">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 via-red-500 to-pink-400 rounded-full transition-all duration-1000"
                style={{ width: `${scandal.compatibility_score}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span className="font-bold text-red-500">궁합 지수</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* 기사 본문 */}
        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-gray-700 text-sm leading-relaxed">
            {scandal.article_body}
          </p>

          {/* 매칭 이유 */}
          <div className="mt-4 p-3 bg-pink-50 rounded-lg">
            <p className="text-pink-600 font-bold text-sm mb-2">
              💘 궁합 분석 결과
            </p>
            <ul className="space-y-1">
              {scandal.article_reasons.map((reason, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-pink-500">✓</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 상세 정보 토글 */}
        <div className="px-4 py-3 border-t border-gray-100">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-center text-sm text-gray-500 hover:text-red-500 transition"
          >
            {showDetails ? "상세 정보 접기 ▲" : "상세 정보 보기 ▼"}
          </button>
        </div>

        {/* 상세 정보 */}
        {showDetails && (
          <div className="px-4 py-4 bg-gray-50 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* 사용자 정보 */}
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-gray-500 text-xs mb-2">👤 내 정보</p>
                <p className="font-bold text-gray-800">MBTI: {user_info.mbti}</p>
                <p className="text-gray-600">
                  일간: {saju_analysis.day_master_korean}
                </p>
                <p className="text-gray-600">
                  주 오행: {saju_analysis.main_trait_korean}
                </p>
              </div>

              {/* 연예인 정보 */}
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-gray-500 text-xs mb-2">⭐ 상대 정보</p>
                <p className="font-bold text-gray-800">
                  {scandal.celebrity_name}
                </p>
                <p className="text-gray-600">MBTI: {scandal.celebrity_mbti}</p>
                <p className="text-gray-600">
                  주 오행: {elementToKorean(scandal.celebrity_main_element)}
                </p>
              </div>
            </div>

            {/* 이미지 검색 링크 */}
            <div className="mt-4 text-center">
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(scandal.celebrity_name)}&tbm=isch`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gray-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                📷 {scandal.celebrity_name} 이미지 검색
              </a>
            </div>
          </div>
        )}

        {/* 푸터 - 경고문 */}
        <div className="px-4 py-3 bg-gray-100 text-center">
          <p className="text-gray-400 text-xs">
            ※ 본 기사는 재미를 위한 가상의 콘텐츠입니다.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            DESTINY NEWS | life-receipt-store.netlify.app
          </p>
        </div>
      </div>
    </div>
  );
}
