"use client";

import { Gowun_Batang } from "next/font/google";
import { useMemo } from "react";

// Google Fonts - 붓글씨 느낌
const brushFont = Gowun_Batang({
  weight: ["400", "700"],
  subsets: ["latin"],
  preload: false,
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

interface JoseonViewProps {
  data: AnalyzeResponse;
}

// 신분 데이터베이스
const CLASS_DB: Record<string, { class: string; classHanja: string; desc: string }> = {
  ENTJ: { class: "왕족", classHanja: "王族", desc: "명을 내리는 것이 일상" },
  ESTJ: { class: "양반", classHanja: "兩班", desc: "규칙으로 세상을 다스림" },
  ENFJ: { class: "정승", classHanja: "政丞", desc: "백성을 돌보는 큰 그릇" },
  ESFJ: { class: "내명부", classHanja: "內命婦", desc: "집안 살림의 중심" },
  ENTP: { class: "책사", classHanja: "策士", desc: "혀 하나로 천하를 움직임" },
  INTP: { class: "선비", classHanja: "士", desc: "방구석에서 세상 이치를 꿰뚫음" },
  INTJ: { class: "도사", classHanja: "道士", desc: "산중에서 홀로 깨달음을 얻음" },
  INFJ: { class: "무당", classHanja: "巫堂", desc: "보이지 않는 것을 봄" },
  ESTP: { class: "의적", classHanja: "義賊", desc: "행동이 생각보다 빠름" },
  ISTP: { class: "대장장이", classHanja: "冶匠", desc: "손재주로 먹고 삶" },
  ESFP: { class: "광대", classHanja: "廣大", desc: "흥으로 세상을 밝힘" },
  ISFP: { class: "화공", classHanja: "畫工", desc: "아름다움을 창조함" },
  ENFP: { class: "떠돌이 약장수", classHanja: "賣藥", desc: "말로 사람을 홀림" },
  INFP: { class: "은둔 시인", classHanja: "隱詩", desc: "속세를 등지고 풍류를 즐김" },
  ISTJ: { class: "관리", classHanja: "官吏", desc: "문서로 나라를 지킴" },
  ISFJ: { class: "농부", classHanja: "農夫", desc: "묵묵히 땅을 일굼" },
};

// 특기 데이터베이스
const SKILL_DB: Record<string, string[]> = {
  Wood: ["활쏘기", "목공", "농사짓기"],
  Fire: ["불 피우기", "연설", "칼춤"],
  Earth: ["농사", "땅 파기", "중재"],
  Metal: ["대장간 일", "칼 갈기", "재물 세기"],
  Water: ["점 보기", "낚시", "밤에 안 자기"],
};

// 오행 별 성품
const ELEMENT_TRAIT: Record<string, string> = {
  Wood: "곧은 성품이나 고집이 세다",
  Fire: "열정이 넘치나 화를 잘 낸다",
  Earth: "믿음직하나 느릿느릿하다",
  Metal: "결단력이 있으나 차갑다",
  Water: "지혜로우나 걱정이 많다",
};

export default function JoseonView({ data }: JoseonViewProps) {
  const { user_info, saju_analysis } = data;

  // 호패 번호
  const hopaeBeon = useMemo(() => {
    const chars = "甲乙丙丁戊己庚辛壬癸";
    const num = Math.floor(Math.random() * 9999) + 1;
    const char = chars[Math.floor(Math.random() * chars.length)];
    return `${char}字 第${num}號`;
  }, []);

  // 신분 결정
  const classInfo = CLASS_DB[user_info.mbti] || CLASS_DB["INTP"];

  // 특기 선택
  const skills = useMemo(() => {
    const element = saju_analysis.main_trait;
    const skillList = SKILL_DB[element] || SKILL_DB["Earth"];
    return skillList[Math.floor(Math.random() * skillList.length)];
  }, [saju_analysis.main_trait]);

  // 성품
  const trait = ELEMENT_TRAIT[saju_analysis.main_trait] || ELEMENT_TRAIT["Earth"];

  // 나이 계산 (조선식: 태어나면 1살)
  const age = new Date().getFullYear() - user_info.year + 1;

  return (
    <div className={`${brushFont.className} relative max-w-sm mx-auto`}>
      {/* 낡은 한지 배경 */}
      <div
        className="relative p-6"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(139, 90, 43, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(139, 90, 43, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #f5e6c8 0%, #e8d4a8 25%, #f0dbb8 50%, #e5d0a0 75%, #f2dfc0 100%)
          `,
          boxShadow: `
            inset 0 0 60px rgba(139, 90, 43, 0.15),
            0 4px 20px rgba(0, 0, 0, 0.2)
          `,
        }}
      >
        {/* 이중 테두리 (전통 문양 느낌) */}
        <div className="absolute inset-3 border-4 border-double border-amber-900/40 pointer-events-none" />
        <div className="absolute inset-5 border border-amber-900/20 pointer-events-none" />

        {/* 상단 호패 박스 */}
        <div className="absolute top-6 right-6 bg-amber-950/90 text-amber-100 px-3 py-2 transform rotate-3">
          <p className="text-xs">號牌</p>
          <p className="text-sm font-bold tracking-wider">{hopaeBeon}</p>
        </div>

        {/* 타이틀 */}
        <div className="text-center mb-6 relative z-10">
          <h1 className="text-4xl font-bold text-amber-900 tracking-[0.3em]">
            戶籍
          </h1>
          <p className="text-lg text-amber-800/80 mt-1">호 적</p>
          <div className="mt-2 flex justify-center gap-2">
            <span className="text-amber-700">~ 身分 證明 ~</span>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t-2 border-amber-900/30 my-4" />

        {/* 신분 대형 표시 */}
        <div className="text-center my-6 relative z-10">
          <div className="inline-block border-4 border-amber-900/60 p-4 bg-amber-50/50">
            <p className="text-5xl font-bold text-amber-900 tracking-wider">
              {classInfo.classHanja}
            </p>
            <p className="text-2xl text-amber-800 mt-2">{classInfo.class}</p>
          </div>
          <p className="text-sm text-amber-700/80 mt-3 italic">
            "{classInfo.desc}"
          </p>
        </div>

        {/* 정보 그리드 (세로쓰기 느낌) */}
        <div className="grid grid-cols-2 gap-4 my-6 relative z-10">
          <div className="text-right pr-4 border-r border-amber-900/30">
            <p className="text-sm text-amber-700">生年</p>
            <p className="text-xl text-amber-900">{user_info.year}年生</p>
          </div>
          <div className="text-left pl-4">
            <p className="text-sm text-amber-700">年歲</p>
            <p className="text-xl text-amber-900">{age}歲</p>
          </div>
          <div className="text-right pr-4 border-r border-amber-900/30">
            <p className="text-sm text-amber-700">性別</p>
            <p className="text-xl text-amber-900">
              {user_info.gender === "male" ? "男子" : "女子"}
            </p>
          </div>
          <div className="text-left pl-4">
            <p className="text-sm text-amber-700">氣質</p>
            <p className="text-xl text-amber-900">{user_info.mbti}</p>
          </div>
        </div>

        {/* 사주 정보 */}
        <div className="my-6 relative z-10">
          <p className="text-center text-sm text-amber-700 mb-2">四柱 八字</p>
          <div className="flex justify-center gap-3">
            {[
              { label: "年", pillar: saju_analysis.year_pillar },
              { label: "月", pillar: saju_analysis.month_pillar },
              { label: "日", pillar: saju_analysis.day_pillar },
              { label: "時", pillar: saju_analysis.hour_pillar },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-xs text-amber-600">{item.label}</p>
                <div className="border border-amber-900/40 p-1 bg-amber-50/30">
                  <p className="text-lg text-amber-900">
                    {item.pillar ? `${item.pillar.stem}${item.pillar.branch}` : "??"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t-2 border-amber-900/30 my-4" />

        {/* 특기 & 성품 */}
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between items-center">
            <span className="text-amber-700">特技 (특기)</span>
            <span className="text-lg text-amber-900 font-bold">{skills}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-amber-700">性品 (성품)</span>
            <span className="text-sm text-amber-900 max-w-[180px] text-right">{trait}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-amber-700">主氣 (주기)</span>
            <span className="text-lg text-amber-900">{saju_analysis.main_trait_korean}</span>
          </div>
        </div>

        {/* 하단 관인 */}
        <div className="mt-8 text-center relative z-10">
          <div className="inline-block border-2 border-red-800 p-2 transform rotate-[-5deg]">
            <p className="text-red-800 text-sm">漢城府</p>
            <p className="text-red-800 text-xs">確認印</p>
          </div>
        </div>

        {/* 푸터 */}
        <div className="mt-4 text-center text-xs text-amber-700/60 relative z-10">
          <p>此 文書는 娛樂用이며 實際 效力이 없음</p>
          <p className="mt-1">朝鮮 運命府 發給</p>
        </div>
      </div>
    </div>
  );
}
