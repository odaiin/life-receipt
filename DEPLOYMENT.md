# 배포 및 개발 가이드

## 목차
- [로컬 개발 환경 설정](#로컬-개발-환경-설정)
- [Netlify 배포](#netlify-배포)
- [Git 저장소 관리](#git-저장소-관리)
- [백엔드 API 서버](#백엔드-api-서버)
- [트러블슈팅](#트러블슈팅)

---

## 로컬 개발 환경 설정

### 1. 프론트엔드 (Next.js)

```bash
# 프로젝트 디렉토리로 이동
cd /home/trader/business/saju/life-receipt

# 의존성 설치
npm install

# 개발 서버 실행 (포트 3000)
npm run dev -- -p 3000
```

개발 서버 접속: http://localhost:3000

### 2. 백엔드 (FastAPI)

```bash
# 백엔드 디렉토리로 이동
cd /home/trader/business/saju

# Python 의존성 설치
pip install -r requirements.txt

# 개발 서버 실행
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# 또는 백그라운드 실행
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload > api.log 2>&1 &
```

API 서버 접속: http://localhost:8000
API 문서: http://localhost:8000/docs

---

## Netlify 배포

### 자동 배포 (권장)

Netlify는 Git 저장소와 연결되어 있어 `main` 브랜치에 푸시하면 자동으로 배포됩니다.

```bash
cd /home/trader/business/saju/life-receipt

# 변경사항 커밋
git add .
git commit -m "feat: your feature description

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 푸시 (자동 배포 트리거)
git push origin main
```

### 수동 배포

```bash
cd /home/trader/business/saju/life-receipt

# 프로덕션 빌드
npm run build

# Netlify 프로덕션 배포
npx netlify deploy --prod
```

### 배포 상태 확인

- **Production URL**: https://life-receipt-store.netlify.app
- **Netlify Dashboard**: https://app.netlify.com/projects/life-receipt-store
- **Build Logs**: https://app.netlify.com/projects/life-receipt-store/deploys

### netlify.toml 설정 설명

```toml
[build]
  command = "npm run build"    # 빌드 명령어
  publish = ".next"             # 배포할 디렉토리

[[plugins]]
  package = "@netlify/plugin-nextjs"  # Next.js 플러그인

# API 프록시 (CORS 회피)
[[redirects]]
  from = "/api/analyze"
  to = "http://184.174.37.242:8000/analyze"
  status = 200
  force = true

# 정적 파일 캐싱
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## Git 저장소 관리

### 초기 설정 (처음 한 번만)

```bash
cd /home/trader/business/saju/life-receipt

# Git 초기화
git init

# 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/life-receipt.git

# 기본 브랜치 설정
git branch -M main

# 첫 커밋
git add .
git commit -m "chore: Initial commit"

# 첫 푸시
git push -u origin main
```

### 일반적인 워크플로우

```bash
# 1. 변경사항 확인
git status

# 2. 변경 파일 스테이징
git add .
# 또는 특정 파일만
git add components/WantedView.tsx

# 3. 커밋
git commit -m "feat: Add new feature

- Feature description
- Another feature

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 4. 푸시
git push origin main
```

### 커밋 메시지 컨벤션

```
<type>: <subject>

<body>

<footer>
```

**타입:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드/설정 변경

**예시:**
```bash
git commit -m "feat: Add One Piece style bounty poster

- Add World Government seal
- Enhance WANTED title styling
- Improve portrait frame borders
- Add MARINE headquarters footer

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### .gitignore 확인

다음 파일들은 Git에 포함되지 않아야 합니다:

```
node_modules/
.next/
.netlify/
*.log
.env
.env.local
```

---

## 백엔드 API 서버

### 서버 실행

```bash
cd /home/trader/business/saju

# 백그라운드 실행
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload > api.log 2>&1 &
```

### 서버 상태 확인

```bash
# 프로세스 확인
ps aux | grep uvicorn

# 로그 확인 (실시간)
tail -f /home/trader/business/saju/api.log

# 로그 확인 (최근 50줄)
tail -50 /home/trader/business/saju/api.log

# 헬스체크
curl http://localhost:8000/health
```

### 서버 중지

```bash
# PID 확인
ps aux | grep uvicorn

# 프로세스 종료 (PID를 확인 후)
kill <PID>

# 또는 강제 종료
pkill -f uvicorn
```

### 서버 재시작

```bash
# 기존 프로세스 종료
pkill -f uvicorn

# 새로 시작
cd /home/trader/business/saju
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload > api.log 2>&1 &
```

### API 엔드포인트

- **POST /analyze**: 사주 분석
  ```bash
  curl -X POST http://184.174.37.242:8000/analyze \
    -H "Content-Type: application/json" \
    -d '{
      "year": 1990,
      "month": 5,
      "day": 15,
      "hour": 10,
      "gender": "male",
      "calendar": "solar",
      "mbti": "INTJ"
    }'
  ```

- **GET /health**: 헬스체크
  ```bash
  curl http://184.174.37.242:8000/health
  ```

---

## 트러블슈팅

### 1. 빌드 실패

**문제:** `npm run build` 실패

**해결:**
```bash
# 캐시 정리
rm -rf .next node_modules package-lock.json

# 재설치
npm install

# 다시 빌드
npm run build
```

### 2. Netlify 배포 실패

**문제:** "Deploy directory not found"

**해결:**
```bash
# publish 경로 확인
# netlify.toml에서 publish = ".next" 확인

# 빌드 후 배포
npm run build
npx netlify deploy --prod
```

### 3. API 연결 실패

**문제:** 프론트엔드에서 API 요청 실패

**해결:**
```bash
# 백엔드 서버 상태 확인
ps aux | grep uvicorn

# 포트 확인
netstat -tulpn | grep 8000

# 서버 재시작
pkill -f uvicorn
cd /home/trader/business/saju
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload > api.log 2>&1 &

# Netlify proxy 설정 확인
cat netlify.toml | grep -A 5 redirects
```

### 4. CORS 에러

**문제:** 브라우저 콘솔에서 CORS 에러

**해결:**
백엔드 `main.py`에서 CORS 설정 확인:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 또는 특정 도메인
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 5. 개발 서버 포트 충돌

**문제:** "Port 3000 is already in use"

**해결:**
```bash
# 포트 사용 프로세스 확인
lsof -i :3000

# 프로세스 종료
kill -9 <PID>

# 다른 포트로 실행
npm run dev -- -p 3001
```

---

## 모니터링

### 로그 확인

```bash
# 백엔드 로그
tail -f /home/trader/business/saju/api.log

# Netlify 빌드 로그
# Netlify Dashboard에서 확인

# 개발 서버 로그
# 터미널에서 실시간 확인
```

### 성능 모니터링

- Netlify Analytics: https://app.netlify.com/projects/life-receipt-store/analytics
- Browser DevTools: Network, Performance 탭

---

## 유용한 명령어 모음

```bash
# 프론트엔드 빌드 및 배포
cd /home/trader/business/saju/life-receipt
npm run build && npx netlify deploy --prod

# 백엔드 재시작
pkill -f uvicorn && cd /home/trader/business/saju && nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload > api.log 2>&1 &

# Git 커밋 및 푸시 (자동 배포)
git add . && git commit -m "feat: Update" && git push origin main

# 전체 재시작 (백엔드 + 프론트엔드 배포)
pkill -f uvicorn && cd /home/trader/business/saju && nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload > api.log 2>&1 & && cd life-receipt && npm run build && npx netlify deploy --prod
```

---

**문서 버전:** 1.0
**최종 업데이트:** 2026-02-05
