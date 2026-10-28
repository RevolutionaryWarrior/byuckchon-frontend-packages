---
"@byuckchon-frontend/hooks": patch
---

fix(useMonthCalendar): 29~31일에서 다음 달로 이동하면 한 달을 건너뛰던 문제 수정 (MOD-31)

- 1/31 에서 moveToNext 시 3월이 아닌 2월(2/28, 윤년 2/29)로 이동
- 대상 달에 같은 날짜가 없으면 그 달의 마지막 날로 맞춤 (moveToPrev / moveToPeriod 동일)
