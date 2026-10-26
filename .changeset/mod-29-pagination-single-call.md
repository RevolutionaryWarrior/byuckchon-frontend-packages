---
"@byuckchon-frontend/hooks": patch
---

fix(usePagination): 액션 한 번에 onPageChange 가 두 번 호출되던 문제 수정 (MOD-29)

- 목표 페이지를 1 ~ totalCount 범위로 맞춘 뒤 onPageChange 를 한 번만 호출
- 첫 페이지에서 이전 / 마지막 페이지에서 다음처럼 페이지가 바뀌지 않으면 호출하지 않음
