---
"@byuckchon-frontend/utils": patch
---

fix(validate): birth6 / birth8 이 잘못된 생년월일을 통과시키던 문제 수정 (MOD-26)

- birth6: `^ $` 앵커를 추가해 앞뒤에 다른 문자가 붙으면 거부
- birth8: 00월 거부
- 둘 다 실제 존재하는 날짜인지 확인 (2/30, 4/31, 평년 2/29 거부)
