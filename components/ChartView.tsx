"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

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
  };
  saju_analysis: SajuAnalysis;
  theme_data?: {
    chart?: ChartTheme;
  };
}

interface ChartViewProps {
  data: AnalyzeResponse;
}

// 커스텀 툴팁 - 재물/연애 동시 표시
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
        <p className="text-cyan-400 font-bold text-lg mb-2">{data.age}</p>

        {/* 재물운 */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-amber-400">💰</span>
          <span className="text-amber-400">재물운:</span>
          <span className="text-white font-bold">{data.wealth}pt</span>
        </div>
        {data.wealth_event && (
          <p className="text-amber-300/80 text-xs ml-6 mb-2">{data.wealth_event}</p>
        )}

        {/* 연애운 */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-pink-400">💕</span>
          <span className="text-pink-400">연애운:</span>
          <span className="text-white font-bold">{data.love}pt</span>
        </div>
        {data.love_event && (
          <p className="text-pink-300/80 text-xs ml-6">{data.love_event}</p>
        )}
      </div>
    );
  }
  return null;
};

// 커스텀 도트 - 재물운 이벤트 (라벨 포함, 점 위쪽에 표시)
const WealthDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (!payload.wealth_event) return null;

  const isHigh = payload.wealth > 60;
  // 라벨 텍스트 줄이기 (최대 8글자)
  const labelText = payload.wealth_event.length > 10
    ? payload.wealth_event.substring(0, 9) + "..."
    : payload.wealth_event;

  return (
    <g>
      {/* 발광 효과 */}
      <circle
        cx={cx}
        cy={cy}
        r={12}
        fill="#F59E0B"
        opacity={0.3}
      />
      {/* 메인 점 */}
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={isHigh ? "#22c55e" : "#ef4444"}
        stroke="#F59E0B"
        strokeWidth={2}
      />
      {/* 라벨 (점 위쪽) */}
      <text
        x={cx}
        y={cy - 18}
        textAnchor="middle"
        fill="#F59E0B"
        fontSize={9}
        fontWeight="bold"
        style={{ textShadow: "0 0 3px #000" }}
      >
        {labelText}
      </text>
    </g>
  );
};

// 커스텀 도트 - 연애운 이벤트 (라벨 포함, 점 아래쪽에 표시)
const LoveDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (!payload.love_event) return null;

  const isHigh = payload.love > 60;
  // 라벨 텍스트 줄이기 (최대 8글자)
  const labelText = payload.love_event.length > 10
    ? payload.love_event.substring(0, 9) + "..."
    : payload.love_event;

  return (
    <g>
      {/* 발광 효과 */}
      <circle
        cx={cx}
        cy={cy}
        r={12}
        fill="#EC4899"
        opacity={0.3}
      />
      {/* 메인 점 */}
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={isHigh ? "#22c55e" : "#ef4444"}
        stroke="#EC4899"
        strokeWidth={2}
      />
      {/* 라벨 (점 아래쪽) */}
      <text
        x={cx}
        y={cy + 22}
        textAnchor="middle"
        fill="#EC4899"
        fontSize={9}
        fontWeight="bold"
        style={{ textShadow: "0 0 3px #000" }}
      >
        {labelText}
      </text>
    </g>
  );
};

// 커스텀 레전드
const CustomLegend = () => (
  <div className="flex justify-center gap-6 mb-2">
    <div className="flex items-center gap-2">
      <div className="w-4 h-1 bg-amber-400 rounded"></div>
      <span className="text-amber-400 text-sm font-bold">💰 재물운</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-1 bg-pink-400 rounded"></div>
      <span className="text-pink-400 text-sm font-bold">💕 연애운</span>
    </div>
  </div>
);

export default function ChartView({ data }: ChartViewProps) {
  const { user_info, saju_analysis, theme_data } = data;
  const chartData = theme_data?.chart;

  if (!chartData) {
    return <div className="text-white text-center p-8">차트 데이터 로딩 중...</div>;
  }

  // 고점/저점 데이터 찾기
  const wealthPeakData = chartData.data.find((d) => d.age === chartData.wealth_peak_age);
  const wealthLowData = chartData.data.find((d) => d.age === chartData.wealth_low_age);
  const lovePeakData = chartData.data.find((d) => d.age === chartData.love_peak_age);
  const loveLowData = chartData.data.find((d) => d.age === chartData.love_low_age);

  return (
    <div className="max-w-lg mx-auto">
      {/* 차트 카드 */}
      <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-black text-xl flex items-center gap-2">
                <span className="text-amber-400">💰</span>
                <span className="text-pink-400">💕</span>
                재물 vs 연애 차트
              </h2>
              <p className="text-gray-400 text-sm">Wealth vs Love Fortune</p>
            </div>
            <div className="text-right">
              <p className="text-cyan-400 font-mono text-sm">{user_info.mbti}</p>
              <p className="text-gray-500 text-xs">{saju_analysis.main_trait_korean}</p>
            </div>
          </div>
        </div>

        {/* 패턴 정보 - 두 패턴 모두 표시 */}
        <div className="px-6 py-3 bg-slate-800/50 border-b border-slate-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-amber-400/70">💰 패턴</span>
              <span className="text-amber-400 font-bold">{chartData.wealth_pattern_korean}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-pink-400/70">💕 패턴</span>
              <span className="text-pink-400 font-bold">{chartData.love_pattern_korean}</span>
            </div>
          </div>
        </div>

        {/* 차트 영역 - 높이 증가로 라벨 공간 확보 */}
        <div className="p-4 bg-slate-900">
          <CustomLegend />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData.data}
                margin={{ top: 30, right: 20, left: -10, bottom: 25 }}
              >
                <defs>
                  {/* 재물운 그라데이션 */}
                  <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.2} />
                  </linearGradient>
                  {/* 연애운 그라데이션 */}
                  <linearGradient id="loveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  vertical={false}
                />
                <XAxis
                  dataKey="age"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={{ stroke: "#475569" }}
                  tickLine={{ stroke: "#475569" }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={{ stroke: "#475569" }}
                  tickLine={{ stroke: "#475569" }}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                {/* 50 기준선 */}
                <ReferenceLine y={50} stroke="#64748b" strokeDasharray="5 5" />

                {/* 재물운 라인 - 황금색 */}
                <Line
                  type="monotone"
                  dataKey="wealth"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={<WealthDot />}
                  activeDot={{ r: 6, fill: "#F59E0B" }}
                  animationDuration={2000}
                  animationEasing="ease-out"
                  style={{
                    filter: "drop-shadow(0 0 6px #F59E0B)",
                  }}
                />

                {/* 연애운 라인 - 핑크색 */}
                <Line
                  type="monotone"
                  dataKey="love"
                  stroke="#EC4899"
                  strokeWidth={3}
                  dot={<LoveDot />}
                  activeDot={{ r: 6, fill: "#EC4899" }}
                  animationDuration={2000}
                  animationEasing="ease-out"
                  style={{
                    filter: "drop-shadow(0 0 6px #EC4899)",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 인생 타임라인 - 모든 이벤트 표시 */}
        <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cyan-400 text-lg">📜</span>
            <span className="text-cyan-400 font-bold">인생 막장 타임라인</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {chartData.data.map((point, idx) => (
              (point.wealth_event || point.love_event) && (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <span className="text-cyan-400 font-bold min-w-[40px]">{point.age}</span>
                  <div className="flex-1 space-y-1">
                    {point.wealth_event && (
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400">💰</span>
                        <span className={`${point.wealth > 60 ? 'text-green-400' : 'text-red-400'}`}>
                          {point.wealth_event}
                        </span>
                        <span className="text-gray-500 text-xs">({point.wealth}pt)</span>
                      </div>
                    )}
                    {point.love_event && (
                      <div className="flex items-center gap-2">
                        <span className="text-pink-400">💕</span>
                        <span className={`${point.love > 60 ? 'text-green-400' : 'text-red-400'}`}>
                          {point.love_event}
                        </span>
                        <span className="text-gray-500 text-xs">({point.love}pt)</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* 주요 이벤트 - 재물운 */}
        <div className="px-6 py-4 bg-amber-900/10 border-t border-amber-500/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-400 text-lg">💰</span>
            <span className="text-amber-400 font-bold">재물운 하이라이트</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* 재물 최고점 */}
            <div className="bg-green-900/30 rounded-xl p-3 border border-green-500/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-400 text-sm">📈 최고점</span>
              </div>
              <p className="text-white font-bold">{chartData.wealth_peak_age}</p>
              <p className="text-green-300 text-xs">{chartData.wealth_peak_event}</p>
              {wealthPeakData && (
                <p className="text-green-400 text-xs mt-1">+{wealthPeakData.wealth}pt</p>
              )}
            </div>

            {/* 재물 최저점 */}
            <div className="bg-red-900/30 rounded-xl p-3 border border-red-500/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-400 text-sm">📉 최저점</span>
              </div>
              <p className="text-white font-bold">{chartData.wealth_low_age}</p>
              <p className="text-red-300 text-xs">{chartData.wealth_low_event}</p>
              {wealthLowData && (
                <p className="text-red-400 text-xs mt-1">{wealthLowData.wealth}pt</p>
              )}
            </div>
          </div>
        </div>

        {/* 주요 이벤트 - 연애운 */}
        <div className="px-6 py-4 bg-pink-900/10 border-t border-pink-500/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-pink-400 text-lg">💕</span>
            <span className="text-pink-400 font-bold">연애운 하이라이트</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* 연애 최고점 */}
            <div className="bg-green-900/30 rounded-xl p-3 border border-green-500/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-400 text-sm">📈 최고점</span>
              </div>
              <p className="text-white font-bold">{chartData.love_peak_age}</p>
              <p className="text-green-300 text-xs">{chartData.love_peak_event}</p>
              {lovePeakData && (
                <p className="text-green-400 text-xs mt-1">+{lovePeakData.love}pt</p>
              )}
            </div>

            {/* 연애 최저점 */}
            <div className="bg-red-900/30 rounded-xl p-3 border border-red-500/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-400 text-sm">📉 최저점</span>
              </div>
              <p className="text-white font-bold">{chartData.love_low_age}</p>
              <p className="text-red-300 text-xs">{chartData.love_low_event}</p>
              {loveLowData && (
                <p className="text-red-400 text-xs mt-1">{loveLowData.love}pt</p>
              )}
            </div>
          </div>
        </div>

        {/* AI 조언 */}
        <div className="px-6 py-4 bg-slate-800/50">
          <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/30">
            <p className="text-purple-400 text-sm font-bold mb-2">
              🔮 AI 인생 조언 (농담)
            </p>
            <p className="text-gray-300 text-sm">
              {chartData.wealth_pattern === "late_bloomer" && chartData.love_pattern === "late_bloomer"
                ? "돈도 사랑도 나중에 옵니다. 그냥 존버하세요."
                : chartData.wealth_pattern === "pump_dump" && chartData.love_pattern === "stable"
                ? "젊을 때 돈 벌고, 사랑은 평생 꾸준히. 럭키!"
                : chartData.love_pattern === "pump_dump"
                ? "20대 불태우고, 30대부터는 혼자가 편함."
                : chartData.wealth_pattern === "growth" && chartData.love_pattern === "growth"
                ? "인생 승리자 예감. 부럽습니다."
                : chartData.wealth_pattern === "volatility"
                ? "재물운 롤러코스터... 멘탈 꽉 잡으세요."
                : chartData.love_pattern === "volatility"
                ? "연애도 주식처럼 등락합니다. 감정 컨트롤 필수."
                : "재물과 사랑, 둘 다 잡으려다 둘 다 놓칠 수 있어요. 선택과 집중!"}
            </p>
          </div>
        </div>

        {/* 사용자 정보 */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">일간:</span>
              <span className="text-white font-bold">
                {saju_analysis.day_master_korean}({saju_analysis.day_master})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">주 기운:</span>
              <span className="text-cyan-400 font-bold">
                {saju_analysis.main_trait_korean}
              </span>
            </div>
          </div>
        </div>

        {/* 워터마크 */}
        <div className="bg-slate-950 px-6 py-3 text-center">
          <p className="text-slate-600 text-xs font-mono">
            NOT FINANCIAL OR LOVE ADVICE | life-receipt-store.netlify.app
          </p>
        </div>
      </div>
    </div>
  );
}
