# @byuckchon-frontend/settings

## 1.8.0

### Minor Changes

- f89522f: PR 본문을 섹션별로 채우도록 변경하고, 제목을 첫 커밋에서 만듭니다.

  - 마커를 두 벌로 나눴습니다. 커밋 내역은 `byuckchon:commits`, 리뷰 포인트는
    `byuckchon:notes` 구간에 들어갑니다. 템플릿의 "작업 내용"과 "확인 사항"에
    각각 배치할 수 있습니다.
  - PR 제목을 첫 커밋 메시지에서 만듭니다. 타입 접두사(`feat:` 등)는 뗍니다.
    `feat: 드롭다운 속도 수정` + `feature/page/hyuk` → `[feature] 드롭다운 속도 수정`
    직접 쓴 제목이 있으면 그것을 쓰고, 접두사만 떼어 대괄호를 붙입니다.
  - `byuckchon:notes` 마커가 없는 기존 템플릿에서는 이전처럼 한 구간에 함께 넣습니다.

### Patch Changes

- f89522f: prettier 와 ESLint 의 import 정렬 기준을 통일

  서로 다른 그룹 기준으로 빈 줄을 요구해서, 저장하면 prettier 가 빈 줄을 없애고
  그 결과를 ESLint 가 다시 지적하는 상황이었습니다.

  두 도구 모두 `react → next → 외부 → @/ → 상대경로` 순서에 그룹 간 빈 줄 없음으로 맞췄습니다.

## 1.7.1

### Patch Changes

- 7c3c8bd: 생성되는 `tokens.css`의 `@theme` 블록에서 색상 변수를 그림자 변수보다 먼저 출력합니다.

  그림자가 색상 변수를 참조하는 경우가 많아, 읽을 때 참조 대상이 위에 오도록 정리했습니다.
  CSS 변수는 선언 순서와 무관하게 해석되므로 동작은 이전과 같습니다.

  boxShadow 지원 자체는 1.6.0 부터 제공되고 있습니다. 단일 레이어·다중 레이어,
  `innerShadow`(→ `inset`), 색상 참조 유지, 단위 없는 숫자의 `px` 보정을 포함합니다.

## 1.7.0

### Minor Changes

- 8ee1888: PR 본문에 커밋 내역을 자동으로 채워 넣는 `byuckchon-pr-description` 명령 추가

  PR 의 커밋을 타입별로 묶어 description 에 반영합니다.

  ```bash
  GH_TOKEN=... REPO=owner/repo PR_NUMBER=12 npx byuckchon-pr-description
  ```

  - 사람이 쓴 내용은 건드리지 않고 `<!-- byuckchon:commits:start -->` 마커 사이만 갱신합니다.
    마커가 없으면 본문 끝에 덧붙이므로 PR 템플릿이 없어도 동작합니다.
  - 커밋 본문의 `NOTE:` / `TODO:` 줄을 "리뷰 포인트"로 모아 커밋 내역 아래에 붙입니다.
  - PR 제목에 브랜치 유형을 대괄호로 붙입니다.
    `feature/update-mypage-style/hyuk` + "마이페이지 디자인 적용" → "[feature] 마이페이지 디자인 적용"
    사람이 쓴 제목은 그대로 두고 앞에만 붙이며, 이미 대괄호가 있으면 건드리지 않습니다.
  - 머지 커밋은 제외하고, `feat(scope):` 의 scope 와 `feat!:` 의 Breaking Changes 를 구분합니다.
  - 컨벤션을 안 지킨 커밋은 버리지 않고 "분류 없음"으로 모읍니다.
  - 같은 내용이면 API 를 호출하지 않아 여러 번 실행해도 안전합니다.
  - `GITHUB_API_URL` 을 지원해 GHES 에서도 동작합니다.

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
