---
"@byuckchon-frontend/settings": minor
---

PR 본문을 섹션별로 채우도록 변경하고, 제목을 첫 커밋에서 만듭니다.

- 마커를 두 벌로 나눴습니다. 커밋 내역은 `byuckchon:commits`, 리뷰 포인트는
  `byuckchon:notes` 구간에 들어갑니다. 템플릿의 "작업 내용"과 "확인 사항"에
  각각 배치할 수 있습니다.
- PR 제목을 첫 커밋 메시지에서 만듭니다. 타입 접두사(`feat:` 등)는 뗍니다.
  `feat: 드롭다운 속도 수정` + `feature/page/hyuk` → `[feature] 드롭다운 속도 수정`
  직접 쓴 제목이 있으면 그것을 쓰고, 접두사만 떼어 대괄호를 붙입니다.
- `byuckchon:notes` 마커가 없는 기존 템플릿에서는 이전처럼 한 구간에 함께 넣습니다.
