"use client";

import { useState, useRef } from "react";
import { Printer, Loader2, RotateCcw, Download } from "lucide-react";
import html2canvas from "html2canvas";
import ReceiptView from "@/components/ReceiptView";

// API 응답 타입 정의
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

// MBTI 토글 버튼 컴포넌트
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

// 성별 토글 버튼 컴포넌트
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

export default function Home() {
  // 폼 상태
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [gender, setGender] = useState("male");

  // MBTI 상태 (4개 축)
  const [mbtiEI, setMbtiEI] = useState("E");
  const [mbtiNS, setMbtiNS] = useState("N");
  const [mbtiTF, setMbtiTF] = useState("T");
  const [mbtiPJ, setMbtiPJ] = useState("P");

  // UI 상태
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 영수증 영역 Ref
  const receiptRef = useRef<HTMLDivElement>(null);

  // MBTI 조합
  const mbti = `${mbtiEI}${mbtiNS}${mbtiTF}${mbtiPJ}`;

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // 유효성 검사
    if (!birthDate) {
      setError("생년월일을 입력해주세요.");
      return;
    }

    // 날짜 파싱
    const [year, month, day] = birthDate.split("-").map(Number);

    // 시간 파싱 (없으면 0으로)
    let hour = 0;
    let minute = 0;
    if (birthTime) {
      [hour, minute] = birthTime.split(":").map(Number);
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year,
          month,
          day,
          hour,
          minute,
          gender,
          mbti,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "분석 중 오류가 발생했습니다.");
      }

      const data: AnalyzeResponse = await response.json();
      console.log("API Response:", data);
      setResult(data);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "서버 연결에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 이미지 다운로드 핸들러
  const handleDownloadImage = async () => {
    if (!receiptRef.current) return;

    setIsSaving(true);

    try {
      // html2canvas로 영수증 영역 캡처
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#e5e5e5", // 배경색 설정 (gray-200)
        scale: 2, // 고해상도를 위해 2배 스케일
        useCORS: true,
        logging: false,
      });

      // canvas를 이미지 데이터 URL로 변환
      const imageUrl = canvas.toDataURL("image/png");

      // 가상의 <a> 태그 생성하여 다운로드 트리거
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "life-receipt.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Image download error:", err);
      alert("이미지 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  // 다시하기
  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  // 결과 화면
  if (result) {
    return (
      <main className="min-h-screen bg-gray-200 py-8 px-4">
        {/* 영수증 뷰 (캡처 대상) */}
        <div ref={receiptRef}>
          <ReceiptView data={result} />
        </div>

        {/* 버튼 그룹 */}
        <div className="max-w-sm mx-auto mt-6 space-y-3">
          {/* 이미지 저장 버튼 */}
          <button
            onClick={handleDownloadImage}
            disabled={isSaving}
            className="w-full kiosk-btn kiosk-btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                저장 중... (Saving...)
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                이미지 저장 (Save Image)
              </>
            )}
          </button>

          {/* 다시하기 버튼 */}
          <button
            onClick={handleReset}
            className="w-full kiosk-btn kiosk-btn-secondary flex items-center justify-center gap-2 py-3"
          >
            <RotateCcw className="w-5 h-5" />
            다시 출력하기 (NEW RECEIPT)
          </button>
        </div>
      </main>
    );
  }

  // 입력 화면
  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b-4 border-black py-6">
        <h1 className="text-center text-3xl md:text-4xl font-black tracking-tight">
          LIFE RECEIPT STORE
        </h1>
        <p className="text-center text-sm mt-1 text-gray-600">인간 영수증 발급소</p>
      </header>

      {/* 메인 폼 */}
      <div className="max-w-md mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 생년월일 */}
          <div className="space-y-2">
            <label className="block text-sm font-bold uppercase tracking-wide">
              BIRTH DATE 생년월일
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="kiosk-input"
              required
            />
          </div>

          {/* 태어난 시간 */}
          <div className="space-y-2">
            <label className="block text-sm font-bold uppercase tracking-wide">
              BIRTH TIME 태어난 시간 <span className="text-gray-500 font-normal">(선택)</span>
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
            <label className="block text-sm font-bold uppercase tracking-wide">
              GENDER 성별
            </label>
            <GenderToggle selected={gender} onSelect={setGender} />
          </div>

          {/* MBTI 선택 */}
          <div className="space-y-2">
            <label className="block text-sm font-bold uppercase tracking-wide">
              MBTI 성격유형
            </label>
            <div className="space-y-2">
              <MbtiToggle options={["E", "I"]} selected={mbtiEI} onSelect={setMbtiEI} />
              <MbtiToggle options={["N", "S"]} selected={mbtiNS} onSelect={setMbtiNS} />
              <MbtiToggle options={["T", "F"]} selected={mbtiTF} onSelect={setMbtiTF} />
              <MbtiToggle options={["P", "J"]} selected={mbtiPJ} onSelect={setMbtiPJ} />
            </div>
            <p className="text-center text-xl font-bold mt-3 py-2 border-2 border-dashed border-gray-400">
              {mbti}
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-500 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full kiosk-btn kiosk-btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                출력 중... (Printing...)
              </>
            ) : (
              <>
                <Printer className="w-5 h-5" />
                영수증 출력하기 (PRINT)
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
