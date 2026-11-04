---
"@byuckchon-frontend/utils": major
---

`handleError` 를 제거하고, utils 가 더 이상 `axios` 를 의존성으로 설치하지 않습니다.

- `handleError` 는 사용처가 없고, 하는 일이 `response.data.message` 를 꺼내는 것뿐이었습니다.
  콜백은 에러 종류와 관계없이 항상 호출됐고, 응답 본문이 `{ message }` 라는 특정 서버 형식을 전제했습니다.
- 에러 처리는 프로젝트의 axios interceptor · React Query `onError` · ErrorBoundary 에서 하세요.
- fetch 만 쓰는 Next 프로젝트에 axios 가 따라 설치되던 문제도 함께 없어집니다.

마이그레이션: `handleError` 를 쓰고 있었다면 아래처럼 직접 대체합니다.

```ts
import { isAxiosError } from "axios";

const message =
  (isAxiosError(error) && error.response?.data?.message) ||
  (error instanceof Error && error.message) ||
  "알 수 없는 에러가 발생했습니다.";
```
