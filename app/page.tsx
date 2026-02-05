"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, RotateCcw, Download, Home as HomeIcon, X } from "lucide-react";
import html2canvas from "html2canvas";
import ReceiptView from "@/components/ReceiptView";
import WantedView from "@/components/WantedView";
import HospitalView from "@/components/HospitalView";
import PastLifeView from "@/components/PastLifeView";
import LoveView from "@/components/LoveView";
import MemeView from "@/components/MemeView";
import ChartView from "@/components/ChartView";
import ScandalView from "@/components/ScandalView";

// ==================== 타입 정의 ====================

interface SajuAnalysis {
  year_pillar: { stem: string; branch: string; stem_korean: string; branch_korean: string };
  month_pillar: { stem: string; branch: string; stem_korean: string; branch_korean: string };
  day_pillar: { stem: string; branch: string; stem_korean: string; branch_korean: string };
  hour_pillar: { stem: string; branch: string; stem_korean: string; branch_korean: string } | null;
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

interface ReceiptItem {
  name: string;
  price: number;
}

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

interface HospitalTheme {
  diseases: string[];
  prescriptions: string[];
  severity: string;
}

interface PastLifeTheme {
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

interface LoveTheme {
  difficulty: number;
  charm: string;
  weakness: string;
  tips: string[];
}

interface MemeTheme {
  image: string;
  text_top: string;
  text_bottom: string;
}

interface ChartDataPoint {
  age: string;
  wealth: number;
  wealth_event: string | null;
  love: number;
  love_event: string | null;
}

interface ChartTheme {
  data: ChartDataPoint[];
  wealth_pattern: string;
  wealth_pattern_korean: string;
  love_pattern: string;
  love_pattern_korean: string;
  wealth_peak_age: string;
  wealth_peak_event: string;
  wealth_low_age: string;
  wealth_low_event: string;
  love_peak_age: string;
  love_peak_event: string;
  love_low_age: string;
  love_low_event: string;
}

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

interface ThemeData {
  receipt: {
    items: ReceiptItem[];
    total: number;
  };
  wanted: WantedTheme;
  hospital: HospitalTheme;
  pastlife: PastLifeTheme;
  love: LoveTheme;
  meme: MemeTheme;
  chart: ChartTheme;
  scandal: ScandalTheme;
}

interface RankInfo {
  grade: string;
  title: string;
  title_korean: string;
  color: string;
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
  receipt_items: ReceiptItem[];
  total_price: number;
  theme_data?: ThemeData;
  rank?: RankInfo;
}

// ==================== 입력 기록 타입 ====================

interface InputHistory {
  birthDate: string;
  birthTime: string;
  gender: string;
  mbti: string;
  timestamp: number;
}

const HISTORY_KEY = "saju_input_history";
const MAX_HISTORY = 3;

// ==================== 테마 설정 ====================

type ThemeType = "receipt" | "wanted" | "hospital" | "pastlife" | "love" | "meme" | "chart" | "scandal";

const THEME_CONFIG = {
  receipt: { label: "영수증", icon: "🧾", bg: "bg-gray-200", btnColor: "bg-gray-800" },
  wanted: { label: "현상수배", icon: "🤠", bg: "bg-amber-100", btnColor: "bg-amber-700" },
  hospital: { label: "진단서", icon: "🏥", bg: "bg-slate-100", btnColor: "bg-slate-600" },
  pastlife: { label: "전생", icon: "🔮", bg: "bg-purple-100", btnColor: "bg-purple-800" },
  love: { label: "미연시", icon: "💖", bg: "bg-pink-100", btnColor: "bg-pink-500" },
  meme: { label: "짤방", icon: "😂", bg: "bg-purple-100", btnColor: "bg-purple-600" },
  chart: { label: "인생차트", icon: "📈", bg: "bg-slate-900", btnColor: "bg-cyan-600" },
  scandal: { label: "스캔들", icon: "📰", bg: "bg-red-50", btnColor: "bg-red-600" },
};

// ==================== 서브 컴포넌트 ====================

// MBTI 토글 버튼 (모던 스타일)
function MbtiToggle({
  options,
  selected,
  onSelect,
  type,
}: {
  options: [string, string];
  selected: string;
  onSelect: (value: string) => void;
  type: "ei" | "ns" | "tf" | "pj";
}) {
  const labels: Record<string, Record<string, string>> = {
    ei: { E: "외향 (E)", I: "내향 (I)" },
    ns: { N: "직관 (N)", S: "감각 (S)" },
    tf: { T: "사고 (T)", F: "감정 (F)" },
    pj: { P: "인식 (P)", J: "판단 (J)" },
  };

  return (
    <div className="flex gap-3">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`mbti-card mbti-${type} ${selected === option ? "active" : "inactive"}`}
        >
          {labels[type][option]}
        </button>
      ))}
    </div>
  );
}

// 성별 토글 버튼 (모던 스타일)
function GenderToggle({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onSelect("male")}
        className={`gender-btn ${selected === "male" ? "active male" : "inactive"}`}
      >
        👨 남성
      </button>
      <button
        type="button"
        onClick={() => onSelect("female")}
        className={`gender-btn ${selected === "female" ? "active female" : "inactive"}`}
      >
        👩 여성
      </button>
    </div>
  );
}

// ==================== 메인 컴포넌트 ====================

export default function Home() {
  // 폼 상태
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [gender, setGender] = useState("male");

  // MBTI 상태
  const [mbtiEI, setMbtiEI] = useState("E");
  const [mbtiNS, setMbtiNS] = useState("N");
  const [mbtiTF, setMbtiTF] = useState("T");
  const [mbtiPJ, setMbtiPJ] = useState("P");

  // UI 상태
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeType>("receipt");

  // Ref
  const contentRef = useRef<HTMLDivElement>(null);

  // 최근 기록 상태
  const [historyList, setHistoryList] = useState<InputHistory[]>([]);

  // MBTI 조합
  const mbti = `${mbtiEI}${mbtiNS}${mbtiTF}${mbtiPJ}`;

  // localStorage에서 기록 불러오기
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistoryList(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  // 기록 저장 함수
  const saveToHistory = (data: Omit<InputHistory, "timestamp">) => {
    try {
      const newEntry: InputHistory = { ...data, timestamp: Date.now() };

      // 중복 제거 (같은 birthDate + mbti)
      let updated = historyList.filter(
        (h) => !(h.birthDate === data.birthDate && h.mbti === data.mbti)
      );

      // 최신을 앞에 추가
      updated = [newEntry, ...updated].slice(0, MAX_HISTORY);

      setHistoryList(updated);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  };

  // 기록 삭제 함수
  const deleteHistory = (timestamp: number) => {
    try {
      const updated = historyList.filter((h) => h.timestamp !== timestamp);
      setHistoryList(updated);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to delete history:", e);
    }
  };

  // 기록에서 폼 채우기
  const loadFromHistory = (history: InputHistory) => {
    setBirthDate(history.birthDate);
    setBirthTime(history.birthTime);
    setGender(history.gender);
    // MBTI 분해
    if (history.mbti.length === 4) {
      setMbtiEI(history.mbti[0]);
      setMbtiNS(history.mbti[1]);
      setMbtiTF(history.mbti[2]);
      setMbtiPJ(history.mbti[3]);
    }
  };

  // 생년월일 자동 포맷팅 핸들러
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // 숫자만 추출
    const numbersOnly = input.replace(/\D/g, "");

    // 최대 8자리 (YYYYMMDD)
    const limited = numbersOnly.slice(0, 8);

    // 포맷팅 적용
    let formatted = "";
    if (limited.length <= 4) {
      formatted = limited;
    } else if (limited.length <= 6) {
      formatted = `${limited.slice(0, 4)}.${limited.slice(4)}`;
    } else {
      formatted = `${limited.slice(0, 4)}.${limited.slice(4, 6)}.${limited.slice(6)}`;
    }

    setBirthDate(formatted);
  };

  // 폼 제출 핸들러 (테마 선택과 함께)
  const handleSubmitWithTheme = async (theme: ThemeType) => {
    setError(null);

    if (!birthDate) {
      setError("생년월일을 입력해주세요.");
      return;
    }

    // 날짜 형식 검증 (YYYY.MM.DD)
    const dateNumbers = birthDate.replace(/\D/g, "");
    if (dateNumbers.length !== 8) {
      setError("생년월일 8자리를 모두 입력해주세요. (예: 19980505)");
      return;
    }

    const [year, month, day] = birthDate.split(".").map(Number);

    // 유효성 검사
    if (month < 1 || month > 12) {
      setError("월은 1~12 사이여야 합니다.");
      return;
    }
    if (day < 1 || day > 31) {
      setError("일은 1~31 사이여야 합니다.");
      return;
    }

    let hour = 0;
    let minute = 0;
    if (birthTime) {
      [hour, minute] = birthTime.split(":").map(Number);
    }

    // 기록 저장
    saveToHistory({ birthDate, birthTime, gender, mbti });

    setIsLoading(true);
    setCurrentTheme(theme); // 선택한 테마로 설정

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, month, day, hour, minute, gender, mbti }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "분석 중 오류가 발생했습니다.");
      }

      const data: AnalyzeResponse = await response.json();
      setAnalysisData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "서버 연결에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 이미지 다운로드 핸들러
  const handleDownloadImage = async () => {
    if (!contentRef.current) return;
    setIsSaving(true);

    try {
      const themeConfig = THEME_CONFIG[currentTheme];
      const bgColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--tw-bg-opacity") || "#e5e5e5";

      const bgColors: Record<ThemeType, string> = {
        receipt: "#e5e5e5",
        wanted: "#fef3c7",
        hospital: "#f1f5f9",
        pastlife: "#1e1b4b",
        love: "#fce7f3",
        meme: "#f3e8ff",
        chart: "#0f172a",
        scandal: "#fef2f2",
      };

      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: bgColors[currentTheme],
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imageUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageUrl;

      const fileNames: Record<ThemeType, string> = {
        receipt: "life-receipt.png",
        wanted: "wanted-poster.png",
        hospital: "diagnosis-report.png",
        pastlife: "pastlife-record.png",
        love: "love-status.png",
        meme: "my-life-meme.png",
        chart: "life-chart.png",
        scandal: "scandal-news.png",
      };
      link.download = fileNames[currentTheme];
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("이미지 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 처음으로 (리셋)
  const handleReset = () => {
    setAnalysisData(null);
    setError(null);
    setCurrentTheme("receipt");
  };

  // ==================== 결과 화면 (Result View) ====================
  if (analysisData) {
    const themeConfig = THEME_CONFIG[currentTheme];
    const { user_info, saju_analysis } = analysisData;

    return (
      <main className={`min-h-screen ${themeConfig.bg} transition-colors duration-300`}>
        {/* 상단 게스트 정보 바 */}
        <div className="bg-black/90 text-white py-3 px-4">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">GUEST</span>
              <span className="font-bold">{user_info.mbti}</span>
              <span className="text-gray-400">|</span>
              <span className="text-sm">
                {saju_analysis.day_master_korean}({saju_analysis.day_master})
              </span>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <HomeIcon className="w-4 h-4" />
              처음으로
            </button>
          </div>
        </div>

        {/* 테마 선택 탭 바 */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm py-3 px-4">
          <div className="max-w-md mx-auto">
            <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
              <div className="flex gap-2 min-w-max">
                {(Object.keys(THEME_CONFIG) as ThemeType[]).map((theme) => {
                  const config = THEME_CONFIG[theme];
                  const isActive = currentTheme === theme;
                  return (
                    <button
                      key={theme}
                      onClick={() => setCurrentTheme(theme)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold transition-all whitespace-nowrap text-sm ${
                        isActive
                          ? `${config.btnColor} text-white shadow-lg`
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <span>{config.icon}</span>
                      <span>{config.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="py-6 px-4">
          <div ref={contentRef} className="py-2 relative">
            {/* 등급 도장 */}
            {analysisData.rank && (
              <div className="stamp-container">
                <div className={`rank-stamp animate-shake stamp-${analysisData.rank.grade.toLowerCase()}`}>
                  <span className="rank-grade">{analysisData.rank.grade}</span>
                  <span className="rank-title">{analysisData.rank.title}</span>
                </div>
              </div>
            )}
            {currentTheme === "receipt" && <ReceiptView data={analysisData} />}
            {currentTheme === "wanted" && <WantedView data={analysisData} />}
            {currentTheme === "hospital" && <HospitalView data={analysisData} />}
            {currentTheme === "pastlife" && <PastLifeView data={analysisData} />}
            {currentTheme === "love" && <LoveView data={analysisData} />}
            {currentTheme === "meme" && <MemeView data={analysisData} />}
            {currentTheme === "chart" && <ChartView data={analysisData} />}
            {currentTheme === "scandal" && <ScandalView data={analysisData} />}
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 py-4 px-4">
          <div className="max-w-sm mx-auto flex gap-3">
            {/* 이미지 저장 */}
            <button
              onClick={handleDownloadImage}
              disabled={isSaving}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all disabled:opacity-50 ${themeConfig.btnColor} hover:opacity-90 active:scale-95`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  이미지 저장
                </>
              )}
            </button>

            {/* 다시 하기 */}
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="hidden sm:inline">다시하기</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ==================== 입력 화면 (Landing View) ====================
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex flex-col">
      {/* 히어로 헤더 */}
      <header className="flex-shrink-0 pt-12 pb-8 px-4">
        <div className="max-w-md mx-auto text-center">
          {/* 테마 아이콘 애니메이션 */}
          <div className="mb-6 flex justify-center gap-3 text-3xl float-animation">
            <span>🧾</span>
            <span>🤠</span>
            <span>🏥</span>
            <span>📜</span>
            <span>💖</span>
            <span>😂</span>
            <span>📈</span>
          </div>
          {/* 타이틀 */}
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-transparent bg-clip-text">
              사주 × MBTI
            </span>
          </h1>
          <p className="text-gray-500 text-base">
            당신의 운명을 7가지 테마로 분석합니다
          </p>
        </div>
      </header>

      {/* 입력 폼 */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 pb-8">
        <form className="space-y-6">
          {/* 생년월일 & 시간 카드 */}
          <div className="form-card space-y-5">
            {/* 생년월일 */}
            <div>
              <label className="form-label">
                <span>🎂</span> 생년월일
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={birthDate}
                onChange={handleDateChange}
                placeholder="예: 19980505"
                className="modern-input text-center text-xl tracking-widest font-bold"
                maxLength={10}
              />
            </div>

            {/* 태어난 시간 */}
            <div>
              <label className="form-label">
                <span>⏰</span> 태어난 시간 <span className="text-gray-400 font-normal text-xs">(선택)</span>
              </label>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="modern-input text-center"
              />
            </div>
          </div>

          {/* 최근 기록 */}
          {historyList.length > 0 && (
            <div className="bg-white/60 rounded-2xl p-4">
              <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                <span>🕐</span> 최근 기록
              </p>
              <div className="flex flex-wrap gap-2">
                {historyList.map((history) => (
                  <div
                    key={history.timestamp}
                    className="group flex items-center gap-1 bg-gray-100 hover:bg-gray-200 rounded-full pl-3 pr-1 py-1.5 transition-all cursor-pointer"
                  >
                    <button
                      type="button"
                      onClick={() => loadFromHistory(history)}
                      className="text-sm text-gray-700 font-medium"
                    >
                      {history.birthDate} / {history.mbti}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHistory(history.timestamp);
                      }}
                      className="p-1 rounded-full hover:bg-gray-300 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 성별 카드 */}
          <div className="form-card">
            <label className="form-label mb-3">
              <span>👤</span> 성별
            </label>
            <GenderToggle selected={gender} onSelect={setGender} />
          </div>

          {/* MBTI 카드 */}
          <div className="form-card">
            <label className="form-label mb-4">
              <span>🧠</span> MBTI 유형
            </label>
            <div className="space-y-3">
              <MbtiToggle options={["E", "I"]} selected={mbtiEI} onSelect={setMbtiEI} type="ei" />
              <MbtiToggle options={["N", "S"]} selected={mbtiNS} onSelect={setMbtiNS} type="ns" />
              <MbtiToggle options={["T", "F"]} selected={mbtiTF} onSelect={setMbtiTF} type="tf" />
              <MbtiToggle options={["P", "J"]} selected={mbtiPJ} onSelect={setMbtiPJ} type="pj" />
            </div>
            {/* MBTI 결과 표시 */}
            <div className="text-center mt-6">
              <span className="mbti-badge">{mbti}</span>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* 테마 선택 버튼 */}
          <div className="pt-4 space-y-4">
            <p className="text-center text-base font-bold text-gray-700">
              🎯 테마를 선택하고 결과 보기
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(THEME_CONFIG) as ThemeType[]).map((theme) => {
                const config = THEME_CONFIG[theme];
                const gradients: Record<ThemeType, string> = {
                  receipt: "bg-gradient-to-br from-gray-700 to-gray-900",
                  wanted: "bg-gradient-to-br from-amber-500 to-orange-600",
                  hospital: "bg-gradient-to-br from-slate-500 to-slate-700",
                  pastlife: "bg-gradient-to-br from-purple-800 to-indigo-900",
                  love: "bg-gradient-to-br from-pink-400 to-rose-500",
                  meme: "bg-gradient-to-br from-purple-500 to-indigo-600",
                  chart: "bg-gradient-to-br from-cyan-500 to-blue-600",
                  scandal: "bg-gradient-to-br from-red-500 to-rose-600",
                };
                return (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => handleSubmitWithTheme(theme)}
                    disabled={isLoading}
                    className={`theme-btn ${gradients[theme]} text-white shadow-md`}
                  >
                    {isLoading && currentTheme === theme ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span className="text-2xl">{config.icon}</span>
                    )}
                    <span className="text-base">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </div>

      {/* 푸터 */}
      <footer className="flex-shrink-0 py-6 text-center text-xs text-gray-400">
        <p className="font-medium">사주 × MBTI 성격 분석</p>
        <p className="mt-1 text-gray-300">재미로만 봐주세요 ✨</p>
      </footer>
    </main>
  );
}
