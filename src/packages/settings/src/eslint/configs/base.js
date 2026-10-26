/**
 * @byuckchon-frontend/settings — ESLint 공통 flat config
 * -----------------------------------------------------------------------
 * 프레임워크와 무관한 규칙만 담는다. (TypeScript, 미사용 import)
 * import 순서는 ESLint 가 아니라 Prettier(@trivago/prettier-plugin-sort-imports)가 정한다.
 * React 프로젝트는 ./react, Next 프로젝트는 ./next 를 사용한다.
 * -----------------------------------------------------------------------
 */

import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** 모든 프로젝트가 공통으로 무시하는 경로 */
export const ignores = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/.next/**',
  '**/out/**',
  '**/*.gen.ts',
];

/**
 * import/order 규칙 옵션.
 *
 * @deprecated 기본 설정에서는 사용하지 않는다. import 순서는 Prettier 정렬 플러그인이 정하고
 * ESLint 의 import/order 는 끈다. (아래 'import/order': 'off' 참고)
 * 프로젝트에서 굳이 다시 켜야 할 때를 위해 Prettier 와 최대한 같은 기준으로 맞춰 남겨 둔다.
 * 단, '-' 와 '/' 가 섞인 경로(quill-image… / quill/…)는 두 도구의 비교 방식이 달라 옵션으로 맞출 수 없다.
 *
 * @param {string[]} [before] external 그룹보다 앞에 둘 패턴 (예: ['react', 'next', 'next/**'])
 */
export function importOrderRule(before = ['react']) {
  return [
    'error',
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      pathGroups: [
        ...before.map((pattern) => ({ pattern, group: 'external', position: 'before' })),
        { pattern: '@/**', group: 'internal' },
      ],
      pathGroupsExcludedImportTypes: ['react'],
      // Prettier 정렬 플러그인 기본값(importOrderCaseInsensitive: false)과 맞춘다.
      alphabetize: { order: 'asc', caseInsensitive: false },
      // prettier 가 그룹 사이 빈 줄을 넣지 않으므로 여기서도 요구하지 않는다.
      // (요구하면 저장할 때마다 빨간 줄이 뜬다)
      'newlines-between': 'never',
    },
  ];
}

/** 미사용 변수/import 규칙. `_` 로 시작하면 허용한다. */
export const unusedImportsRules = {
  'unused-imports/no-unused-imports': 'error',
  'unused-imports/no-unused-vars': [
    'warn',
    { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
  ],
};

export const baseConfig = [
  { ignores },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node, ...globals.es2022 },
    },
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    settings: {
      'import/resolver': { typescript: {} },
    },
    rules: {
      ...unusedImportsRules,
      // import 순서는 포맷이므로 Prettier 정렬 플러그인에만 맡긴다. (eslint-config-prettier 와 같은 원칙)
      // 두 도구가 각자 정렬하면 next / next/server, 대소문자만 다른 경로, '-' 와 '/' 가 섞인 경로에서
      // 서로 반대 순서를 요구해 prettier --check 와 eslint 를 동시에 통과할 수 없다.
      // 순서 검사는 CI 의 prettier --check 가 대신한다.
      'import/order': 'off',
      // 미사용 변수는 unused-imports 쪽에서 더 정교하게 잡으므로 중복 경고를 끈다.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // prettier 는 항상 마지막. 포맷 관련 규칙을 끈다.
  prettier,
];

export default baseConfig;
