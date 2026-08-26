---
"@byuckchon-frontend/settings": minor
---

motion 유틸리티가 Tailwind v3 프로젝트에서도 동작하도록 plugin 추가

- `@byuckchon-frontend/settings/motion/plugin`: Tailwind v3 plugin API(`addUtilities`)로 작성된 motion 유틸리티. `tailwind.config.js`의 `plugins`에 등록해서 사용.
- 기존 `motion.tokens.css` / `motion.utilities.css`(v4 `@utility`)는 변경 없음.
- `peerDependencies.tailwindcss`를 `^3.0.0 || ^4.0.0`으로 확장.
