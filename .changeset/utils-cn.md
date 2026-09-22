---
"@byuckchon-frontend/utils": minor
---

클래스 병합 유틸 `cn` 추가

tailwind-merge 기본 설정은 모르는 `text-*` 를 전부 글자 색으로 분류합니다.
그래서 디자인 토큰에서 생성된 타이포그래피 유틸을 색과 함께 쓰면 타이포가 사라집니다.

```
twMerge('text-body-sm-regular', 'text-primitive-neutral-600')
  → 'text-primitive-neutral-600'   // 타이포가 사라짐
```

`cn` 은 타이포그래피를 글자 크기 그룹으로 분리해 이 문제를 막습니다.
토큰 이름 체계가 기본 패턴(display/heading/title/subtitle/body/caption/label)과
다르면 `createCn({ typography: [...] })` 로 직접 지정할 수 있습니다.
