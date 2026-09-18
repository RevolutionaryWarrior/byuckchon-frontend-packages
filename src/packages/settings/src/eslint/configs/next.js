/**
 * @byuckchon-frontend/settings — Next.js(App Router) ESLint flat config
 * -----------------------------------------------------------------------
 * Next 자체 규칙(next/core-web-vitals)은 여기 포함하지 않는다.
 * eslint-config-next 는 설치된 next 버전과 짝을 이뤄야 해서, settings 가 들고 있으면
 * 프로젝트의 next 버전과 어긋날 수 있기 때문이다. 프로젝트 쪽에서 합친다:
 *
 *   import { FlatCompat } from '@eslint/eslintrc';
 *   import byuckchon from '@byuckchon-frontend/settings/eslint/next';
 *
 *   const compat = new FlatCompat({ baseDirectory: import.meta.dirname });
 *
 *   export default [
 *     ...compat.extends('next/core-web-vitals', 'next/typescript'),
 *     ...byuckchon,
 *   ];
 * -----------------------------------------------------------------------
 */

import { baseConfig, importOrderRule } from './base.js';
import { reactRules } from './react.js';

export const nextConfig = [
  ...baseConfig,
  ...reactRules,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // next/** 도 react 와 함께 최상단으로 올린다.
      'import/order': importOrderRule(['react', 'next/**']),
    },
  },
  {
    ignores: ['**/next-env.d.ts', '**/.next/**', '**/out/**'],
  },
];

export default nextConfig;
