---
"@byuckchon-frontend/utils": patch
---

utils 가 더 이상 `axios` 를 의존성으로 설치하지 않습니다.

- `handleError` 는 axios 를 import 하지 않고 `error.isAxiosError === true` 로 axios 에러를 판별합니다.
  (`axios.isAxiosError` 와 같은 기준이라 반환값은 그대로입니다)
- fetch 만 쓰는 Next 프로젝트에 axios 가 따라 설치되던 문제를 없앴습니다.
- 응답 본문이 문자열 등 객체가 아니면 `message` 기본값을 씁니다.
