---
"@byuckchon-frontend/utils": patch
"@byuckchon-frontend/core": patch
---

fix(sanitize): allowAttributes / dropAttributes 가 태그 구분 없이 전역으로 적용되던 문제 수정 (MOD-23)

- `allowAttributes` 는 "추가 허용"으로 동작: 기본 허용 속성(href, src, title 등)은 유지하고 지정한 속성을 더 허용
  - 기본 목록에 없는 속성(예: `{ a: ['foo'] }`)은 지정한 태그에서만 허용되고 다른 태그에서는 제거
  - 지정하지 않은 태그(img 등)는 DOMPurify 기본 규칙 유지 → img 의 src 가 사라지지 않음
- `dropAttributes: { a: ['title'] }` 는 a 의 title 만 제거하고 img 의 title 은 유지
- 추가 허용한 속성에도 URI 검사(javascript: 등)는 그대로 적용
