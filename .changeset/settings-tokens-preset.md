---
"@byuckchon-frontend/settings": minor
---

Style Dictionary 프리셋 추가 (`@byuckchon-frontend/settings/tokens`) + 모션 easing 통일

- `defineTokenConfig()`로 프로젝트 `token.config.js`를 2줄로 대체
- color / typography에 더해 motion 등 나머지 토큰을 `:root` 변수로 출력
- typography는 `@utility text-*` (Tailwind v4 문법)로 출력
- `duration` / `delay` 토큰의 단위 없는 숫자에 `ms` 자동 부여, easing 배열을 `cubic-bezier()`로 변환
- settings에 없는 `--motion-*` 이름은 빌드 시 경고로 오타 탐지
- `motion-collapse` / `motion-rotate` / `motion-tab-indicator`가 하드코딩된 `ease-out` 대신
  `var(--motion-ease-out)`을 사용하도록 통일. **세 모션의 감속 곡선이 실제로 달라지므로**
  적용 후 육안 확인을 권장합니다.
- 디자이너용 모션 문서(MOTION_DESIGN_GUIDE.md) 추가
