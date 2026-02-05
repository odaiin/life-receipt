"use client";

import { useState } from "react";

interface SajuAnalysis {
  day_master: string;
  day_master_korean: string;
  day_master_element: string;
  main_trait: string;
  main_trait_korean: string;
}

interface MemeTheme {
  image: string;
  text_top: string;
  text_bottom: string;
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
    meme?: MemeTheme;
  };
}

interface MemeViewProps {
  data: AnalyzeResponse;
}

// MBTI별 기본 밈 데이터 (폴백용) - 움짤 포함!
const MEME_DB: Record<string, { image: string; top: string; bottom: string }> = {
  ISTJ: { image: "facepalm.gif", top: "금요일 회식 공지", bottom: "나 (ISTJ): 주말 계획 다 틀어짐" },
  ISFJ: { image: "shocked_pikachu.gif", top: "친구: 부탁 하나만~", bottom: "나 (ISFJ): 또 당함" },
  INFJ: { image: "spongebob_ight.gif", top: "갑자기 술자리 분위기", bottom: "나 (INFJ): 슬쩍 퇴장" },
  INTJ: { image: "mind_blown.gif", top: "INTJ가 스몰토크 성공했을 때", bottom: "이게 되네?" },
  ISTP: { image: "deal_with_it.gif", top: "카톡 99+", bottom: "나 (ISTP): 내일 읽음" },
  ISFP: { image: "crying_kim.gif", top: "친구: 밖에 나와", bottom: "나 (ISFP): 집이 최고야 ㅠㅠ" },
  INFP: { image: "imagination.jpg", top: "INFP 머릿속", bottom: "현실: 방구석 / 망상: 세계여행" },
  INTP: { image: "cat_typing.gif", top: "나 (INTP) 새벽 3시", bottom: "위키피디아 서핑 중 (내일 출근)" },
  ESTP: { image: "dancing_coffin.gif", top: "ESTP: 이거 해도 됨?", bottom: "이미 저지르고 후회 없음" },
  ESFP: { image: "party_parrot.gif", top: "ESFP 회식날", bottom: "텐션 200% (집 가면 뻗음)" },
  ENFP: { image: "distracted_bf.jpg", top: "ENFP (여친 있음)", bottom: "새 취미 발견! (3일 후 버림)" },
  ENTP: { image: "this_is_fine.jpg", top: "나 (ENTP) 팩폭 후", bottom: "ㄱㅊ 사실인데 뭐 (관계 불타는 중)" },
  ESTJ: { image: "eye_roll.gif", top: "후배가 야근 안 하고 퇴근", bottom: "나 (ESTJ): 요즘 애들은..." },
  ESFJ: { image: "sweating_guy.jpg", top: "ESFJ: 다들 재밌어?", bottom: "혼자 오만가지 걱정 중 (아무도 신경 안 씀)" },
  ENFJ: { image: "facepalm.gif", top: "ENFJ 친구들한테", bottom: "내가 다 해줄게~ (번아웃 예정)" },
  ENTJ: { image: "money_rain.gif", top: "ENTJ 자기계발 후", bottom: "월급 두 배 각" },
};

export default function MemeView({ data }: MemeViewProps) {
  const { user_info, saju_analysis, theme_data } = data;
  const [imageError, setImageError] = useState(false);

  // 밈 데이터 가져오기 (API 우선, 폴백)
  const memeData = theme_data?.meme;
  const fallbackMeme = MEME_DB[user_info.mbti] || MEME_DB["ENTP"];

  const imageSrc = memeData?.image || fallbackMeme.image;
  const textTop = memeData?.text_top || fallbackMeme.top;
  const textBottom = memeData?.text_bottom || fallbackMeme.bottom;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="max-w-md mx-auto">
      {/* 밈 카드 */}
      <div className="bg-black rounded-3xl overflow-hidden shadow-2xl">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-black text-xl">내 인생 짤방</h2>
              <p className="text-white/70 text-sm">My Life as a Meme</p>
            </div>
            <div className="text-4xl">😂</div>
          </div>
        </div>

        {/* 밈 이미지 영역 */}
        <div className="relative aspect-square bg-gray-900">
          {/* 상단 텍스트 */}
          <div className="absolute top-4 left-0 right-0 z-10 px-4">
            <p
              className="text-white text-center font-black text-xl md:text-2xl uppercase"
              style={{
                textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 2px 0 0 #000, -2px 0 0 #000",
                letterSpacing: "1px",
              }}
            >
              {textTop}
            </p>
          </div>

          {/* 이미지 */}
          <img
            src={imageError ? "/memes/placeholder.svg" : `/memes/${imageSrc}`}
            alt="meme"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />

          {/* 하단 텍스트 */}
          <div className="absolute bottom-4 left-0 right-0 z-10 px-4">
            <p
              className="text-white text-center font-black text-xl md:text-2xl uppercase"
              style={{
                textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 2px 0 0 #000, -2px 0 0 #000",
                letterSpacing: "1px",
              }}
            >
              {textBottom}
            </p>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="bg-gray-900 px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🎭</span>
              <div>
                <p className="text-white font-bold text-lg">{user_info.mbti}</p>
                <p className="text-gray-400 text-sm">
                  {saju_analysis.main_trait_korean}({saju_analysis.main_trait}) 기운
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">일간</p>
              <p className="text-white font-bold">
                {saju_analysis.day_master_korean}({saju_analysis.day_master})
              </p>
            </div>
          </div>

          {/* 공유 유도 */}
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/30">
            <p className="text-center text-white/80 text-sm">
              ㅋㅋㅋ 이거 완전 나잖아 😂
            </p>
            <p className="text-center text-purple-300 text-xs mt-1">
              #내인생짤방 #MBTI밈 #{user_info.mbti}
            </p>
          </div>
        </div>

        {/* 워터마크 */}
        <div className="bg-black px-6 py-3 text-center">
          <p className="text-gray-600 text-xs">
            사주 × MBTI 짤방 생성기 | life-receipt-store.netlify.app
          </p>
        </div>
      </div>
    </div>
  );
}
