---
"@byuckchon-frontend/hooks": patch
---

fix(useMonthCalendar): 한국 시간에서 initialDate 의 달이 밀리던 문제 수정 (MOD-30)

- 연/월을 UTC(getUTCMonth)가 아닌 로컬 시간(getMonth) 기준으로 읽음
- KST 0~9시(자정 포함) 날짜나 매달 1일 오전 9시 전 moveToToday 가 지난달로 보이던 문제 해결
- 월 이동도 로컬 기준(setMonth)으로 맞춤
- 반환하는 `currentDate` 도 `monthCalendar` 와 같은 형식(로컬 날짜의 UTC 자정 ISO)으로 맞춤
  - 예: KST 3/1 00:00 → `"2026-03-01T00:00:00.000Z"` (이전에는 `"2026-02-28T15:00:00.000Z"`)
  - 시각 정보는 담지 않음
