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

export const reactRules = {
  files: ['**/*.{jsx,tsx}'],
  plugins: { react, 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
  languageOptions: {
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
  settings: { react: { version: 'detect' } },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react/self-closing-comp': ['warn', { component: true, html: true }],
    'react/jsx-boolean-value': ['warn', 'never'],
    // JSX 를 쓰는 파일에서 React import 를 강제하지 않는다 (React 17+ 자동 런타임)
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
};

export const reactConfig = [...baseConfig, reactRules];

export default reactConfig;
