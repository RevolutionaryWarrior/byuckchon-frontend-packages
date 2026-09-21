/**
 * @byuckchon-frontend/settings — ESLint 공통 flat config
 * -----------------------------------------------------------------------
 * 프레임워크와 무관한 규칙만 담는다. (TypeScript, import 정렬, 미사용 import)
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
 * import 정렬 규칙.
 * @param {string[]} [before] external 그룹보다 앞에 둘 패턴 (예: ['react', 'next/**'])
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
      alphabetize: { order: 'asc', caseInsensitive: true },
      'newlines-between': 'always',
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
      'import/order': importOrderRule(),
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
