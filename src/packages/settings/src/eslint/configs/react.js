/**
 * @byuckchon-frontend/settings — React(Vite) ESLint flat config
 * -----------------------------------------------------------------------
 * 사용법 (프로젝트 루트 eslint.config.js):
 *
 *   import byuckchon from '@byuckchon-frontend/settings/eslint/react';
 *   export default byuckchon;
 *
 * 프로젝트 예외를 더할 때는 뒤에 이어붙인다:
 *
 *   export default [...byuckchon, { rules: { 'import/order': 'off' } }];
 * -----------------------------------------------------------------------
 */

import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

import { baseConfig } from './base.js';

/**
 * 훅 규칙 — JSX 가 없는 파일도 대상이다.
 *
 * 커스텀 훅은 보통 `useDebounce.ts` 처럼 JSX 없이 작성한다.
 * 이 블록을 jsx/tsx 로 좁히면 그런 파일이 rules-of-hooks / exhaustive-deps 검사에서
 * 통째로 빠지므로, 확장자를 제한하지 않는다.
 */
export const reactHooksRules = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  plugins: { 'react-hooks': reactHooks },
  rules: {
    ...reactHooks.configs.recommended.rules,
  },
};

/**
 * JSX 문법에만 해당하는 규칙 — jsx/tsx 로 한정한다.
 * `self-closing-comp` 처럼 JSX 노드를 보는 규칙이라 .ts 파일에서는 의미가 없다.
 */
export const reactJsxRules = {
  files: ['**/*.{jsx,tsx}'],
  plugins: { react, 'react-refresh': reactRefresh },
  languageOptions: {
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
  settings: { react: { version: 'detect' } },
  rules: {
    'react/self-closing-comp': ['warn', { component: true, html: true }],
    'react/jsx-boolean-value': ['warn', 'never'],
    // JSX 를 쓰는 파일에서 React import 를 강제하지 않는다 (React 17+ 자동 런타임)
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
};

export const reactRules = [reactHooksRules, reactJsxRules];

export const reactConfig = [...baseConfig, ...reactRules];

export default reactConfig;
