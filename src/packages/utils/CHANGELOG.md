# @byuckchon-frontend/utils

## 1.6.0

### Minor Changes

- f89522f: 클래스 병합 유틸 `cn` 추가

  tailwind-merge 기본 설정은 모르는 `text-*` 를 전부 글자 색으로 분류합니다.
  그래서 디자인 토큰에서 생성된 타이포그래피 유틸을 색과 함께 쓰면 타이포가 사라집니다.

  ```
  twMerge('text-body-sm-regular', 'text-primitive-neutral-600')
    → 'text-primitive-neutral-600'   // 타이포가 사라짐
  ```

  `cn` 은 타이포그래피를 글자 크기 그룹으로 분리해 이 문제를 막습니다.
  토큰 이름 체계가 기본 패턴(display/heading/title/subtitle/body/caption/label)과
  다르면 `createCn({ typography: [...] })` 로 직접 지정할 수 있습니다.

## 1.5.0

### Minor Changes

- 448491c: add dateUtils Function

## 1.4.4

### Patch Changes

- fa89c7b: update validate utils

## 1.4.3

### Patch Changes

- 2b7724d: chore: md 파일 테스트

## 1.4.2

### Patch Changes

- fbfac70: chore: md 파일 테스트

## 1.4.0

### Minor Changes

- 67d8258: add: editor 관련 util

## 1.3.0

### Minor Changes

- 6185069: add isSameMinute

## 0.1.0

### Minor Changes

- 13482fc: update date utils
  add kstToUtc
  add isSameDay
  modified to a more flexible type
