---
"@byuckchon-frontend/hooks": patch
"@byuckchon-frontend/core": patch
---

빌드 결과(index.mjs · index.umd.js) 맨 위에 `"use client"` 를 붙였습니다.

- Next App Router 의 서버 컴포넌트에서 import 해도 더 이상 에러가 나지 않습니다.
  (훅·컴포넌트는 그대로 클라이언트에서 실행됩니다)
