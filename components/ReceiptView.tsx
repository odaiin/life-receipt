"use client";

import { Share_Tech_Mono } from "next/font/google";
import { useMemo } from "react";

// Google Fonts - 영수증 스타일 모노스페이스 폰트
const receiptFont = Share_Tech_Mono({
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

interface FiveElements {
  Wood: number;
  Fire: number;
  Earth: number;
  Metal: number;
  Water: number;
}

interface ReceiptItem {
  name: string;
  price: number;
}

interface SajuAnalysis {
  year_pillar: SajuPillar;
  month_pillar: SajuPillar;
  day_pillar: SajuPillar;
  hour_pillar: SajuPillar | null;
  day_master: string;
  day_master_korean: string;
  day_master_element: string;
  five_elements: FiveElements;
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
  receipt_items: ReceiptItem[];
  total_price: number;
}

interface ReceiptViewProps {
  data: AnalyzeResponse;
}

// 가짜 바코드 생성 컴포넌트
function FakeBarcode() {
  const bars = useMemo(() => {
    const pattern = [];
    for (let i = 0; i < 50; i++) {
      const width = Math.random() > 0.5 ? 2 : 1;
      const isBlack = Math.random() > 0.3;
      pattern.push({ width, isBlack });
    }
    return pattern;
  }, []);

  return (
    <div className="flex justify-center items-end h-12 gap-[1px]">
      {bars.map((bar, index) => (
        <div
          key={index}
          className={bar.isBlack ? "bg-black" : "bg-transparent"}
          style={{
            width: `${bar.width}px`,
            height: `${30 + Math.random() * 15}px`,
          }}
        />
      ))}
    </div>
  );
}

// 점선 구분자 컴포넌트
function DashedDivider() {
  return (
    <div className="border-t-2 border-dashed border-gray-400 my-3" />
  );
}

// 가격 포맷팅 함수
function formatPrice(price: number): string {
  const absPrice = Math.abs(price);
  const formatted = absPrice.toLocaleString();
  return price < 0 ? `-₩${formatted}` : `₩${formatted}`;
}

// 영수증 아이템 라인 컴포넌트
function ReceiptItemLine({ item }: { item: ReceiptItem }) {
  const isNegative = item.price < 0;

  return (
    <div className="flex justify-between items-start gap-2 py-1">
      <span className="flex-1 text-xs leading-tight">{item.name}</span>
      <span className={`text-xs font-bold whitespace-nowrap ${isNegative ? "text-red-600" : "text-green-700"}`}>
        {formatPrice(item.price)}
      </span>
    </div>
  );
}

export default function ReceiptView({ data }: ReceiptViewProps) {
  const { user_info, saju_analysis, receipt_items, total_price } = data;

  // 현재 날짜/시간
  const now = new Date();
  const dateStr = now.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\. /g, "-").replace(".", "");
  const timeStr = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // 랜덤 주문번호
  const orderNumber = useMemo(() => {
    return String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
  }, []);

  return (
    <div className={`${receiptFont.className} relative max-w-sm mx-auto`}>
      {/* 상단 지그재그 효과 */}
      <div
        className="h-4 w-full"
        style={{
          background: "#f5f5eb",
          maskImage: `radial-gradient(circle at 8px 0, transparent 8px, #f5f5eb 8px)`,
          WebkitMaskImage: `radial-gradient(circle at 8px 0, transparent 8px, #f5f5eb 8px)`,
          maskSize: "16px 100%",
          WebkitMaskSize: "16px 100%",
          maskRepeat: "repeat-x",
          WebkitMaskRepeat: "repeat-x",
        }}
      />

      {/* 메인 영수증 */}
      <div
        className="px-6 py-4 text-sm leading-relaxed"
        style={{
          backgroundColor: "#f5f5eb",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* 헤더 */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold tracking-widest mb-1">LIFE STORE</h2>
          <p className="text-xs text-gray-500">Your Destiny, Printed Fresh</p>
          <DashedDivider />
          <div className="text-xs text-gray-600 space-y-1">
            <p>DATE: {dateStr} {timeStr}</p>
            <p>ORDER: #{orderNumber}</p>
            <p>CASHIER: SAJU-BOT v2.0</p>
          </div>
        </div>

        <DashedDivider />

        {/* 고객 정보 */}
        <div className="mb-2">
          <p className="text-xs text-gray-500 mb-1">GUEST INFO</p>
          <p className="text-lg font-bold">
            {user_info.mbti} / {saju_analysis.day_master_korean}({saju_analysis.day_master})
          </p>
          <p className="text-xs text-gray-600">
            {user_info.year}.{String(user_info.month).padStart(2, "0")}.{String(user_info.day).padStart(2, "0")}
            {user_info.hour > 0 && ` ${String(user_info.hour).padStart(2, "0")}:${String(user_info.minute).padStart(2, "0")}`}
            {" / "}
            {user_info.gender === "male" ? "M" : "F"}
          </p>
        </div>

        <DashedDivider />

        {/* 사주 팔자 */}
        <div className="mb-2">
          <p className="text-xs text-gray-500 mb-2">SAJU PILLARS 사주팔자</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="border border-gray-300 p-2">
              <p className="text-[10px] text-gray-400">시주</p>
              <p className="text-lg">
                {saju_analysis.hour_pillar
                  ? `${saju_analysis.hour_pillar.stem}${saju_analysis.hour_pillar.branch}`
                  : "??"}
              </p>
              <p className="text-xs text-gray-500">
                {saju_analysis.hour_pillar
                  ? `${saju_analysis.hour_pillar.stem_korean}${saju_analysis.hour_pillar.branch_korean}`
                  : "--"}
              </p>
            </div>
            <div className="border border-gray-300 p-2 bg-yellow-50">
              <p className="text-[10px] text-gray-400">일주★</p>
              <p className="text-lg font-bold">{saju_analysis.day_pillar.stem}{saju_analysis.day_pillar.branch}</p>
              <p className="text-xs text-gray-500">{saju_analysis.day_pillar.stem_korean}{saju_analysis.day_pillar.branch_korean}</p>
            </div>
            <div className="border border-gray-300 p-2">
              <p className="text-[10px] text-gray-400">월주</p>
              <p className="text-lg">{saju_analysis.month_pillar.stem}{saju_analysis.month_pillar.branch}</p>
              <p className="text-xs text-gray-500">{saju_analysis.month_pillar.stem_korean}{saju_analysis.month_pillar.branch_korean}</p>
            </div>
            <div className="border border-gray-300 p-2">
              <p className="text-[10px] text-gray-400">년주</p>
              <p className="text-lg">{saju_analysis.year_pillar.stem}{saju_analysis.year_pillar.branch}</p>
              <p className="text-xs text-gray-500">{saju_analysis.year_pillar.stem_korean}{saju_analysis.year_pillar.branch_korean}</p>
            </div>
          </div>
        </div>

        <DashedDivider />

        {/* 영수증 아이템 리스트 (팩폭!) */}
        <div className="mb-2">
          <p className="text-xs text-gray-500 mb-2">YOUR TRAITS 당신의 특성</p>
          <div className="space-y-0">
            {receipt_items.map((item, index) => (
              <ReceiptItemLine key={index} item={item} />
            ))}
          </div>
        </div>

        <DashedDivider />

        {/* 오행 분석 요약 */}
        <div className="mb-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">과다 DOMINANT:</span>
            <span className="font-bold">{saju_analysis.main_trait_korean}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">부족 LACKING:</span>
            <span className="font-bold">
              {saju_analysis.lacking_traits_korean.length > 0
                ? saju_analysis.lacking_traits_korean.join(", ")
                : "없음 (NONE)"}
            </span>
          </div>
        </div>

        <DashedDivider />

        {/* 합계 */}
        <div className="text-right mb-4">
          <p className="text-xs text-gray-500">TOTAL VALUE</p>
          <p className={`text-2xl font-bold ${total_price >= 0 ? "text-green-700" : "text-red-600"}`}>
            {formatPrice(total_price)}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            {total_price >= 0 ? "* 당신은 이득입니다 *" : "* 인생 적자입니다 *"}
          </p>
        </div>

        <DashedDivider />

        {/* 푸터 */}
        <div className="text-center text-xs text-gray-500 space-y-2">
          <p className="font-bold">* * * NO REFUNDS / EXCHANGE * * *</p>
          <p className="italic">This is your destiny. Own it.</p>

          {/* 바코드 */}
          <div className="mt-4">
            <FakeBarcode />
            <p className="text-[10px] mt-1 tracking-widest">
              {user_info.year}{String(user_info.month).padStart(2, "0")}{String(user_info.day).padStart(2, "0")}-{orderNumber}
            </p>
          </div>

          <p className="mt-4 text-[10px]">
            LIFE STORE - Est. 2024
            <br />
            Thank you for your visit!
          </p>
        </div>
      </div>

      {/* 하단 지그재그 효과 */}
      <div
        className="h-4 w-full"
        style={{
          background: "#f5f5eb",
          maskImage: `radial-gradient(circle at 8px 100%, transparent 8px, #f5f5eb 8px)`,
          WebkitMaskImage: `radial-gradient(circle at 8px 100%, transparent 8px, #f5f5eb 8px)`,
          maskSize: "16px 100%",
          WebkitMaskSize: "16px 100%",
          maskRepeat: "repeat-x",
          WebkitMaskRepeat: "repeat-x",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      />
    </div>
  );
}
