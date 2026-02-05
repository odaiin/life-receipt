"use client";

interface PastLifeData {
  era: string;
  era_year: string;
  location: string;
  existence: string;
  identity: string;
  story: string;
  death_cause: string;
  karma: string;
  special_ability: string;
}

interface AnalyzeResponse {
  user_info: {
    year: number;
    month: number;
    day: number;
    mbti: string;
    gender: string;
  };
  saju_analysis: {
    day_master: string;
    day_master_korean: string;
    day_master_element: string;
    main_trait: string;
    main_trait_korean: string;
  };
  theme_data?: {
    pastlife?: PastLifeData;
  };
}

interface PastLifeViewProps {
  data: AnalyzeResponse;
}

// 존재 형태별 이모지
const existenceEmoji: Record<string, string> = {
  "인간": "👤",
  "동물": "🐾",
  "식물": "🌱",
  "음식": "🍞",
  "원소": "⚛️",
  "신화적 존재": "✨",
  "AI 로봇": "🤖",
  "미생물": "🦠",
};

// 시대별 배경색
const eraColors: Record<string, { bg: string; accent: string; text: string }> = {
  "고대 이집트": { bg: "from-amber-900 to-yellow-800", accent: "text-yellow-400", text: "text-amber-100" },
  "고대 로마": { bg: "from-red-900 to-orange-800", accent: "text-orange-300", text: "text-red-100" },
  "고대 그리스": { bg: "from-blue-900 to-cyan-800", accent: "text-cyan-300", text: "text-blue-100" },
  "중세 유럽": { bg: "from-gray-800 to-stone-700", accent: "text-stone-300", text: "text-gray-100" },
  "조선시대": { bg: "from-amber-800 to-yellow-700", accent: "text-yellow-300", text: "text-amber-100" },
  "에도시대 일본": { bg: "from-red-800 to-pink-700", accent: "text-pink-300", text: "text-red-100" },
  "당나라": { bg: "from-red-900 to-yellow-700", accent: "text-yellow-300", text: "text-red-100" },
  "선사시대": { bg: "from-green-900 to-lime-800", accent: "text-lime-300", text: "text-green-100" },
  "빅뱅 직후": { bg: "from-purple-900 to-indigo-900", accent: "text-purple-300", text: "text-indigo-100" },
  "그리스 신화시대": { bg: "from-indigo-800 to-purple-700", accent: "text-purple-300", text: "text-indigo-100" },
  "산업혁명기": { bg: "from-gray-900 to-zinc-800", accent: "text-zinc-300", text: "text-gray-100" },
  "1920년대": { bg: "from-zinc-800 to-neutral-700", accent: "text-amber-300", text: "text-zinc-100" },
  "공룡시대": { bg: "from-green-800 to-emerald-700", accent: "text-emerald-300", text: "text-green-100" },
  "18세기": { bg: "from-rose-900 to-pink-800", accent: "text-pink-300", text: "text-rose-100" },
  "미래": { bg: "from-cyan-900 to-blue-800", accent: "text-cyan-300", text: "text-blue-100" },
  "빙하기": { bg: "from-sky-900 to-blue-800", accent: "text-sky-300", text: "text-blue-100" },
  "1969년": { bg: "from-slate-900 to-gray-800", accent: "text-slate-300", text: "text-gray-100" },
};

export default function PastLifeView({ data }: PastLifeViewProps) {
  const { user_info, theme_data } = data;
  const pastlife = theme_data?.pastlife;

  if (!pastlife) {
    return <div className="text-white text-center p-8">전생 데이터 로딩 중...</div>;
  }

  const colors = eraColors[pastlife.era] || { bg: "from-purple-900 to-indigo-800", accent: "text-purple-300", text: "text-indigo-100" };
  const emoji = existenceEmoji[pastlife.existence] || "🌀";

  return (
    <div className="max-w-md mx-auto">
      {/* 메인 카드 */}
      <div className={`bg-gradient-to-br ${colors.bg} rounded-3xl overflow-hidden shadow-2xl`}>

        {/* 헤더 - 전생 기록부 */}
        <div className="bg-black/30 px-6 py-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">📜</span>
            <h1 className={`text-2xl font-bold ${colors.text} tracking-wider`}>
              전생 기록부
            </h1>
            <span className="text-3xl">🔮</span>
          </div>
          <p className={`text-sm ${colors.accent} mt-1`}>Past Life Archive</p>
        </div>

        {/* 시대/장소 배너 */}
        <div className="bg-black/20 px-6 py-4 border-y border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-xs ${colors.accent}`}>시대</p>
              <p className={`text-xl font-bold ${colors.text}`}>{pastlife.era}</p>
              <p className={`text-sm ${colors.text}/70`}>{pastlife.era_year}</p>
            </div>
            <div className="text-right">
              <p className={`text-xs ${colors.accent}`}>장소</p>
              <p className={`text-lg font-bold ${colors.text}`}>{pastlife.location}</p>
            </div>
          </div>
        </div>

        {/* 정체성 대형 표시 */}
        <div className="px-6 py-8 text-center">
          <div className="text-6xl mb-4">{emoji}</div>
          <div className={`inline-block px-4 py-1 rounded-full bg-white/20 ${colors.accent} text-sm mb-2`}>
            {pastlife.existence}
          </div>
          <h2 className={`text-2xl font-black ${colors.text} mt-2`}>
            {pastlife.identity}
          </h2>
        </div>

        {/* 스토리 박스 */}
        <div className="px-6 pb-6">
          <div className="bg-black/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📖</span>
              <h3 className={`font-bold ${colors.accent}`}>당신의 전생 이야기</h3>
            </div>
            <p className={`text-sm ${colors.text}/90 leading-relaxed`}>
              {pastlife.story}
            </p>
          </div>
        </div>

        {/* 사망 원인 */}
        <div className="px-6 pb-6">
          <div className="bg-red-900/40 rounded-xl p-4 border border-red-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💀</span>
              <h3 className="font-bold text-red-300 text-sm">사망 원인</h3>
            </div>
            <p className="text-red-100 text-sm">{pastlife.death_cause}</p>
          </div>
        </div>

        {/* 카르마 & 능력 그리드 */}
        <div className="px-6 pb-6 grid grid-cols-1 gap-4">
          {/* 카르마 */}
          <div className="bg-purple-900/40 rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🔄</span>
              <h3 className="font-bold text-purple-300 text-sm">현생에 미치는 업보</h3>
            </div>
            <p className="text-purple-100 text-sm">{pastlife.karma}</p>
          </div>

          {/* 특수 능력 */}
          <div className="bg-yellow-900/40 rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚡</span>
              <h3 className="font-bold text-yellow-300 text-sm">전생에서 가져온 능력</h3>
            </div>
            <p className="text-yellow-100 text-sm">{pastlife.special_ability}</p>
          </div>
        </div>

        {/* 사용자 정보 */}
        <div className="px-6 pb-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex justify-between items-center text-sm">
              <div className={colors.text}>
                <span className="opacity-60">현생: </span>
                {user_info.year}년생 / {user_info.mbti}
              </div>
              <div className={colors.accent}>
                {user_info.gender === "male" ? "♂" : "♀"}
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="bg-black/40 px-6 py-4 text-center">
          <p className={`text-xs ${colors.text}/50`}>
            ※ 본 기록은 우주 아카식 레코드에서 추출한 재미용 데이터입니다
          </p>
          <p className={`text-xs ${colors.accent}/70 mt-1`}>
            🌌 Past Life Archive System v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
