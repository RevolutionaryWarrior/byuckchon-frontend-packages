---
"@byuckchon-frontend/settings": minor
---

프로젝트 공통 설정을 settings로 통합 (ESLint / Prettier / tsconfig / VS Code)

- `./eslint/base` `./eslint/react` `./eslint/next` `./eslint/review` — 바로 쓰는 flat config.
  ESLint 플러그인은 이 패키지의 dependencies라 프로젝트는 `eslint`만 설치하면 됩니다.
- `./prettier` — 포맷 규칙 프리셋
- `./tsconfig/{base,react,next,library,node}.json` — `extends` 로 참조하는 tsconfig 프리셋
- `./vscode` + `byuckchon-settings-sync` — extends 가 없는 VS Code 설정을 위한 동기화 명령
- `./types/svg-vite` `./types/svg-next` — 에셋 모듈 타입 선언
- `./versions` — 검증된 스택 버전 매트릭스
- `byuckchon-settings-sync` 가 `.vscode/settings.json` 외에 `.nvmrc` / `.npmrc` / `turbo.json` 도
  관리합니다. 프로젝트 유형(단일·모노레포)을 감지해 해당하는 것만 처리합니다.
- CLI가 복사해 뿌리던 컨벤션 규칙 사본(`tools/eslint-rules/`)을 제거하고 이 패키지를
  단일 출처로 삼습니다. 두 사본은 이미 273줄 차이로 벌어져 있었습니다.
