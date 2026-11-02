---
"@byuckchon-frontend/basic-ui": patch
---

빌드 도구 `tailwindcss` · `@tailwindcss/vite` · `vite-plugin-svgr` 를 devDependencies 로 옮겼습니다.

- 배포되는 `dist` 는 이미 컴파일된 CSS · 컴포넌트라서 사용하는 쪽에 빌드 도구가 필요 없습니다.
- basic-ui 를 설치할 때 함께 깔리던 패키지가 줄어듭니다.
