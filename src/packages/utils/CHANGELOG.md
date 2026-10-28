# @byuckchon-frontend/utils

## 1.7.0

### Minor Changes

- d50d97a: feat(validate): validate.file 허용 확장자 확장 및 직접 지정 지원 (MOD-27)

  - 기본 허용 확장자에 webp, heic, heif 추가
  - 세 번째 인자 `allowedExtensions` 로 허용 확장자를 직접 지정 가능 (대소문자·앞의 점 무시)
  - 기본 목록을 `DEFAULT_FILE_EXTENSIONS` 로 export 해 확장해서 쓸 수 있게 함

### Patch Changes

- 3aa4314: fix(validate): juminBefore2020 정규식에 `\d` 백슬래시가 빠져 정상 주민번호를 false 로 판정하던 문제 수정 (MOD-21)

  - `^d{2}` → `^\d{2}` 로 수정해 `dd0101-...` 은 거부, `990101-...` 은 통과
  - 월 `00` 을 거부하고, 하이픈은 0~1개만 허용

- 964df07: fix(validate): email 이 도메인 뒤 점을 한 번만 허용해 `.co.kr`·서브도메인 주소를 거부하던 문제 수정 (MOD-22)
- 91c389a: fix(sanitize): allowAttributes / dropAttributes 가 태그 구분 없이 전역으로 적용되던 문제 수정 (MOD-23)

  - `allowAttributes` 는 "추가 허용"으로 동작: 기본 허용 속성(href, src, title 등)은 유지하고 지정한 속성을 더 허용
    - 기본 목록에 없는 속성(예: `{ a: ['foo'] }`)은 지정한 태그에서만 허용되고 다른 태그에서는 제거
    - 지정하지 않은 태그(img 등)는 DOMPurify 기본 규칙 유지 → img 의 src 가 사라지지 않음
  - `dropAttributes: { a: ['title'] }` 는 a 의 title 만 제거하고 img 의 title 은 유지
  - 추가 허용한 속성에도 URI 검사(javascript: 등)는 그대로 적용

- cb68923: fix(sanitize): window 가 없는 환경(SSR)에서 SanitizeHtml / SanitizeHtmlRender 가 크래시하던 문제 수정 (MOD-24)

  - DOMPurify 를 호출 시점의 window 로 초기화하고, DOM 이 없으면 sanitize 를 건너뜀
  - `SanitizeHtml`: DOM 이 없는 환경에서는 빈 문자열 반환 (검증되지 않은 HTML 을 내보내지 않음)
  - `SanitizeHtmlRender`: 서버에서는 빈 태그를 렌더링하고 하이드레이션 이후 클라이언트에서 내용을 채움 (하이드레이션 불일치 없음)

- 5673c0a: fix(validate): homePhone 지역번호 목록 수정 (MOD-25)

  - 세종(044) 추가
  - 존재하지 않는 034~039 제거, 중복된 070 정리

- 6c064e9: fix(validate): birth6 / birth8 이 잘못된 생년월일을 통과시키던 문제 수정 (MOD-26)

  - birth6: `^ $` 앵커를 추가해 앞뒤에 다른 문자가 붙으면 거부
  - birth8: 00월 거부
  - 둘 다 실제 존재하는 날짜인지 확인 (2/30, 4/31, 평년 2/29 거부)

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
