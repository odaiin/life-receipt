# 빠른 시작 가이드

## 개발 환경 실행 (30초)

```bash
# 1. 백엔드 서버 시작
cd /home/trader/business/saju
pkill -f uvicorn  # 기존 프로세스 종료
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload > api.log 2>&1 &

# 2. 프론트엔드 개발 서버 시작
cd life-receipt
npm run dev -- -p 3000
```

접속: http://localhost:3000

---

## 프로덕션 배포 (1분)

```bash
cd /home/trader/business/saju/life-receipt

# Git 커밋 & 푸시 (자동 배포)
git add .
git commit -m "feat: Update

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main
```

또는 수동 배포:

```bash
npm run build
npx netlify deploy --prod
```

---

## 자주 쓰는 명령어

### 서버 관리

```bash
# 백엔드 상태 확인
ps aux | grep uvicorn

# 백엔드 로그 확인
tail -f /home/trader/business/saju/api.log

# 백엔드 재시작
pkill -f uvicorn && cd /home/trader/business/saju && nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload > api.log 2>&1 &
```

### 프론트엔드

```bash
cd /home/trader/business/saju/life-receipt

# 개발 서버
npm run dev -- -p 3000

# 빌드
npm run build

# 배포
npx netlify deploy --prod
```

### Git

```bash
# 일반 푸시
git add .
git commit -m "feat: Your message"
git push origin main

# 파일 특정
git add components/WantedView.tsx
git commit -m "fix: Fix wanted view"
git push
```

---

## 문제 해결

### API 연결 안 됨
```bash
curl http://184.174.37.242:8000/health
# 응답 없으면 백엔드 재시작
```

### 포트 충돌
```bash
lsof -i :3000  # PID 확인
kill -9 <PID>  # 프로세스 종료
```

### 빌드 실패
```bash
rm -rf .next node_modules
npm install
```

---

## 유용한 링크

- **프로덕션**: https://life-receipt-store.netlify.app
- **API 문서**: http://184.174.37.242:8000/docs
- **Netlify**: https://app.netlify.com/projects/life-receipt-store

## 더 자세한 정보

- [README.md](./README.md) - 프로젝트 개요
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 상세한 배포 가이드
- [CHANGELOG.md](./CHANGELOG.md) - 변경 이력
