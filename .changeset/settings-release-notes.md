---
"@byuckchon-frontend/settings": minor
---

`byuckchon-release-notes` 명령을 추가했습니다. (프로토타입)

- 배포가 성공한 뒤에만 실행해 이전 태그 이후 커밋을 `✨ 기능` / `🐛 수정` 으로 묶어 `notes.md` 를 만듭니다.
- 버전은 날짜(`web@2026.11.05`, 같은 날 재배포는 `.2`)이며 `$GITHUB_OUTPUT` 에 `tag=` 를 남깁니다.
- `--slack notes.md` 로 `SLACK_WEBHOOK_URL` 에 배포 완료 알림을 보냅니다.
- 커밋 분류는 `byuckchon-pr-description` 과 같은 모듈(`src/bin/lib/commits.js`)을 씁니다.
