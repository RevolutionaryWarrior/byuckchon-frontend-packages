# @byuckchon-frontend/settings

## 1.4.1

### Patch Changes

- 97c6e92: ESLINT_GUIDE 문서 수정 및 규칙 수정

## 1.4.0

### Minor Changes

- 520f875: 공통 ESLint 컨벤션 플러그인, RDJSON formatter, GitHub PR 리뷰 댓글 게시 CLI를 추가합니다.

## 1.3.0

### Minor Changes

- 7ea2cec: Tailwind v3 motion plugin can now be imported from TypeScript Tailwind config files without `require`, and the docs include the `tailwind.config.ts` setup.

## 1.2.0

### Minor Changes

- 9856cba: motion 유틸리티가 Tailwind v3 프로젝트에서도 동작하도록 plugin 추가

  - `@byuckchon-frontend/settings/motion/plugin`: Tailwind v3 plugin API(`addUtilities`)로 작성된 motion 유틸리티. `tailwind.config.js`의 `plugins`에 등록해서 사용.
  - 기존 `motion.tokens.css` / `motion.utilities.css`(v4 `@utility`)는 변경 없음.
  - `peerDependencies.tailwindcss`를 `^3.0.0 || ^4.0.0`으로 확장.

## 1.1.0

### Minor Changes

- 81e6b97: update motion-label-float

## 1.0.0

### Major Changes

- 8186c79: create motion setting
