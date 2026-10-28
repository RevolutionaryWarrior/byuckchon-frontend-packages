---
"@byuckchon-frontend/hooks": patch
---

fix(useIntersectionObserver): 배열 구조분해 시 런타임 에러가 나던 문제 수정 (MOD-28)

- 타입 선언대로 `[ref, isIntersecting]` 배열에 `ref`, `isIntersecting` 프로퍼티를 함께 붙여 반환
- 배열·객체 구조분해 모두 동작
