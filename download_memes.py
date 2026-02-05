#!/usr/bin/env python3
"""
밈(Meme) 이미지 자동 다운로드 스크립트
인간 영수증 앱 - 짤방 테마용
"""

import os
import requests
from pathlib import Path

# 다운로드할 밈 이미지 목록 (파일명: URL)
# imgflip, knowyourmeme 등의 템플릿 이미지 사용
MEME_URLS = {
    # This is fine - 불타는 집 강아지
    "this_is_fine.jpg": "https://i.imgflip.com/1nhqil.jpg",

    # Distracted Boyfriend - 딴 여자 보는 남자
    "distracted_bf.jpg": "https://i.imgflip.com/1ur9b0.jpg",

    # Clown Makeup - 광대 분장
    "clown_makeup.jpg": "https://i.imgflip.com/38el31.jpg",

    # Drowning High Five - 물에 빠진 사람 하이파이브
    "drowning_highfive.jpg": "https://i.imgflip.com/1wz1x0.jpg",

    # Expanding Brain - 뇌 확장 짤
    "galaxy_brain.jpg": "https://i.imgflip.com/1jwhww.jpg",

    # Pepe Sad - 슬픈 페페
    "pepe_crying.jpg": "https://i.imgflip.com/2r8qh4.png",

    # Drake Hotline Bling - 드레이크 거절/승낙
    "drake_no.jpg": "https://i.imgflip.com/30b1gx.jpg",

    # Monkey Puppet - 곁눈질 원숭이
    "sweating_guy.jpg": "https://i.imgflip.com/1c1uej.jpg",

    # Disaster Girl - 불타는 집 앞 소녀
    "disaster_girl.jpg": "https://i.imgflip.com/23ls.jpg",

    # Exit This Way - 비상구 달리는 사람
    "exit_this_way.jpg": "https://i.imgflip.com/1r7eny.jpg",

    # Imagination - 스폰지밥 상상
    "imagination.jpg": "https://i.imgflip.com/1otk96.jpg",

    # Thinking Hard - 열심히 생각
    "thinking_hard.jpg": "https://i.imgflip.com/1h7in3.jpg",

    # Hold My Beer - 맥주 들고 있어봐
    "hold_my_beer.jpg": "https://i.imgflip.com/1yxkcp.jpg",

    # Pointing Man - 가리키는 남자
    "pointing_man.jpg": "https://i.imgflip.com/2wifvo.jpg",

    # Thanos Snap - 타노스 핑거스냅
    "thanos_snap.jpg": "https://i.imgflip.com/28j0te.jpg",

    # Elmo Fire - 불 앞의 엘모
    "elmo_fire.jpg": "https://i.imgflip.com/21uy0f.jpg",

    # Fine Dog (alternative)
    "fine_dog.jpg": "https://i.imgflip.com/wxica.jpg",

    # Cold Stare
    "cold_stare.jpg": "https://i.imgflip.com/26am.jpg",

    # Pepe Comfy - 편안한 페페
    "pepe_comfy.jpg": "https://i.imgflip.com/3pnmg.jpg",
}

def download_memes():
    """밈 이미지 다운로드"""
    # public/memes 폴더 생성
    memes_dir = Path(__file__).parent / "public" / "memes"
    memes_dir.mkdir(parents=True, exist_ok=True)

    print(f"📁 저장 위치: {memes_dir}")
    print(f"📥 다운로드 시작... ({len(MEME_URLS)}개 파일)\n")

    success = 0
    failed = []

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    for filename, url in MEME_URLS.items():
        filepath = memes_dir / filename

        # 이미 존재하면 스킵
        if filepath.exists():
            print(f"⏭️  {filename} - 이미 존재함 (스킵)")
            success += 1
            continue

        try:
            print(f"⬇️  {filename} 다운로드 중...", end=" ")
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()

            with open(filepath, "wb") as f:
                f.write(response.content)

            print(f"✅ 완료 ({len(response.content) // 1024}KB)")
            success += 1

        except Exception as e:
            print(f"❌ 실패: {e}")
            failed.append(filename)

    print(f"\n{'='*50}")
    print(f"✅ 성공: {success}개")
    if failed:
        print(f"❌ 실패: {len(failed)}개 - {', '.join(failed)}")
    print(f"\n💡 이제 앱에서 짤방 테마를 사용할 수 있습니다!")

if __name__ == "__main__":
    download_memes()
