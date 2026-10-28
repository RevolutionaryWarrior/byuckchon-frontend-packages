---
"@byuckchon-frontend/hooks": patch
---

fix(useTimer): interval 을 1000 이 아닌 값으로 주면 시간이 빨리 흐르던 문제 수정 (MOD-33)

- 남은 시간을 ms 로 관리하고 interval 마다 interval 만큼 차감 (interval: 500 이어도 3초 타이머는 3초)
- `timeSeconds` 는 남은 시간을 올림한 초, 남은 ms 는 `timeMs` 로 추가 제공
- onComplete 는 완료 시 한 번만 호출되고, 콜백이 바뀌어도 interval 을 다시 만들지 않음
- 남은 시간이 0 이면 onStart / autoStart 로 다시 돌지 않음
- 같은 핸들러에서 `onReset()` 직후 `onStart()` 를 불러도(만료 후 재전송 등) 타이머가 다시 시작되도록 최신 남은 시간을 ref 로 함께 관리
