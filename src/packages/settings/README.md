# @byuckchon-frontend/settings

Byuckchon Frontend 프로젝트의 **기본 세팅 패키지**입니다.
`byuckchon-frontend-cli`로 프로젝트를 생성하면 자동으로 설치되며,
기존 프로젝트에는 아래 명령어로 추가할 수 있습니다.

```bash
npm install @byuckchon-frontend/settings
```

## 제공하는 것

| 영역                   | 상태       | 내용                                                                              |
| ---------------------- | ---------- | --------------------------------------------------------------------------------- |
| Motion                 | ✅ 제공 중 | 사내 기본 모션 토큰 + Tailwind v3 / v4 유틸리티 클래스                            |
| ESLint (자동 코드리뷰) | ✅ 제공 중 | 공통 컨벤션 규칙 + PR 인라인 리뷰 도구                                            |
| Design Tokens          | ✅ 제공 중 | Figma(Tokens Studio) tokens.json → tokens.css 변환 규칙 (Style Dictionary 프리셋) |
| ESLint 프리셋          | ✅ 제공 중 | 바로 쓰는 flat config (`base` / `react` / `next` / `review`)                      |
| Prettier               | ✅ 제공 중 | 포맷 규칙 프리셋                                                                  |
| TypeScript             | ✅ 제공 중 | tsconfig 프리셋 (`base` / `react` / `next` / `library` / `node`)                  |
| VS Code                | ✅ 제공 중 | 에디터 설정 동기화 (`byuckchon-settings-sync`)                                    |
| PR 본문 자동화         | ✅ 제공 중 | 커밋 내역을 타입별로 묶어 PR description 에 반영 (`byuckchon-pr-description`)     |
| Font                   | 🚧 예정    | 기본 폰트 세팅                                                                    |
| Color                  | 🚧 예정    | 기본 컬러 토큰                                                                    |

## ESLint 자동 코드리뷰

프로젝트마다 `tools/` 폴더를 복사하지 않고 패키지의 ESLint 플러그인과 PR 댓글
게시 명령을 사용합니다. ESLint 설정과 GitHub Actions 적용 방법은
[ESLINT_GUIDE.md](./ESLINT_GUIDE.md)를 참고하세요.

### 프로젝트 환경에 맞게 적용

이 패키지는 `npm`, `pnpm`, `yarn` 중 특정 패키지 매니저를 강제하지 않으며,
모노레포와 단일 저장소를 모두 지원합니다. 문서의 명령은 예시이므로 사용하는
프로젝트의 패키지 매니저, workspace 구성, 앱 경로와 script 이름에 맞게 바꿔서
적용하세요.

## Motion 사용법

Tailwind v3와 v4는 커스텀 유틸리티를 만드는 방식이 서로 달라서( v4는 CSS의
`@utility`, v3는 JS plugin API ) 프로젝트의 Tailwind 버전에 맞는 방법을
선택해서 적용하면 됩니다. 두 방법 모두 같은 클래스명(`motion-*`)과 같은 CSS
변수(`--motion-*`)를 사용하므로, override 방법과 [MOTION_GUIDE.md](./MOTION_GUIDE.md)는
버전에 상관없이 동일하게 적용됩니다.

### Tailwind v4

진입 CSS(App.css 등)에 import 한 줄만 추가하면 됩니다.

```css
/* App.css */
@import "tailwindcss";
@import "@byuckchon-frontend/settings/motion";
@import "./tokens.css"; /* 프로젝트별 override (없으면 생략) */
```

### Tailwind v3

`@utility` 문법이 없으므로, `tailwind.config`에 plugin을 등록하고
토큰 CSS는 별도로 import 합니다.

```js
// tailwind.config.js / tailwind.config.cjs
module.exports = {
  content: [/* ... */],
  plugins: [require("@byuckchon-frontend/settings/motion/plugin")],
};
```

TypeScript config(`tailwind.config.ts`)에서는 `require`가
`@typescript-eslint/no-require-imports`에 걸릴 수 있으므로 import 구문을 사용하세요.

```ts
// tailwind.config.ts
import motionPlugin from "@byuckchon-frontend/settings/motion/plugin";

export default {
  content: [/* ... */],
  plugins: [motionPlugin],
};
```

```css
/* App.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import "@byuckchon-frontend/settings/motion/tokens";
@import "./tokens.css"; /* 프로젝트별 override (없으면 생략) */
```

### 프로젝트별 값 변경 (override)

`motion.tokens.css`나 `motion.utilities.css`(v4) / `motion.plugin.cjs`(v3)를
직접 수정하지 않습니다.
디자이너가 전달한 tokens.json을 Style Dictionary로 변환한 프로젝트 `tokens.css`에서
**변경하고 싶은 변수만** 다시 선언하세요. 뒤에 로드된 값이 우선 적용됩니다.

```css
/* apps/{project}/src/styles/tokens.css */
:root {
  --motion-toggle-duration: 300ms; /* Toggle만 300ms로 변경 */
}
```

전체 변수 목록과 컴포넌트별 대응 관계는 [MOTION_GUIDE.md](./MOTION_GUIDE.md)를 참고하세요.

### Motion 문서

| 문서                                               | 대상       | 내용                                                                                             |
| -------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------ |
| [MOTION_DESIGN_GUIDE.md](./MOTION_DESIGN_GUIDE.md) | 디자이너   | 모션 카탈로그(어떻게 움직이는지), 속도 가이드, 변경 가능 범위, Figma 토큰 연동, 수정 요청 템플릿 |
| [MOTION_GUIDE.md](./MOTION_GUIDE.md)               | 프론트엔드 | 컴포넌트별 적용 클래스·변수 대응표, 공유 변수 주의사항, 프로젝트 적용 체크리스트                 |

디자이너에게는 `MOTION_DESIGN_GUIDE.md`를 공유하세요.

### Export 경로

| 경로                                            | 내용                                      | 대상                      |
| ----------------------------------------------- | ----------------------------------------- | ------------------------- |
| `@byuckchon-frontend/settings/motion`           | tokens + utilities 전체 (`@import` 한 줄) | Tailwind v4               |
| `@byuckchon-frontend/settings/motion/tokens`    | 변수 default 값만 (CSS)                   | v3 / v4 공통              |
| `@byuckchon-frontend/settings/motion/utilities` | `@utility` 정의만 (CSS)                   | Tailwind v4               |
| `@byuckchon-frontend/settings/motion/plugin`    | 동일한 유틸리티의 plugin 정의 (JS)        | Tailwind v3               |
| `@byuckchon-frontend/settings/tokens`           | Style Dictionary 설정 프리셋 (JS)         | tokens.json 사용 프로젝트 |

## 프로젝트 설정 프리셋

프로젝트는 **참조만** 합니다. 규칙이 바뀌면 settings 버전만 올리면 모든 프로젝트에 반영됩니다.

```js
// eslint.config.js
export { default } from "@byuckchon-frontend/settings/eslint/react";
```

```js
// prettier.config.js
export { default } from "@byuckchon-frontend/settings/prettier";
```

```jsonc
// tsconfig.json
{ "extends": "@byuckchon-frontend/settings/tsconfig/react.json" }
```

예외가 필요하면 이어붙이거나 덮어씁니다.

```js
import byuckchon from "@byuckchon-frontend/settings/eslint/react";
export default [...byuckchon, { rules: { "import/order": "off" } }];
```

### ESLint

| export            | 내용                                                       |
| ----------------- | ---------------------------------------------------------- |
| `./eslint/base`   | TypeScript · import 정렬 · 미사용 import (프레임워크 무관) |
| `./eslint/react`  | base + React / Hooks / Refresh                             |
| `./eslint/next`   | base + React + `next/**` import 우선순위                   |
| `./eslint/review` | react + 사내 컨벤션 규칙 (PR 리뷰 워크플로 전용)           |

`eslint-config-next`는 포함하지 않습니다. 설치된 next 버전과 짝을 이뤄야 해서
프로젝트 쪽에서 `FlatCompat`으로 합칩니다. (CLI가 생성하는 `eslint.config.mjs` 참고)

ESLint 플러그인은 이 패키지의 dependencies라 프로젝트가 따로 설치할 필요가 없습니다.
필요한 것은 `eslint` 본체뿐입니다.

### TypeScript

`base` · `react` · `next` · `library` · `node` 5종. 프로젝트에는 경로 alias처럼
그 프로젝트에만 해당하는 것만 남깁니다.

### 타입 선언

SVG·이미지 같은 에셋 모듈 선언을 제공합니다. 번들러에 따라 `*.svg`의 default export가
다르므로(Vite는 URL 문자열, Next+svgr은 컴포넌트) **둘 중 하나만** 참조해야 합니다.

```ts
// src/global.d.ts — Vite
/// <reference types="@byuckchon-frontend/settings/types/svg-vite" />

// src/global.d.ts — Next
/// <reference types="@byuckchon-frontend/settings/types/svg-next" />
```

### 버전 매트릭스

사내 프로젝트가 함께 쓰는 라이브러리 버전의 단일 출처입니다.

```js
import { versions } from "@byuckchon-frontend/settings/versions";
```

### 파일 동기화 (`extends`가 없는 설정들)

`.vscode/settings.json`, `.nvmrc`, `.npmrc`, `turbo.json`은 참조 문법이 없어서 내용 전체가
프로젝트에 있어야 합니다. 이런 파일은 **동기화 방식**을 씁니다.

```bash
npx byuckchon-settings-sync           # 프로젝트 유형을 감지해 해당하는 것 전부
npx byuckchon-settings-sync vscode    # 하나만
npx byuckchon-settings-sync --check   # 다르면 exit 1 (CI 용)
npx byuckchon-settings-sync --list    # 대상 목록
```

| 대상     | 파일                    | 적용 범위       |
| -------- | ----------------------- | --------------- |
| `vscode` | `.vscode/settings.json` | 단일 · 모노레포 |
| `nvmrc`  | `.nvmrc`                | 단일 · 모노레포 |
| `npmrc`  | `.npmrc`                | 모노레포        |
| `turbo`  | `turbo.json`            | 모노레포        |

`pnpm-workspace.yaml` 또는 `turbo.json`이 있으면 모노레포로 판단합니다.
프로젝트가 값을 바꾸는 것은 자유이고, settings가 정의하지 않은 키는 건드리지 않습니다.
되돌리고 싶을 때 다시 실행하면 됩니다.

## Design Tokens

디자이너가 Figma(Tokens Studio)에서 export 한 `tokens.json`을 프로젝트의 `tokens.css`로
변환하는 Style Dictionary 설정입니다. 변환 규칙을 프로젝트마다 복사해두면 규칙이 바뀔 때
전 프로젝트를 손으로 고쳐야 하므로, 규칙 자체를 이 패키지가 관리합니다.

```js
// 프로젝트 루트 token.config.js
import { defineTokenConfig } from "@byuckchon-frontend/settings/tokens";

export default defineTokenConfig();
```

```json
// package.json
{
  "scripts": {
    "tokens:build": "style-dictionary build --config token.config.js"
  }
}
```

`style-dictionary`는 optional peerDependency입니다. 토큰을 쓰는 프로젝트에만 설치하세요.

```bash
npm install -D style-dictionary
```

### 변환 규칙

| 토큰 `$type`        | 출력                            | 예                                                    |
| ------------------- | ------------------------------- | ----------------------------------------------------- |
| `color`             | `@theme`의 `--color-*`          | `color.brand.primary` → `--color-brand-primary`       |
| `typography`        | `@utility text-*` (Tailwind v4) | `display.7xl.bold` → `@utility text-display-7xl-bold` |
| `boxShadow`         | `@theme`의 `--shadow-*`         | `elevation.1` → `--shadow-elevation-1`                |
| 그 외 (motion 포함) | `:root` 변수                    | `--motion-toast-duration` → 그대로                    |

- 토큰 키를 `--motion-toast-duration`처럼 **CSS 변수명 그대로** 쓰면 그 이름이 그대로 나갑니다.
  계층(`motion.toast.duration`)으로 써도 같은 결과가 됩니다.
- `duration` / `delay`로 끝나는 토큰의 값이 단위 없는 숫자면 **`ms`를 자동으로 붙입니다.**
  (디자이너가 `250`만 넘겨도 `250ms`로 변환)
- easing은 `[0.16, 1, 0.3, 1]` 배열을 `cubic-bezier(...)`로 변환합니다.

### 그림자(boxShadow)

단일 레이어와 여러 레이어(배열)를 모두 지원합니다.

```jsonc
{
  "zz": {
    "$type": "boxShadow",
    "$value": {
      "x": "20", "y": "30", "blur": "0", "spread": "0",
      "color": "#000000", "type": "innerShadow"
    }
  }
}
```

```css
@theme {
  --shadow-zz: inset 20px 30px 0px 0px #000000;
}
```

Tailwind가 `shadow-zz` 유틸리티를 만들어 줍니다.

- `type: "innerShadow"` → `inset`을 붙입니다. (`dropShadow`이거나 생략하면 일반 그림자)
- 단위 없는 숫자에는 `px`를 붙이고, 빠진 값은 `0px`로 둡니다.
- 여러 레이어는 배열로 주면 쉼표로 이어 붙입니다. (`elevation.1` → `--shadow-elevation-1`)
- 색상이 `{shadow.ambient.8}` 같은 참조면 값으로 풀지 않고 변수 참조로 유지합니다.
- `@theme` 블록에는 색상 변수를 먼저, 그림자 변수를 나중에 출력합니다.

Figma가 내보내는 값이 CSS와 다른 부분은 자동으로 맞춥니다.

| Figma 값                         | 출력                            | 이유                                     |
| -------------------------------- | ------------------------------- | ---------------------------------------- |
| `letterSpacing: "-1%"`           | `letter-spacing: -0.01em`       | CSS의 `letter-spacing`은 `%`를 받지 않음 |
| `fontWeight: "Medium"`           | `font-weight: 500`              | `Medium` / `Regular`는 CSS 키워드가 아님 |
| `lineHeight: "AUTO"`             | `line-height: normal`           |                                          |
| 토큰명 `tab Bar-active`          | `text-tab-bar-active`           | 공백·언더스코어가 섞이면 CSS 문법이 깨짐 |
| boxShadow의 `{shadow.ambient.8}` | `var(--color-shadow-ambient-8)` | 값으로 풀지 않고 변수 참조로 유지        |

`fontFamily`가 숫자거나 `fontSize`가 비어 있는 등 **디자이너가 잘못 입력한 값은 빌드 시 경고**로 알려줍니다.

- settings에 존재하지 않는 `--motion-*` 이름이 있으면 빌드 시 **경고**를 출력합니다. (오타 방지)

> typography는 Tailwind v4의 `@utility` 문법으로 출력됩니다. v3 프로젝트에서 typography
> 토큰을 쓰려면 별도 대응이 필요합니다. (color/motion은 v3에서도 그대로 동작)

프로젝트별 예외가 필요하면 인자로 덮어쓸 수 있습니다.

```js
export default defineTokenConfig({
  source: ["src/tokens/*.json"],
  destination: "design-tokens.css",
});
```

## PR 본문 자동화

PR 의 커밋을 타입별로 묶어 description 에 채워 넣습니다.
사람이 쓴 내용은 건드리지 않고 마커 사이만 갱신하며, 여러 번 실행해도 안전합니다.

```bash
GH_TOKEN=... REPO=owner/repo PR_NUMBER=12 npx byuckchon-pr-description
```

`bc init` / `bc adopt` 가 만들어주는 `pr-description.yml` 워크플로가 이 명령을 실행합니다.

```markdown
<!-- byuckchon:commits:start -->

## 커밋 내역

### ✨ 기능

- **settings** — tsconfig 프리셋 추가 (a1b2c3d)

### 🐛 수정

- letterSpacing % → em 변환 (b2c3d4e)

### 📦 분류 없음

- 리뷰 반영 (d4e5f60)

<!-- byuckchon:commits:end -->
```

- 머지 커밋은 제외합니다.
- `feat(settings):` 처럼 scope 를 쓰면 함께 표시됩니다.
- `feat!:` 는 상단에 Breaking Changes 로 따로 모읍니다.
- 컨벤션을 안 지킨 커밋은 버리지 않고 "분류 없음"에 모읍니다.
- 마커가 없으면 본문 끝에 덧붙이므로 PR 템플릿이 없어도 동작합니다.

## 요구사항

- Tailwind CSS v3 이상 (v3: `tailwind.config.js` plugin, v4: `@utility` 문법)
- Design Tokens 사용 시 `style-dictionary` v5 이상
