---
"@byuckchon-frontend/settings": patch
---

prettier 와 ESLint 의 import 정렬 기준을 통일

서로 다른 그룹 기준으로 빈 줄을 요구해서, 저장하면 prettier 가 빈 줄을 없애고
그 결과를 ESLint 가 다시 지적하는 상황이었습니다.

두 도구 모두 `react → next → 외부 → @/ → 상대경로` 순서에 그룹 간 빈 줄 없음으로 맞췄습니다.
