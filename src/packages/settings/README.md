# @byuckchon-frontend/settings

Byuckchon Frontend 프로젝트의 **기본 세팅 패키지**입니다.
`byuckchon-frontend-cli`로 프로젝트를 생성하면 자동으로 설치되며,
기존 프로젝트에는 아래 명령어로 추가할 수 있습니다.

```bash
npm install @byuckchon-frontend/settings
```

## 제공하는 것

| 영역 | 상태 | 내용 |
|---|---|---|
| Motion | ✅ 제공 중 | 사내 기본 모션 토큰 + Tailwind v3 / v4 유틸리티 클래스 |
| ESLint (자동 코드리뷰) | ✅ 제공 중 | 공통 컨벤션 규칙 + PR 인라인 리뷰 도구 |
| Font | 🚧 예정 | 기본 폰트 세팅 |
| Color | 🚧 예정 | 기본 컬러 토큰 |

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
  plugins: [require('@byuckchon-frontend/settings/motion/plugin')],
};
```

TypeScript config(`tailwind.config.ts`)에서는 `require`가
`@typescript-eslint/no-require-imports`에 걸릴 수 있으므로 import 구문을 사용하세요.

```ts
// tailwind.config.ts
import motionPlugin from '@byuckchon-frontend/settings/motion/plugin';

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

### Export 경로

| 경로 | 내용 | 대상 |
|---|---|---|
| `@byuckchon-frontend/settings/motion` | tokens + utilities 전체 (`@import` 한 줄) | Tailwind v4 |
| `@byuckchon-frontend/settings/motion/tokens` | 변수 default 값만 (CSS) | v3 / v4 공통 |
| `@byuckchon-frontend/settings/motion/utilities` | `@utility` 정의만 (CSS) | Tailwind v4 |
| `@byuckchon-frontend/settings/motion/plugin` | 동일한 유틸리티의 plugin 정의 (JS) | Tailwind v3 |

## 요구사항

- Tailwind CSS v3 이상 (v3: `tailwind.config.js` plugin, v4: `@utility` 문법)
