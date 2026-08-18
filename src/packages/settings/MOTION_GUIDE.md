# Motion Guide

basic-ui 15종에 적용된 모션과, 각 모션을 제어하는 CSS 변수를 정리한 문서입니다.
디자이너가 프로젝트별로 값을 조정하고 싶을 때, 이 문서에서 **변수 이름**만 확인하고
프로젝트 `tokens.css`에 그 이름으로 원하는 값만 다시 선언하면 됩니다.

```css
/* apps/{project}/src/styles/tokens.css */
:root {
  --motion-toggle-duration: 300ms; /* Toggle만 300ms로 override */
}
```

- 여기 없는 변수는 전부 `motion.tokens.css`의 default 값을 그대로 사용합니다.
- 변수 이름은 반드시 아래 표와 **정확히 일치**해야 합니다. (오타 시 조용히 무시되고 default가 적용됨)

---

## 컴포넌트별 요약

| 컴포넌트 | 적용된 모션 | 사용 클래스 | 제어 변수 | Default |
|---|---|---|---|---|
| **Accordion** | 높이 펼침/접힘 | `motion-collapse` | `--motion-collapse-duration` | 200ms |
| | 화살표 회전 | `motion-rotate` | `--motion-rotate-duration` ⚠️공유 | 200ms |
| **Button** | 클릭 시 눌림 | `motion-press` | `--motion-press-duration` ⚠️공유 | 80ms |
| | hover 확대 | `motion-hover-scale` | `--motion-hover-scale-duration` ⚠️공유 | 120ms |
| **Toggle** | 노브 이동 | `motion-toggle-knob` | `--motion-toggle-duration` | 200ms |
| **Checkbox** | 체크 팝업 | `motion-check-pop` | `--motion-check-pop-duration` | 150ms |
| **Input** | 라벨 플로팅 | `motion-label-float` | `--motion-label-float-duration` | 120ms |
| **Dropdown** | 메뉴 진입/퇴장 | `motion-scale-in` | `--motion-scale-in-duration` ⚠️공유 | 200ms |
| | 화살표 회전 | `motion-rotate` | `--motion-rotate-duration` ⚠️공유 | 200ms |
| **Tooltip** | 등장/퇴장 | `motion-tooltip` | `--motion-tooltip-duration` | 120ms |
| **Modal** | 배경 딤 | `motion-backdrop` | `--motion-backdrop-duration` ⚠️공유 | 200ms |
| | 콘텐츠 진입/퇴장 | `motion-scale-in` | `--motion-scale-in-duration` ⚠️공유 | 200ms |
| **BottomSheet** | 배경 딤 | `motion-backdrop` | `--motion-backdrop-duration` ⚠️공유 | 200ms |
| | 시트 슬라이드 업 | `motion-sheet` | `--motion-sheet-duration` | 320ms |
| **Drawer** | 배경 딤 | `motion-backdrop` | `--motion-backdrop-duration` ⚠️공유 | 200ms |
| | 좌/우 슬라이드 | `motion-slide-x-left` / `motion-slide-x-right` | `--motion-slide-x-duration` | 320ms |
| **ToastMessage** | 등장/퇴장 | `motion-toast` | `--motion-toast-duration` | 200ms |
| | 스택 재배치 | `motion-collapse` 응용 | `--motion-collapse-duration` ⚠️공유 | 200ms |
| **Calendar** | 날짜 셀 hover | `motion-hover-scale` | `--motion-hover-scale-duration` ⚠️공유 | 120ms |
| | 날짜 선택 강조 | Tailwind 기본 `transition-colors` | (모션 유틸 아님, override 불가) | — |
| **Pagination** | 활성 인디케이터 이동 | `motion-tab-indicator` | `--motion-tab-indicator-duration` | 200ms |
| **Table** | 정렬 화살표 회전 | `motion-rotate` | `--motion-rotate-duration` ⚠️공유 | 200ms |
| | row hover | Tailwind 기본 `transition-colors` | (모션 유틸 아님, override 불가) | — |
| **Breadcrumb** | 없음 | — | — | — |

⚠️공유 표시가 있는 변수는 **여러 컴포넌트가 같은 클래스/변수를 재사용**하고 있어서,
하나를 바꾸면 그 클래스를 쓰는 다른 컴포넌트도 함께 바뀝니다. 아래 "공유 변수 주의사항" 참고.

---

## 공유 변수 주의사항

일부 모션은 컴포넌트 전용이 아니라 **여러 곳에서 재사용되는 공용 유틸**이라, 변수도 함께 공유됩니다.

| 변수 | 영향받는 곳 |
|---|---|
| `--motion-rotate-duration` | Accordion 화살표, Dropdown 화살표, Table 정렬 화살표 |
| `--motion-hover-scale-duration` | Button hover, Calendar 날짜 셀 hover, 기타 hover 가능한 요소 전반 |
| `--motion-press-duration` | 클릭 가능한 모든 요소의 눌림 피드백 |
| `--motion-scale-in-duration` | Dropdown 메뉴, Modal 콘텐츠 |
| `--motion-backdrop-duration` | Modal, BottomSheet, Drawer의 배경 딤 |
| `--motion-collapse-duration` | Accordion 펼침/접힘, Toast 스택 재배치 |

**"Dropdown 화살표만 더 느리게 하고 싶다"처럼 공유 유틸 중 하나만 예외를 두고 싶은 경우**에는
변수 override로는 해결되지 않습니다. 이때는 해당 컴포넌트에 한정된 별도 클래스
(예: `motion-rotate-dropdown`)를 새로 추가해야 하며, 이는 디자인 요청이 들어온 시점에
프론트가 `motion.utilities.css`에 유틸을 하나 더 정의하는 방식으로 대응합니다.
(디자이너가 임의로 새 클래스를 만들 수는 없고, 변수 override 범위 밖의 요청이라는 것만 인지하고 있으면 됩니다.)

---

## 프로젝트 적용 방법 (프론트 전용)

```css
/* App.css */
@import "tailwindcss";
@import "@byuckchon-frontend/settings/motion";
@import "./tokens.css"; /* 디자이너가 넘겨준 override 값 (없으면 생략 가능) */
```

```jsx
// 컴포넌트 예시 — Accordion
<button onClick={toggle}>
  <svg data-open={isOpen} className="motion-rotate">...</svg>
</button>
<div data-open={isOpen} className="motion-collapse">
  <div>{content}</div>
</div>
```

새 프로젝트 세팅 시 체크리스트:

1. `@byuckchon-frontend/settings`를 의존성으로 추가 (`npm install @byuckchon-frontend/settings`)
2. `App.css`에 `@import "@byuckchon-frontend/settings/motion";` 추가
3. 디자이너로부터 override 요청이 있다면 프로젝트 `tokens.css`에 해당 변수만 추가
4. 이 문서(`MOTION_GUIDE.md`)를 디자이너에게 공유해 override 가능한 변수 목록 전달
