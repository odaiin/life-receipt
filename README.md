# 인간 영수증 (Life Receipt)

> 당신의 사주팔자를 8가지 재밌는 테마로 분석해드립니다

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_SITE_ID/deploy-status)](https://app.netlify.com/projects/life-receipt-store/deploys)

## 🌐 라이브 데모

**프로덕션:** https://life-receipt-store.netlify.app

## 🎭 8가지 테마

1. **영수증 (Receipt)** - 당신의 인생을 물건으로 환산
2. **현상수배서 (Wanted)** - 원피스 스타일 현상금 수배서
3. **병원 진단서 (Hospital)** - 당신의 성격을 질병으로 진단
4. **전생 (Past Life)** - 과거 생의 황당한 이야기
5. **연애운 (Love)** - 썸타는 방법과 연애 팁
6. **밈 (Meme)** - MBTI별 웃긴 밈 이미지
7. **차트 (Chart)** - 인생 재산/애정 그래프
8. **스캔들 (Scandal)** - 연예인 열애설 기사

## 🛠 기술 스택

### 프론트엔드
- **Next.js 14.2.35** - React 프레임워크
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링
- **SVG** - 커스텀 일러스트레이션

### 백엔드
- **FastAPI** - Python 웹 프레임워크
- **Uvicorn** - ASGI 서버
- **Korean Lunar Calendar** - 음력 변환
- **CSV** - 데이터베이스

### 배포
- **Netlify** - 프론트엔드 호스팅
- **VPS** - 백엔드 API 서버 (184.174.37.242:8000)

## 🚀 빠른 시작

### 프론트엔드 실행

```bash
cd life-receipt
npm install
npm run dev -- -p 3000
```

개발 서버: http://localhost:3000

### 백엔드 실행

```bash
cd ../
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

API 서버: http://localhost:8000

## 📦 프로젝트 구조

```
life-receipt/
├── app/
│   ├── page.tsx              # 메인 페이지 (테마 선택)
│   ├── layout.tsx            # 레이아웃
│   └── globals.css           # 전역 스타일
├── components/
│   ├── WantedView.tsx        # 원피스 현상수배서 ⭐
│   ├── ScandalView.tsx       # 연예인 스캔들
│   ├── ChartView.tsx         # 인생 차트
│   ├── PastLifeView.tsx      # 전생 스토리
│   ├── MemeView.tsx          # MBTI 밈
│   ├── LoveView.tsx          # 연애운
│   └── HospitalView.tsx      # 병원 진단서
├── public/                   # 정적 파일
├── netlify.toml              # Netlify 설정
├── next.config.js            # Next.js 설정
├── package.json
├── CHANGELOG.md              # 변경 이력
├── DEPLOYMENT.md             # 배포 가이드
└── README.md                 # 이 파일

../
├── main.py                   # FastAPI 백엔드
├── celebrity_db.csv          # 연예인 데이터베이스
├── data.csv                  # 테마 데이터
└── requirements.txt          # Python 의존성
```

## 🎨 최근 업데이트 (2026-02-05)

### 원피스 스타일 현상수배서 완성

WantedView 컴포넌트를 원피스(One Piece) 애니메이션 현상금 수배서 스타일로 완전히 재디자인했습니다.

**주요 변경사항:**
- ⚓ 세계정부(World Government) 공식 마크 추가
- 📜 양피지 텍스처와 구겨진 종이 효과
- 💰 베리(฿) 현상금 강조 박스
- 🎨 이중 테두리 초상화 프레임
- ⚡ MARINE 스탬프와 본부 바 추가
- 🎭 16개 MBTI별 커스텀 SVG 초상화
- 🌊 해군 파란색/붉은색 테마

자세한 내용은 [CHANGELOG.md](./CHANGELOG.md)를 확인하세요.

## 📖 문서

- **[CHANGELOG.md](./CHANGELOG.md)** - 상세한 변경 이력
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - 배포 및 개발 가이드

## 🚀 배포

### 자동 배포

`main` 브랜치에 푸시하면 Netlify가 자동으로 배포합니다.

```bash
git add .
git commit -m "feat: Your feature"
git push origin main
```

### 수동 배포

```bash
npm run build
npx netlify deploy --prod
```

자세한 배포 방법은 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

## 🔗 링크

- **프로덕션**: https://life-receipt-store.netlify.app
- **Netlify Dashboard**: https://app.netlify.com/projects/life-receipt-store
- **API Docs**: http://184.174.37.242:8000/docs
- **API Health**: http://184.174.37.242:8000/health

## 📊 성능

- **메인 번들**: 179 kB
- **First Load JS**: 266 kB
- **빌드 시간**: ~54초

## 🐛 트러블슈팅

문제가 발생하면 [DEPLOYMENT.md의 트러블슈팅 섹션](./DEPLOYMENT.md#트러블슈팅)을 확인하세요.

### 자주 묻는 질문

**Q: API 연결이 안 돼요**
```bash
# 백엔드 서버 상태 확인
ps aux | grep uvicorn

# 서버 재시작
pkill -f uvicorn
cd /home/trader/business/saju
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload > api.log 2>&1 &
```

**Q: 빌드가 실패해요**
```bash
# 캐시 정리 후 재설치
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## 🤝 기여

이 프로젝트는 Claude Code로 개발되었습니다.

## 📄 라이선스

This project is for entertainment purposes only.

---

**Made with ❤️ using Claude Code**

**Version:** 1.8.0
**Last Updated:** 2026-02-05
