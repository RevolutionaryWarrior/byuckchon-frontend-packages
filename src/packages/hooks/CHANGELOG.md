# @byuckchon-frontend/hooks

## 1.3.13

### Patch Changes

- 17de0e0: fix(useIntersectionObserver): 배열 구조분해 시 런타임 에러가 나던 문제 수정 (MOD-28)

  - 타입 선언대로 `[ref, isIntersecting]` 배열에 `ref`, `isIntersecting` 프로퍼티를 함께 붙여 반환
  - 배열·객체 구조분해 모두 동작

- 2516c76: fix(usePagination): 액션 한 번에 onPageChange 가 두 번 호출되던 문제 수정 (MOD-29)

  - 목표 페이지를 1 ~ totalCount 범위로 맞춘 뒤 onPageChange 를 한 번만 호출
  - 첫 페이지에서 이전 / 마지막 페이지에서 다음처럼 페이지가 바뀌지 않으면 호출하지 않음

- 36d9fee: fix(useMonthCalendar): 한국 시간에서 initialDate 의 달이 밀리던 문제 수정 (MOD-30)

  - 연/월을 UTC(getUTCMonth)가 아닌 로컬 시간(getMonth) 기준으로 읽음
  - KST 0~9시(자정 포함) 날짜나 매달 1일 오전 9시 전 moveToToday 가 지난달로 보이던 문제 해결
  - 월 이동도 로컬 기준(setMonth)으로 맞춤
  - 반환하는 `currentDate` 도 `monthCalendar` 와 같은 형식(로컬 날짜의 UTC 자정 ISO)으로 맞춤
    - 예: KST 3/1 00:00 → `"2026-03-01T00:00:00.000Z"` (이전에는 `"2026-02-28T15:00:00.000Z"`)
    - 시각 정보는 담지 않음

- f460fae: fix(useMonthCalendar): 29~31일에서 다음 달로 이동하면 한 달을 건너뛰던 문제 수정 (MOD-31)

  - 1/31 에서 moveToNext 시 3월이 아닌 2월(2/28, 윤년 2/29)로 이동
  - 대상 달에 같은 날짜가 없으면 그 달의 마지막 날로 맞춤 (moveToPrev / moveToPeriod 동일)

- edc2739: fix: React 18 타입(@types/react 18)에서 훅이 반환한 ref 를 JSX 에 넣으면 TS2322 가 나던 문제 수정 (MOD-32)

  - 대상: useAutoFocus · useDetectClose · useScrollTop · useScrollToSelectedItem · useImpressionRef · useFileUpload
  - 반환 ref 타입을 React 19 의 `RefObject<T | null>` 대신 `ElementRefObject<T>`(`{ current: T | null }`)로 선언해 React 18 / 19 모두 할당 가능
  - `ElementRefObject` 타입 export

- 178cbe0: fix(useTimer): interval 을 1000 이 아닌 값으로 주면 시간이 빨리 흐르던 문제 수정 (MOD-33)

  - 남은 시간을 ms 로 관리하고 interval 마다 interval 만큼 차감 (interval: 500 이어도 3초 타이머는 3초)
  - `timeSeconds` 는 남은 시간을 올림한 초, 남은 ms 는 `timeMs` 로 추가 제공
  - onComplete 는 완료 시 한 번만 호출되고, 콜백이 바뀌어도 interval 을 다시 만들지 않음
  - 남은 시간이 0 이면 onStart / autoStart 로 다시 돌지 않음
  - 같은 핸들러에서 `onReset()` 직후 `onStart()` 를 불러도(만료 후 재전송 등) 타이머가 다시 시작되도록 최신 남은 시간을 ref 로 함께 관리

## 1.3.12

### Patch Changes

- 03e2f3b: useFileUpload의 multiUpload 동작 오류 수정

## 1.3.11

### Patch Changes

- 2b7724d: chore: md 파일 테스트

## 1.3.10

### Patch Changes

- fbfac70: chore: md 파일 테스트

## 1.3.9

### Patch Changes

- daba327: chore: md 파일 생성 테스트

## 1.3.8

### Patch Changes

- cf91c81: chore: md 파일 생성 테스트

## 1.3.7

### Patch Changes

- c8d8add: chore: md 파일 생성 테스트

## 1.3.6

### Patch Changes

- 866e458: chore: md 파일 업데이트 테스트

## 1.3.5

### Patch Changes

- 7822847: chore: md 파일 자동화 테스트

## 1.3.4

### Patch Changes

- 95ee514: test PR open workflows

## 1.3.3

### Patch Changes

- f46f9a2: test PR open workflows

## 1.3.2

### Patch Changes

- 0c3e3bd: test PR open workflows

## 1.3.1

### Patch Changes

- a113b78: edit workflow + test PR open

## 1.3.0

### Minor Changes

- 1a2bb64: feat: 다중 필드 지원 비밀번호 visibility 관리 훅 추가
