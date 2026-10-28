# @byuckchon-frontend/core

## 1.2.1

### Patch Changes

- 91c389a: fix(sanitize): allowAttributes / dropAttributes 가 태그 구분 없이 전역으로 적용되던 문제 수정 (MOD-23)

  - `allowAttributes` 는 "추가 허용"으로 동작: 기본 허용 속성(href, src, title 등)은 유지하고 지정한 속성을 더 허용
    - 기본 목록에 없는 속성(예: `{ a: ['foo'] }`)은 지정한 태그에서만 허용되고 다른 태그에서는 제거
    - 지정하지 않은 태그(img 등)는 DOMPurify 기본 규칙 유지 → img 의 src 가 사라지지 않음
  - `dropAttributes: { a: ['title'] }` 는 a 의 title 만 제거하고 img 의 title 은 유지
  - 추가 허용한 속성에도 URI 검사(javascript: 등)는 그대로 적용

- cb68923: fix(sanitize): window 가 없는 환경(SSR)에서 SanitizeHtml / SanitizeHtmlRender 가 크래시하던 문제 수정 (MOD-24)

  - DOMPurify 를 호출 시점의 window 로 초기화하고, DOM 이 없으면 sanitize 를 건너뜀
  - `SanitizeHtml`: DOM 이 없는 환경에서는 빈 문자열 반환 (검증되지 않은 HTML 을 내보내지 않음)
  - `SanitizeHtmlRender`: 서버에서는 빈 태그를 렌더링하고 하이드레이션 이후 클라이언트에서 내용을 채움 (하이드레이션 불일치 없음)

## 1.2.0

### Minor Changes

- 3cfd04b: ErrorBoundary의 fallback에 오류 발생 시 실행되는 함수를 사용할 수 있도록 지원합니다.

## 1.1.3

### Patch Changes

- 2b7724d: chore: md 파일 테스트
