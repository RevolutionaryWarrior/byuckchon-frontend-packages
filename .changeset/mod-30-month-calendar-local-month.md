---
"@byuckchon-frontend/hooks": patch
---

fix(useMonthCalendar): 한국 시간에서 initialDate 의 달이 밀리던 문제 수정 (MOD-30)

- 연/월을 UTC(getUTCMonth)가 아닌 로컬 시간(getMonth) 기준으로 읽음
- KST 0~9시(자정 포함) 날짜나 매달 1일 오전 9시 전 moveToToday 가 지난달로 보이던 문제 해결
- 월 이동도 로컬 기준(setMonth)으로 맞춤
