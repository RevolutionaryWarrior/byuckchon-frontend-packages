---
"@byuckchon-frontend/settings": minor
---

fix(eslint): Prettier import 정렬과 ESLint import/order 가 서로 다른 순서를 요구해 CI 가 실패하던 문제 수정 (MOD-35)

- import 순서는 Prettier 정렬 플러그인(@trivago/prettier-plugin-sort-imports)만 정하도록 base / react / next 의 `import/order` 를 끔
  - `next` + `next/server`, 대소문자만 다른 경로, `-` 와 `/` 가 섞인 경로에서 두 도구가 반대 순서를 요구하던 문제 해결
  - 순서 검사는 CI 의 `prettier --check` 가 대신함
- `importOrderRule` 은 deprecated 로 남기고, 다시 켜는 경우를 위해 대소문자 구분을 Prettier 와 맞춤 (`caseInsensitive: false`)
- 업데이트 후 프로젝트에 임시로 덧붙인 import/order 설정과 `eslint-disable-next-line import/order` 주석은 제거
