# Life Receipt - 변경 이력

## 2026-02-05 (수) - 원피스 스타일 현상수배서 완성

### 개선 사항

#### WantedView 컴포넌트 원피스 스타일 업그레이드

**추가된 요소:**
- 세계정부(World Government) 마크 SVG 컴포넌트 추가
  - 배경 워터마크로 대형 마크 표시
  - 좌측 하단에 승인 스탬프 형태로 작은 마크 배치
  - W.G. 텍스트 포함

**비주얼 개선:**
- WANTED 타이틀
  - 크기 5xl → 6xl 확대
  - 다층 그림자 효과로 더 입체적인 느낌
  - 레터 스페이싱 증가

- 초상화 프레임
  - 이중 테두리 구조 (외부 6px + 내부 2px)
  - 크기 200x250 → 220x270 확대
  - 베이지색 패딩 추가
  - 입체감을 위한 inset 그림자 강화

- 현상금 표시
  - 베이지색 박스로 강조
  - 크기 4xl → 5xl 확대
  - 베리(฿) 기호 더 작게, 하이픈 추가

- MARINE 스탬프
  - 더 굵은 테두리 (4px)
  - 회전각 -15deg → -20deg로 증가
  - 폰트 크기 1.1rem → 1.3rem 확대
  - 반투명 흰색 그림자 추가

**배경 효과:**
- 방사형 그라디언트 오버레이 추가
- 구겨진 종이 텍스처 (사선 패턴)
- 테두리 추가 (3px solid #8b7355)
- 그림자 강화

**색상 스키마 변경:**
- 죄목 섹션: 양피지 색상 유지, 테두리 강화
- 범죄 기록: 세리프 폰트로 변경
- 악명 높은 행적: 진한 붉은색 배경(#8b0000 → #5a0000)으로 변경, 흰색 텍스트
- 목격 정보: 해군 파란색 배경(#1a3a6a)
- 특별 경고: 진한 붉은색 배경(#4a0a0a)

**하단 요소:**
- "WORLD GOVERNMENT · MARINE HEADQUARTERS" 바 추가
- 해군 파란색 그라디언트 배경

### 기술 스택
- React 18
- Next.js 14.2.35
- TypeScript
- Tailwind CSS (인라인 스타일)

### 빌드 결과
- 메인 번들 크기: 179 kB
- First Load JS: 266 kB
- 빌드 시간: ~54초

---

## 배포 가이드

### Netlify 배포 방법

**현재 배포 URL:**
- Production: https://life-receipt-store.netlify.app
- 최신 배포: https://6984a4a37c9ab800c00b3df2--life-receipt-store.netlify.app

**배포 명령어:**
```bash
# 프로젝트 디렉토리로 이동
cd /home/trader/business/saju/life-receipt

# 프로덕션 빌드
npm run build

# Netlify 프로덕션 배포
npx netlify deploy --prod
```

**netlify.toml 설정:**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/api/analyze"
  to = "http://184.174.37.242:8000/analyze"
  status = 200
  force = true

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**배포 프로세스:**
1. Next.js 빌드 실행
2. Functions 번들링
3. CDN 파일 업로드 (diff 방식)
4. 실시간 배포

### Git 저장 방법

```bash
# 변경사항 확인
git status

# 모든 파일 스테이징
git add .

# 커밋
git commit -m "feat: Upgrade WantedView to authentic One Piece bounty poster style

- Add World Government seal (watermark + stamp)
- Enhance WANTED title with multi-layer shadows
- Upgrade portrait frame with double borders
- Emphasize bounty amount with highlighted box
- Style MARINE stamp with rotation and bold font
- Add 'WORLD GOVERNMENT · MARINE HEADQUARTERS' footer
- Change notorious actions section to dark red background
- Apply navy blue/red theme to info sections

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 원격 저장소에 푸시
git push origin main
```

**Git 초기 설정 (처음 한 번만):**
```bash
cd /home/trader/business/saju/life-receipt

# Git 초기화 (이미 되어있다면 생략)
git init

# 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/life-receipt.git

# 첫 푸시
git branch -M main
git push -u origin main
```

---

## 백엔드 서버 관리

### FastAPI 서버 실행
```bash
cd /home/trader/business/saju

# 서버 시작 (백그라운드)
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload > api.log 2>&1 &

# 서버 상태 확인
ps aux | grep uvicorn

# 로그 확인
tail -f api.log
```

### 현재 실행 중인 서비스
- **Backend API**: http://184.174.37.242:8000 (port 8000)
- **Frontend Dev**: http://localhost:3000 (port 3000)
- **Frontend Prod**: https://life-receipt-store.netlify.app

---

## 프로젝트 구조

```
life-receipt/
├── app/
│   ├── page.tsx          # 메인 페이지
│   └── layout.tsx        # 레이아웃
├── components/
│   ├── WantedView.tsx    # 원피스 현상수배서 (최근 업데이트)
│   ├── ScandalView.tsx   # 연예인 스캔들 테마
│   ├── ChartView.tsx     # 인생 차트 테마
│   ├── PastLifeView.tsx  # 전생 테마
│   ├── MemeView.tsx      # 밈 테마
│   ├── LoveView.tsx      # 연애운 테마
│   └── HospitalView.tsx  # 병원 진단서 테마
├── netlify.toml          # Netlify 설정
├── next.config.js        # Next.js 설정
├── package.json
└── CHANGELOG.md          # 이 파일

../main.py                # FastAPI 백엔드
../celebrity_db.csv       # 연예인 데이터베이스
../data.csv               # 테마 데이터
```

---

## 다음 업데이트 예정

- [ ] Chart 테마 개선
- [ ] PastLife 테마 추가 시대 확장
- [ ] Scandal 테마 기사 스타일 다양화
- [ ] 성능 최적화 (번들 크기 감소)
- [ ] 모바일 UX 개선

---

**마지막 업데이트:** 2026-02-05
**버전:** v1.8.0
**작업자:** Claude Code
