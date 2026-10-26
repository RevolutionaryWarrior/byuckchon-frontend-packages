---
"@byuckchon-frontend/utils": patch
---

fix(validate): juminBefore2020 정규식에 `\d` 백슬래시가 빠져 정상 주민번호를 false 로 판정하던 문제 수정 (MOD-21)

- `^d{2}` → `^\d{2}` 로 수정해 `dd0101-...` 은 거부, `990101-...` 은 통과
- 월 `00` 을 거부하고, 하이픈은 0~1개만 허용
