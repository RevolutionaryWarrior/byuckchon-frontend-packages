---
"@byuckchon-frontend/settings": patch
---

`types/svg-next` 에 `declare module '*.css'` 를 추가했습니다.

- `noUncheckedSideEffectImports` 때문에 Next 프로젝트의 `import './globals.css'` 가
  typecheck · `next build` 에서 TS2307 로 실패하던 문제를 고쳤습니다.
- 이미 만든 프로젝트도 settings 업데이트만으로 해결됩니다.
