---
"@byuckchon-frontend/settings": minor
---

`defineTokenConfig` 에 `themes` 옵션을 추가했습니다. (라이트/다크 테마)

- `defineTokenConfig({ themes: { default: 'light', dark: 'dark' } })` 로 Tokens Studio 세트를
  모드에 연결하면, default 세트는 `@theme` 에, 나머지는 `[data-theme="dark"] { … }` 에 출력합니다.
- 세트 이름을 변수명에서 빼서 `--color-light-bg-default` / `--color-dark-bg-default` 로
  갈라지던 이름을 `--color-bg-default` 하나로 묶습니다. 화면은 `bg-bg-default` 만 쓰면 됩니다.
- 색상 참조는 resolve 된 hex 대신 `var(--color-gray-100)` 처럼 참조로 남깁니다.
- 토큰 단위 모드 값(`"$value": { "light": "{…}", "dark": "{…}" }`)도 지원합니다.
- `themes` 를 주지 않으면 출력은 이전과 동일합니다.
