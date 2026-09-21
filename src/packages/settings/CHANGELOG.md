# @byuckchon-frontend/settings

## 1.6.0

### Minor Changes

- 4551fe6: 프로젝트 공통 설정을 settings로 통합 (ESLint / Prettier / tsconfig / VS Code)

  - `./eslint/base` `./eslint/react` `./eslint/next` `./eslint/review` — 바로 쓰는 flat config.
    ESLint 플러그인은 이 패키지의 dependencies라 프로젝트는 `eslint`만 설치하면 됩니다.
  - `./prettier` — 포맷 규칙 프리셋
  - `./tsconfig/{base,react,next,library,node}.json` — `extends` 로 참조하는 tsconfig 프리셋
  - `./vscode` + `byuckchon-settings-sync` — extends 가 없는 VS Code 설정을 위한 동기화 명령
  - `./types/svg-vite` `./types/svg-next` — 에셋 모듈 타입 선언
  - `./versions` — 검증된 스택 버전 매트릭스
  - `byuckchon-settings-sync` 가 `.vscode/settings.json` 외에 `.nvmrc` / `.npmrc` / `turbo.json` 도
    관리합니다. 프로젝트 유형(단일·모노레포)을 감지해 해당하는 것만 처리합니다.
  - CLI가 복사해 뿌리던 컨벤션 규칙 사본(`tools/eslint-rules/`)을 제거하고 이 패키지를
    단일 출처로 삼습니다. 두 사본은 이미 273줄 차이로 벌어져 있었습니다.

## 1.5.0

### Minor Changes

- 025ca81: update tokens-animation & connect cli
- 025ca81: Style Dictionary 프리셋 추가 (`@byuckchon-frontend/settings/tokens`) + 모션 easing 통일

  - `defineTokenConfig()`로 프로젝트 `token.config.js`를 2줄로 대체
  - color / typography에 더해 motion 등 나머지 토큰을 `:root` 변수로 출력
  - typography는 `@utility text-*` (Tailwind v4 문법)로 출력
  - `boxShadow` 토큰을 `@theme`의 `--shadow-*`로 출력. 색상 참조(`{shadow.ambient.8}`)는
    값으로 풀지 않고 `var(--color-shadow-ambient-8)`로 유지
  - Figma ↔ CSS 값 차이 보정: letterSpacing `%` → `em`, fontWeight 이름 → 숫자,
    lineHeight `AUTO` → `normal`, 토큰명의 공백·언더스코어 → `-`
  - fontFamily가 숫자인 경우 등 잘못 입력된 토큰은 빌드 시 경고
  - `duration` / `delay` 토큰의 단위 없는 숫자에 `ms` 자동 부여, easing 배열을 `cubic-bezier()`로 변환
  - settings에 없는 `--motion-*` 이름은 빌드 시 경고로 오타 탐지
  - `motion-collapse` / `motion-rotate` / `motion-tab-indicator`가 하드코딩된 `ease-out` 대신
    `var(--motion-ease-out)`을 사용하도록 통일. **세 모션의 감속 곡선이 실제로 달라지므로**
    적용 후 육안 확인을 권장합니다.
  - 디자이너용 모션 문서(MOTION_DESIGN_GUIDE.md) 추가

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
