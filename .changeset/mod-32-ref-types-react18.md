---
"@byuckchon-frontend/hooks": patch
---

fix: React 18 타입(@types/react 18)에서 훅이 반환한 ref 를 JSX 에 넣으면 TS2322 가 나던 문제 수정 (MOD-32)

- 대상: useAutoFocus · useDetectClose · useScrollTop · useScrollToSelectedItem · useImpressionRef · useFileUpload
- 반환 ref 타입을 React 19 의 `RefObject<T | null>` 대신 `ElementRefObject<T>`(`{ current: T | null }`)로 선언해 React 18 / 19 모두 할당 가능
- `ElementRefObject` 타입 export
