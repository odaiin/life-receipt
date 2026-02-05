#!/bin/bash
# 빌드 후 Netlify 배포
npm run build && npx netlify deploy --prod
