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
| Motion | ✅ 제공 중 | 사내 기본 모션 토큰 + Tailwind v4 `@utility` 클래스 |
| ESLint (자동 코드리뷰) | 🚧 예정 | 사내 공통 lint 규칙 |
| Font | 🚧 예정 | 기본 폰트 세팅 |
| Color | 🚧 예정 | 기본 컬러 토큰 |

## Motion 사용법

Tailwind CSS v4 기반 프로젝트의 진입 CSS(App.css 등)에 import 한 줄만 추가하면 됩니다.

```css
/* App.css */
@import "tailwindcss";
@import "@byuckchon-frontend/settings/motion";
@import "./tokens.css"; /* 프로젝트별 override (없으면 생략) */
```

### 프로젝트별 값 변경 (override)

`motion.tokens.css`나 `motion.utilities.css`를 직접 수정하지 않습니다.
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

| 경로 | 내용 |
|---|---|
| `@byuckchon-frontend/settings/motion` | tokens + utilities 전체 (일반적으로 이것만 사용) |
| `@byuckchon-frontend/settings/motion/tokens` | 변수 default 값만 |
| `@byuckchon-frontend/settings/motion/utilities` | `@utility` 정의만 |

## 요구사항

- Tailwind CSS v4 이상 (`@utility` 문법 사용)
