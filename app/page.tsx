"use client";

import { useState, useRef } from "react";
import { Printer, Loader2, RotateCcw, Download, Home as HomeIcon } from "lucide-react";
import html2canvas from "html2canvas";
import ReceiptView from "@/components/ReceiptView";
import WantedView from "@/components/WantedView";
import HospitalView from "@/components/HospitalView";
import JoseonView from "@/components/JoseonView";
import LoveView from "@/components/LoveView";

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
}

interface ThemeData {
  receipt: {
    items: ReceiptItem[];
    total: number;
  };
  wanted: WantedTheme;
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
}

// ==================== 테마 설정 ====================

type ThemeType = "receipt" | "wanted" | "hospital" | "joseon" | "love";

const THEME_CONFIG = {
  receipt: { label: "영수증", icon: "🧾", bg: "bg-gray-200", btnColor: "bg-gray-800" },
  wanted: { label: "현상수배", icon: "🤠", bg: "bg-amber-100", btnColor: "bg-amber-700" },
  hospital: { label: "진단서", icon: "🏥", bg: "bg-slate-100", btnColor: "bg-slate-600" },
  joseon: { label: "호적", icon: "📜", bg: "bg-amber-50", btnColor: "bg-amber-800" },
  love: { label: "미연시", icon: "💖", bg: "bg-pink-100", btnColor: "bg-pink-500" },
};

// ==================== 서브 컴포넌트 ====================

// MBTI 토글 버튼
function MbtiToggle({
  options,
  selected,
  onSelect,
}: {
  options: [string, string];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex w-full">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`toggle-btn ${selected === option ? "active" : "inactive"}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

// 성별 토글 버튼
function GenderToggle({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex w-full">
      <button
        type="button"
        onClick={() => onSelect("male")}
        className={`toggle-btn ${selected === "male" ? "active" : "inactive"}`}
      >
        남성 (M)
      </button>
      <button
        type="button"
        onClick={() => onSelect("female")}
        className={`toggle-btn ${selected === "female" ? "active" : "inactive"}`}
      >
        여성 (F)
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

  // MBTI 조합
  const mbti = `${mbtiEI}${mbtiNS}${mbtiTF}${mbtiPJ}`;

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

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    setIsLoading(true);

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

      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: currentTheme === "receipt" ? "#e5e5e5" :
                         currentTheme === "wanted" ? "#fef3c7" :
                         currentTheme === "hospital" ? "#f1f5f9" :
                         currentTheme === "joseon" ? "#fffbeb" : "#fce7f3",
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
        joseon: "joseon-hojeok.png",
        love: "love-status.png",
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
          <div ref={contentRef} className="py-2">
            {currentTheme === "receipt" && <ReceiptView data={analysisData} />}
            {currentTheme === "wanted" && <WantedView data={analysisData} />}
            {currentTheme === "hospital" && <HospitalView data={analysisData} />}
            {currentTheme === "joseon" && <JoseonView data={analysisData} />}
            {currentTheme === "love" && <LoveView data={analysisData} />}
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
    <main className="min-h-screen bg-white flex flex-col">
      {/* 히어로 헤더 */}
      <header className="flex-shrink-0 pt-12 pb-8 px-4">
        <div className="max-w-md mx-auto text-center">
          {/* 로고 */}
          <div className="mb-4">
            <span className="text-6xl">🧾</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
            LIFE RECEIPT
          </h1>
          <p className="text-lg text-gray-500 mt-2 tracking-wide">
            STORE
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
            <span>사주</span>
            <span className="text-gray-300">×</span>
            <span>MBTI</span>
            <span className="text-gray-300">=</span>
            <span className="font-bold text-gray-900">나의 인생 영수증</span>
          </div>
        </div>
      </header>

      {/* 구분선 */}
      <div className="max-w-md mx-auto w-full px-4">
        <div className="border-t-4 border-black" />
      </div>

      {/* 입력 폼 */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 생년월일 */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
              BIRTH DATE
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={birthDate}
              onChange={handleDateChange}
              placeholder="YYYY.MM.DD (예: 19980505)"
              className="kiosk-input text-center text-xl tracking-wider"
              maxLength={10}
              required
            />
          </div>

          {/* 태어난 시간 */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
              BIRTH TIME <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="kiosk-input"
            />
          </div>

          {/* 성별 */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
              GENDER
            </label>
            <GenderToggle selected={gender} onSelect={setGender} />
          </div>

          {/* MBTI 선택 */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
              MBTI
            </label>
            <div className="space-y-2">
              <MbtiToggle options={["E", "I"]} selected={mbtiEI} onSelect={setMbtiEI} />
              <MbtiToggle options={["N", "S"]} selected={mbtiNS} onSelect={setMbtiNS} />
              <MbtiToggle options={["T", "F"]} selected={mbtiTF} onSelect={setMbtiTF} />
              <MbtiToggle options={["P", "J"]} selected={mbtiPJ} onSelect={setMbtiPJ} />
            </div>
            {/* MBTI 결과 표시 */}
            <div className="text-center mt-4">
              <span className="inline-block text-3xl font-black tracking-widest px-6 py-3 border-4 border-black">
                {mbti}
              </span>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-400 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>분석 중...</span>
                </>
              ) : (
                <>
                  <Printer className="w-6 h-6" />
                  <span>영수증 출력하기</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 푸터 */}
      <footer className="flex-shrink-0 py-6 text-center text-xs text-gray-400">
        <p>LIFE RECEIPT STORE - Est. 2024</p>
        <p className="mt-1">Your Destiny, Printed Fresh.</p>
      </footer>
    </main>
  );
}
