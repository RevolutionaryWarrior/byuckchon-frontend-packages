---
"@byuckchon-frontend/settings": minor
---

PR 본문에 커밋 내역을 자동으로 채워 넣는 `byuckchon-pr-description` 명령 추가

PR 의 커밋을 타입별로 묶어 description 에 반영합니다.

```bash
GH_TOKEN=... REPO=owner/repo PR_NUMBER=12 npx byuckchon-pr-description
```

- 사람이 쓴 내용은 건드리지 않고 `<!-- byuckchon:commits:start -->` 마커 사이만 갱신합니다.
  마커가 없으면 본문 끝에 덧붙이므로 PR 템플릿이 없어도 동작합니다.
- 커밋 본문의 `NOTE:` / `TODO:` 줄을 "리뷰 포인트"로 모아 커밋 내역 아래에 붙입니다.
- PR 제목에 브랜치 유형을 대괄호로 붙입니다.
  `feature/update-mypage-style/hyuk` + "마이페이지 디자인 적용" → "[feature] 마이페이지 디자인 적용"
  사람이 쓴 제목은 그대로 두고 앞에만 붙이며, 이미 대괄호가 있으면 건드리지 않습니다.
- 머지 커밋은 제외하고, `feat(scope):` 의 scope 와 `feat!:` 의 Breaking Changes 를 구분합니다.
- 컨벤션을 안 지킨 커밋은 버리지 않고 "분류 없음"으로 모읍니다.
- 같은 내용이면 API 를 호출하지 않아 여러 번 실행해도 안전합니다.
- `GITHUB_API_URL` 을 지원해 GHES 에서도 동작합니다.
