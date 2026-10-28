---
"@byuckchon-frontend/utils": patch
"@byuckchon-frontend/core": patch
---

fix(sanitize): window 가 없는 환경(SSR)에서 SanitizeHtml / SanitizeHtmlRender 가 크래시하던 문제 수정 (MOD-24)

- DOMPurify 를 호출 시점의 window 로 초기화하고, DOM 이 없으면 sanitize 를 건너뜀
- `SanitizeHtml`: DOM 이 없는 환경에서는 빈 문자열 반환 (검증되지 않은 HTML 을 내보내지 않음)
- `SanitizeHtmlRender`: 서버에서는 빈 태그를 렌더링하고 하이드레이션 이후 클라이언트에서 내용을 채움 (하이드레이션 불일치 없음)
