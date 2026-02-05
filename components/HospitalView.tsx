"use client";

import { Nanum_Pen_Script } from "next/font/google";
import { useMemo } from "react";

// Google Fonts - 의사 손글씨 느낌
const handwritingFont = Nanum_Pen_Script({
  weight: "400",
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

interface HospitalTheme {
  diseases: string[];
  prescriptions: string[];
  severity: string;
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
  theme_data?: {
    hospital?: HospitalTheme;
  };
}

interface HospitalViewProps {
  data: AnalyzeResponse;
}

// 진단명 데이터베이스
const DIAGNOSIS_DB: Record<string, { name: string; code: string }[]> = {
  ENTP: [
    { name: "만성 논쟁중독 증후군", code: "F91.3" },
    { name: "계획 회피 장애", code: "F60.7" },
  ],
  ENTJ: [
    { name: "독재자 망상 증후군", code: "F22.0" },
    { name: "완벽주의 강박 장애", code: "F42.8" },
  ],
  ENFP: [
    { name: "관심결핍 과잉행동 증후군", code: "F90.0" },
    { name: "3일 열정 주기성 장애", code: "F34.0" },
  ],
  ENFJ: [
    { name: "오지랖 과다 증후군", code: "F60.4" },
    { name: "거절불능 복종장애", code: "F60.6" },
  ],
  INTP: [
    { name: "현실도피성 망상장애", code: "F23.9" },
    { name: "사회성 결핍 증후군", code: "F84.5" },
  ],
  INTJ: [
    { name: "인간혐오성 고립장애", code: "F60.1" },
    { name: "냉소적 현실주의 증후군", code: "F21" },
  ],
  INFP: [
    { name: "만성 이상주의 중증", code: "F33.2" },
    { name: "현실 부적응 증후군", code: "F43.2" },
  ],
  INFJ: [
    { name: "문닫기 충동조절 장애", code: "F63.8" },
    { name: "겉바속촉 이중인격 장애", code: "F44.81" },
  ],
  ESTP: [
    { name: "YOLO 충동조절 장애", code: "F63.9" },
    { name: "아드레날린 중독증", code: "F15.2" },
  ],
  ESTJ: [
    { name: "권위적 꼰대화 증후군", code: "F60.5" },
    { name: "융통성 경직 장애", code: "F60.0" },
  ],
  ESFP: [
    { name: "파티 중독 증후군", code: "F10.1" },
    { name: "충동구매 강박장애", code: "F42.2" },
  ],
  ESFJ: [
    { name: "눈치 과민 반응 증후군", code: "F41.1" },
    { name: "인정욕구 결핍 장애", code: "F33.1" },
  ],
  ISTP: [
    { name: "감정 표현 불능증", code: "R45.4" },
    { name: "고립선호 은둔장애", code: "F40.1" },
  ],
  ISTJ: [
    { name: "변화 공포 경직 장애", code: "F40.2" },
    { name: "규칙 강박 증후군", code: "F42.1" },
  ],
  ISFP: [
    { name: "결정장애 만성화", code: "F41.9" },
    { name: "갈등회피 도피 장애", code: "F60.6" },
  ],
  ISFJ: [
    { name: "자기희생 중독증", code: "F60.7" },
    { name: "억압형 분노 폭발 장애", code: "F63.81" },
  ],
};

// 처방 데이터베이스
const PRESCRIPTION_DB = [
  "금융 치료 시급 (현금 수혈 3회/일)",
  "사회적 격리 권고 (인터넷 차단)",
  "강제 휴식 (드라마 정주행 처방)",
  "현실 직시 훈련 필요",
  "자아 성찰 명상 3시간/일",
  "타인 신경 끄기 연습 권고",
  "일단 자고 일어나서 생각하기",
  "치킨 섭취 후 재진단 필요",
];

export default function HospitalView({ data }: HospitalViewProps) {
  const { user_info, saju_analysis, theme_data } = data;
  const hospitalData = theme_data?.hospital;

  // 환자 번호
  const patientNo = useMemo(() => {
    return `PT-${user_info.year}${String(user_info.month).padStart(2, "0")}${String(user_info.day).padStart(2, "0")}-${Math.floor(Math.random() * 999) + 1}`;
  }, [user_info]);

  // API에서 진단명 가져오기 (폴백: 하드코딩된 데이터)
  const diagnoses = useMemo(() => {
    if (hospitalData?.diseases && hospitalData.diseases.length > 0) {
      // API 데이터를 진단 코드와 함께 반환
      return hospitalData.diseases.map((name, i) => ({
        name,
        code: `F${60 + i}.${Math.floor(Math.random() * 9)}`,
      }));
    }
    const mbtiDiagnoses = DIAGNOSIS_DB[user_info.mbti] || DIAGNOSIS_DB["ENTP"];
    return mbtiDiagnoses;
  }, [hospitalData, user_info.mbti]);

  // API에서 처방 가져오기 (폴백: 랜덤)
  const prescription = useMemo(() => {
    if (hospitalData?.prescriptions && hospitalData.prescriptions.length > 0) {
      return hospitalData.prescriptions.join(" + ");
    }
    return PRESCRIPTION_DB[Math.floor(Math.random() * PRESCRIPTION_DB.length)];
  }, [hospitalData]);

  // API에서 심각도 가져오기 (폴백: 랜덤)
  const needsAdmission = useMemo(() => {
    if (hospitalData?.severity) {
      return hospitalData.severity === "입원 요망" || hospitalData.severity === "즉시 격리";
    }
    return Math.random() > 0.3;
  }, [hospitalData]);

  const severityLabel = hospitalData?.severity || (needsAdmission ? "입원 요망" : "치료 불가");

  // 현재 날짜
  const today = new Date().toLocaleDateString("ko-KR");

  return (
    <div className="relative max-w-sm mx-auto">
      {/* 클립보드 클립 */}
      <div className="flex justify-center">
        <div
          className="w-20 h-8 rounded-b-lg"
          style={{
            background: "linear-gradient(180deg, #78716c 0%, #57534e 100%)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
          }}
        />
      </div>

      {/* 클립보드 본체 */}
      <div
        className="bg-white border-2 border-gray-300 rounded-lg shadow-xl p-6 -mt-2"
        style={{
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* 헤더 */}
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
          <div className="flex justify-between items-start mb-2">
            <div className="text-xs text-gray-500">
              <p>서울정신건강의학과</p>
              <p>Seoul Mental Health Clinic</p>
            </div>
            <div className="text-xs text-right text-gray-500">
              <p>TEL: 02-XXX-XXXX</p>
              <p>24시 응급</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-wide text-gray-800">
            DIAGNOSIS REPORT
          </h1>
          <p className="text-sm text-gray-600">정신건강 진단서</p>
        </div>

        {/* 환자 정보 */}
        <div className="mb-4 text-sm">
          <div className="grid grid-cols-2 gap-2 border border-gray-300 p-3 bg-gray-50">
            <div>
              <span className="text-gray-500">환자번호:</span>
              <span className="ml-2 font-mono">{patientNo}</span>
            </div>
            <div>
              <span className="text-gray-500">진료일:</span>
              <span className="ml-2">{today}</span>
            </div>
            <div>
              <span className="text-gray-500">성별:</span>
              <span className="ml-2">{user_info.gender === "male" ? "남(M)" : "여(F)"}</span>
            </div>
            <div>
              <span className="text-gray-500">유형:</span>
              <span className="ml-2 font-bold">{user_info.mbti}</span>
            </div>
          </div>
        </div>

        {/* 진단명 */}
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            DIAGNOSIS 진단명
          </h2>
          <div className={`${handwritingFont.className} space-y-2`}>
            {diagnoses.map((d, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-yellow-50 border-l-4 border-yellow-400">
                <span className="text-xs text-gray-400 font-mono">[{d.code}]</span>
                <span className="text-xl text-gray-800">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 증상 기록 */}
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            SYMPTOMS 증상 기록
          </h2>
          <div className={`${handwritingFont.className} text-lg p-3 bg-blue-50 border border-blue-200 rounded`}>
            <p>- 주요 기질: {saju_analysis.main_trait_korean} 과다</p>
            <p>- 결핍 요소: {saju_analysis.lacking_traits_korean.join(", ") || "없음"}</p>
            <p>- 일간 에너지: {saju_analysis.day_master_korean}({saju_analysis.day_master})</p>
          </div>
        </div>

        {/* 처방 */}
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            PRESCRIPTION 처방
          </h2>
          <div className={`${handwritingFont.className} text-xl p-3 bg-green-50 border border-green-200 rounded`}>
            <span className="text-green-700">Rx: </span>
            {prescription}
          </div>
        </div>

        {/* 담당의 소견 */}
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-700 mb-2">DOCTOR'S NOTE 의사 소견</h2>
          <div className={`${handwritingFont.className} text-lg p-3 border border-gray-300 rounded bg-gray-50 min-h-[60px]`}>
            "상기 환자는 치료 의지가 불분명하며, 증상의 자각이 미흡함. 장기적 관찰 요망."
          </div>
        </div>

        {/* 빨간 도장 (입원 요망 / 치료 불가) */}
        <div className="absolute top-1/2 right-8 transform rotate-[-15deg]">
          <div
            className={`px-4 py-2 border-4 rounded-sm text-2xl font-bold ${
              needsAdmission
                ? "border-red-600 text-red-600"
                : "border-purple-600 text-purple-600"
            }`}
            style={{
              opacity: 0.85,
              fontFamily: "serif",
            }}
          >
            {needsAdmission ? "입원 요망" : "치료 불가"}
            <div className="text-xs text-center mt-1">
              {needsAdmission ? "ADMIT" : "INSANE"}
            </div>
          </div>
        </div>

        {/* 서명란 */}
        <div className="mt-6 pt-4 border-t border-gray-300 flex justify-between items-end">
          <div className="text-xs text-gray-500">
            <p>본 진단서는 의학적 근거가 전혀 없으며,</p>
            <p>오직 재미를 위한 것입니다.</p>
          </div>
          <div className="text-right">
            <div className={`${handwritingFont.className} text-2xl text-gray-700`}>
              Dr. 사주봇
            </div>
            <p className="text-xs text-gray-500">정신건강의학과 전문의</p>
          </div>
        </div>
      </div>
    </div>
  );
}
