# ESLint 컨벤션 리뷰 설정

`@byuckchon-frontend/settings`는 사내 ESLint 컨벤션 플러그인, PR 진단 formatter,
GitHub 인라인 댓글 게시 명령을 제공합니다. 각 프로젝트에 `tools/` 폴더를 복사할
필요가 없습니다.

이 문서는 `pnpm`을 기준으로 예시를 보여주지만 패키지 매니저를 강제하지 않습니다.
`npm`, `pnpm`, `yarn` 중 프로젝트에서 사용하는 도구에 맞는 명령으로 실행하세요.
단일 저장소인지 모노레포인지도 패키지에서 가정하지 않으므로, lint 대상과 workspace
실행 위치는 각 프로젝트 구조에 맞게 정합니다.

## 1. 패키지 설치

```bash
pnpm add -D @byuckchon-frontend/settings
```

## 2. ESLint 플러그인 등록

flat config를 사용하는 프로젝트의 `eslint.config.mjs`에 플러그인을 등록합니다.

```js
import internalPlugin from '@byuckchon-frontend/settings/eslint/plugin';

export default [
  {
    plugins: {
      internal: internalPlugin,
    },
  },
  // 기존 ESLint 설정
];
```

로컬에서 컨벤션 규칙만 검사하려면 다음 script를 추가할 수 있습니다.

```json
{
  "scripts": {
    "lint:conventions": "eslint . --rule 'internal/blocking-conventions:error' --rule 'internal/warning-conventions:warn'"
  }
}
```

## 3. GitHub Actions에서 사용

> 아래 workflow는 `pnpm` 기준 예시입니다. 사용하는 프로젝트가 `npm`, `pnpm`,
> `yarn` 중 무엇을 쓰는지, 단일 저장소인지 모노레포인지 패키지가 판단하거나
> 강제하지 않습니다. 각 프로젝트 환경에 맞게 패키지 설치 명령, `eslint` 실행
> 명령, workflow 실행 위치, workspace와 lint 대상 경로를 조정해서 사용하세요.

workflow YML은 각 프로젝트의 `.github/workflows/`에서 관리합니다. 기존
`eslint-convention-review.yml`의 formatter와 댓글 게시 명령만 아래처럼 패키지
경로로 변경합니다.

### 기존 workflow에서 변경할 곳

변경할 부분은 **두 곳뿐입니다.**

**1. Formatter 경로**

```bash
# 변경 전: 프로젝트의 tools 폴더 사용
formatter_path="$GITHUB_WORKSPACE/tools/eslint-rules/internal-rdjson-formatter.js"

# 변경 후: 설치된 settings 패키지 사용
formatter_path="$(node -p "require.resolve('@byuckchon-frontend/settings/eslint/formatter')")"
```

**2. PR 댓글 게시 명령**

```bash
# 변경 전: 프로젝트의 tools 폴더 사용
node tools/post-eslint-review-comments.cjs \
  /tmp/eslint-conventions.rdjson \
  eslint-conventions

# 변경 후: 설치된 settings 패키지의 CLI 사용
pnpm exec byuckchon-eslint-review-comments \
  /tmp/eslint-conventions.rdjson \
  eslint-conventions
```

`npm` 프로젝트에서는 마지막 명령을
`npm exec -- byuckchon-eslint-review-comments ...` 형태로 실행하면 됩니다.
아래는 변경 사항이 반영된 전체 step 예시입니다.

```yaml
- name: ESLint 컨벤션 리뷰 댓글
  shell: bash
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    PR_NUMBER: ${{ github.event.pull_request.number }}
    REPO: ${{ github.repository }}
    BASE_SHA: ${{ github.event.pull_request.base.sha }}
    HEAD_SHA: ${{ github.event.pull_request.head.sha }}
  run: |
    export GITHUB_WORKSPACE="${GITHUB_WORKSPACE:-$PWD}"
    # 변경 1: formatter를 settings 패키지에서 가져옵니다.
    formatter_path="$(node -p "require.resolve('@byuckchon-frontend/settings/eslint/formatter')")"

    mapfile -d '' changed_files < <(
      git diff --name-only -z \
        --diff-filter=ACMR \
        "$BASE_SHA...$HEAD_SHA" \
        -- '*.ts' '*.tsx'
    )

    if [[ ${#changed_files[@]} -eq 0 ]]; then
      echo "검사할 TypeScript 변경 파일이 없습니다."
      exit 0
    fi

    set +e
    pnpm exec eslint "${changed_files[@]}" \
      --rule 'internal/blocking-conventions:error' \
      --rule 'internal/warning-conventions:warn' \
      -f "$formatter_path" \
      -o /tmp/eslint-conventions.rdjson
    eslint_exit_code=$?
    set -e

    if [[ ! -f /tmp/eslint-conventions.rdjson ]]; then
      echo "ESLint did not create /tmp/eslint-conventions.rdjson."
      exit "$eslint_exit_code"
    fi

    # 변경 2: settings 패키지가 제공하는 댓글 게시 CLI를 실행합니다.
    pnpm exec byuckchon-eslint-review-comments \
      /tmp/eslint-conventions.rdjson \
      eslint-conventions
```

`ai-code-review.yml`은 이 ESLint 도구와 별개이며 Claude API 호출 로직을 workflow
안에 직접 포함합니다. 해당 YML도 사용하는 프로젝트의 `.github/workflows/`에서
관리합니다.

## 기존 프로젝트 이전

패키지 적용이 끝나면 다음 프로젝트 로컬 파일은 더 이상 필요하지 않습니다.

- `tools/eslint-rules/`
- `tools/post-eslint-review-comments.cjs`

단, 파일을 제거하기 전에 `eslint.config`의 plugin import와
`eslint-convention-review.yml`의 formatter/CLI 경로가 위 패키지 경로로 바뀌었는지
확인합니다. `ai-code-review.yml`은 그대로 유지합니다.

## 포함된 규칙 영역

- React state/ref 타입과 이름, 커스텀 훅의 단일 `props: Props` 인자
- 컴포넌트 `Props` 선언 및 구조 분해
- URL route `Params` 선언
- hook, 컴포넌트, API, store, context, provider 파일명
- import 계층과 최상단 barrel/API import 경계
- boolean, 배열, 상수 이름
- JSX `className`과 DOM event handler
- API service와 React Query 사용 패턴
- TypeScript 및 ESLint 제어 주석
