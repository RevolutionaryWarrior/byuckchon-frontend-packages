/**
 * @byuckchon-frontend/settings — PR 컨벤션 리뷰 전용 flat config
 * -----------------------------------------------------------------------
 * GitHub Actions 의 ESLint Convention Review 워크플로가 사용한다.
 * 각 프로젝트의 eslint.config 에는 internal 플러그인이 없으므로, CI 에서는
 * 이 config 로 레포 루트에서 변경 파일만 한 번에 검사한다.
 *
 * 리뷰 댓글로 게시되는 규칙은 internal-rdjson-formatter.js 가 필터링한다.
 *
 * 사용법 (프로젝트 tools/review.config.mjs):
 *
 *   export { default } from '@byuckchon-frontend/settings/eslint/review';
 * -----------------------------------------------------------------------
 */

import internalPlugin from '../internal-plugin.cjs';
import { reactConfig } from './react.js';

export const reviewConfig = [
  ...reactConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { internal: internalPlugin },
    rules: {
      'internal/blocking-conventions': 'error',
      'internal/warning-conventions': 'warn',
      'react/self-closing-comp': 'warn',
    },
  },
];

export default reviewConfig;
