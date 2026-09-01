# ESLint 컨벤션 리뷰 설정

`@byuckchon-frontend/settings`는 사내 ESLint 컨벤션 플러그인, PR 진단 formatter, GitHub 인라인 댓글 게시 CLI를 제공합니다. 패키지를 사용하는 프로젝트는 ESLint 규칙과 리뷰 스크립트를 `tools/` 폴더에 복사하여 관리하지 않습니다.

이 문서는 `pnpm`과 ESLint flat config를 기준으로 설명합니다. `npm` 또는 `yarn` 프로젝트는 같은 역할의 명령으로 바꾸어 실행합니다. 단일 저장소와 모노레포 모두 적용할 수 있으며, 패키지 설치 위치, lint 대상, workspace 및 workflow 실행 위치는 각 프로젝트 구조에 맞게 지정합니다.

## 적용 범위

다음 두 경우에 이 문서를 사용합니다.

- ESLint 컨벤션 리뷰를 처음 적용하는 프로젝트
- `tools/eslint-rules/`와 `tools/post-eslint-review-comments.cjs`를 사용하던 기존 프로젝트

기존 프로젝트는 패키지만 설치하고 끝내지 않습니다. ESLint plugin import, GitHub Actions의 formatter와 댓글 게시 명령, `package.json` 및 문서에 남아 있는 `tools` 참조까지 함께 변경해야 합니다.

## 1. 패키지 설치

이 문서의 export 경로와 CLI를 사용하려면 `@byuckchon-frontend/settings` 1.4.0 이상이 필요합니다.

### 단일 레포

ESLint 설정과 workflow를 저장소 루트에서 관리한다면 루트에 패키지를 설치합니다.

```bash
pnpm add -D @byuckchon-frontend/settings@^1.4.0
```

설치 후 루트 `package.json`과 lockfile을 함께 반영합니다.

### 모노레포

모노레포에서는 패키지를 반드시 workspace 루트에 설치합니다.

```bash
pnpm add -Dw @byuckchon-frontend/settings@^1.4.0
```

설치 후 루트 `package.json`과 lockfile을 함께 반영합니다.

## 2. ESLint 플러그인 등록

flat config를 사용하는 프로젝트의 `eslint.config.mjs`에 plugin을 등록합니다.

### 신규 적용

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

### 기존 `tools` 방식에서 이전

로컬 plugin import를 패키지 export 경로로 변경합니다.

```js
// 변경 전
import internalPlugin from './tools/eslint-rules/internal-plugin.cjs';

// 변경 후
import internalPlugin from '@byuckchon-frontend/settings/eslint/plugin';
```

기존의 plugin 등록 코드는 유지합니다.

```js
export default [
  {
    plugins: {
      internal: internalPlugin,
    },
  },
  // 기존 ESLint 설정
];
```

`.eslintrc`를 사용하는 프로젝트는 이 예시를 그대로 적용할 수 없습니다. 먼저 flat config로 이전하거나 프로젝트 ESLint 구성에 맞는 별도 등록 방법을 정해야 합니다.

## 3. GitHub Actions 적용

workflow 파일은 각 프로젝트의 `.github/workflows/`에서 관리합니다. 다음 예시는 `pnpm`, Ubuntu runner, `.nvmrc`, 저장소 루트 실행을 기준으로 합니다. 패키지 매니저, Node 설정, 대상 브랜치, 의존성 설치 명령, working directory 및 lint 대상은 프로젝트 환경에 맞게 변경합니다.

workflow에는 다음 권한과 환경 값이 필요합니다.

- `contents: read`
- `pull-requests: write`
- `GH_TOKEN` 또는 `GITHUB_TOKEN`
- `PR_NUMBER`, `REPO`, `HEAD_SHA`
- base와 head 사이의 변경 파일을 조회할 수 있는 checkout 이력

### 기존 workflow 파일에서 변경할 곳

`eslint-convention-review.yml` 파일 내부에서 패키지 이전을 위해 변경할 부분은 두 곳입니다.

#### 1. Formatter 경로

```bash
# 변경 전: 프로젝트의 tools 폴더 사용
formatter_path="$GITHUB_WORKSPACE/tools/eslint-rules/internal-rdjson-formatter.js"

# 변경 후: 설치된 settings 패키지 사용
formatter_path="$(node -p "require.resolve('@byuckchon-frontend/settings/eslint/formatter')")"
```

#### 2. PR 댓글 게시 명령

```bash
# 변경 전: 프로젝트의 tools 스크립트 사용
node tools/post-eslint-review-comments.cjs \
  /tmp/eslint-conventions.rdjson \
  eslint-conventions

# 변경 후: 설치된 settings 패키지의 CLI 사용
pnpm exec byuckchon-eslint-review-comments \
  /tmp/eslint-conventions.rdjson \
  eslint-conventions
```

`npm` 프로젝트에서는 마지막 명령을 다음과 같이 실행합니다.

```bash
npm exec -- byuckchon-eslint-review-comments \
  /tmp/eslint-conventions.rdjson \
  eslint-conventions
```

### 전체 workflow 예시

```yaml
# ESLint 기반 기계적 컨벤션을 PR 인라인 댓글로 게시합니다.
# typecheck/lint/build 성공 여부는 별도의 PR Check workflow가 담당합니다.

name: ESLint Convention Review

on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches:
      - dev

concurrency:
  group: eslint-convention-review-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  eslint-conventions:
    name: ESLint Convention Review
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write

    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}
          fetch-depth: 0

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: pnpm

      - name: 의존성 설치
        run: pnpm install --frozen-lockfile

      - name: ESLint 컨벤션 리뷰 댓글
        shell: bash
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          REPO: ${{ github.repository }}
          BASE_SHA: ${{ github.event.pull_request.base.sha }}
          HEAD_SHA: ${{ github.event.pull_request.head.sha }}
        run: |
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

          printf 'ESLint convention review targets:\n'
          printf '%s\n' "${changed_files[@]}"

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

          pnpm exec byuckchon-eslint-review-comments \
            /tmp/eslint-conventions.rdjson \
            eslint-conventions
```

`branches`, `.nvmrc`, `pnpm install`, lint 대상 경로는 예시입니다. 프로젝트 설정을 그대로 유지하면서 formatter와 CLI 참조만 패키지 방식으로 교체합니다.

CLI는 진단 결과를 PR 인라인 댓글로 게시합니다. `internal/blocking-conventions` 오류가 있으면 workflow를 실패시키고, warning만 있으면 댓글을 게시한 뒤 통과합니다.

## 4. `package.json`의 `tools` 경로 제거

`format`, `format:check` script에서 `tools/**/*` glob만 제거합니다. 아래 diff의 다른 경로와 옵션은 변경하지 않습니다.

### `format`

```diff
- "format": "prettier --write \"apps/**/*.{ts,tsx,js,jsx,json,md,css}\" \"packages/**/*.{ts,tsx,js,jsx,json,md,css}\" \"tools/**/*.{js,cjs,json,md}\" \"*.{json,md,yml,yaml}\" \"!pnpm-lock.yaml\" --ignore-path .gitignore --no-error-on-unmatched-pattern",
+ "format": "prettier --write \"apps/**/*.{ts,tsx,js,jsx,json,md,css}\" \"packages/**/*.{ts,tsx,js,jsx,json,md,css}\" \"*.{json,md,yml,yaml}\" \"!pnpm-lock.yaml\" --ignore-path .gitignore --no-error-on-unmatched-pattern",
```

### `format:check`

```diff
- "format:check": "prettier --check \"apps/**/*.{ts,tsx,js,jsx,json,md,css}\" \"packages/**/*.{ts,tsx,js,jsx,json,md,css}\" \"tools/**/*.{js,cjs,json,md}\" \"*.{json,md,yml,yaml}\" \"!pnpm-lock.yaml\" --ignore-path .gitignore --no-error-on-unmatched-pattern"
+ "format:check": "prettier --check \"apps/**/*.{ts,tsx,js,jsx,json,md,css}\" \"packages/**/*.{ts,tsx,js,jsx,json,md,css}\" \"*.{json,md,yml,yaml}\" \"!pnpm-lock.yaml\" --ignore-path .gitignore --no-error-on-unmatched-pattern"
```

`tools/`에 ESLint와 무관한 파일이 남아 있다면 해당 파일도 계속 포맷할 수 있도록 `tools/**/*` glob을 제거하지 않습니다.

## 5. 기존 로컬 구현 삭제

패키지 설치와 모든 참조 변경을 완료한 다음 아래 로컬 구현을 삭제합니다.

```text
tools/eslint-rules/
tools/post-eslint-review-comments.cjs
```

삭제 후 다시 검색하여 기존 경로가 남아 있지 않은지 확인합니다.

```bash
rg "tools/eslint-rules|tools/post-eslint-review-comments"
```

검색 결과가 없어야 이전이 완료된 것입니다.

## 6. AI 코드리뷰 workflow와의 관계

`ai-code-review.yml`은 이 ESLint 도구와 별개입니다. Claude API 호출과 AI 리뷰 로직은 해당 workflow 안에서 관리하므로 settings 패키지 이전 과정에서 수정하거나 삭제하지 않습니다.

## 7. 기존 프로젝트 이전 체크리스트

- [ ] 로컬 ESLint 규칙에 패키지에 반영되지 않은 수정 사항이 없는지 확인
- [ ] 루트에 `@byuckchon-frontend/settings@^1.4.0`을 설치하고 `package.json`과 lockfile 반영
- [ ] `eslint.config.mjs`의 plugin import를 패키지 경로로 변경하고 `internal` plugin 등록 확인
- [ ] `format`, `format:check`에서 `tools/**/*` glob 제거
- [ ] workflow의 formatter 경로와 PR 댓글 게시 명령을 패키지 방식으로 변경
- [ ] `tools` 폴더 삭제
- [ ] 기존 로컬 경로가 남아 있지 않은지 검색
