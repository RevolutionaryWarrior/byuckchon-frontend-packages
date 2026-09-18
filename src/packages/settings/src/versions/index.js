/**
 * @byuckchon-frontend/settings — 검증된 스택 버전 매트릭스
 * -----------------------------------------------------------------------
 * 사내 프로젝트가 함께 쓰는 라이브러리 버전의 단일 출처다.
 * CLI 가 프로젝트를 만들 때 이 값을 package.json 에 박는다.
 *
 *   import { versions } from '@byuckchon-frontend/settings/versions';
 *
 * ⚠️ 이 패키지 자신의 버전은 여기 넣지 않는다. (자기 참조가 되어 버전이 어긋난다)
 *    CLI 가 설치된 settings 의 package.json 에서 실제 버전을 읽어 쓴다.
 * -----------------------------------------------------------------------
 */

export const versions = {
  // Core frameworks
  react: '^18.3.1',
  'react-dom': '^18.3.1',
  'next-react': '^19.2.1',
  'next-react-dom': '^19.2.1',
  next: '15.1.9',

  // Build tool (React only)
  vite: '^6.0.0',
  '@vitejs/plugin-react': '^4.3.0',
  'vite-plugin-svgr': '^4.3.0',
  '@svgr/webpack': '^8.1.0',

  // TypeScript
  typescript: '^5.7.0',
  '@types/react': '^18.3.3',
  '@types/react-dom': '^18.3.0',
  '@types/node': '^22.0.0',

  // State & Data
  zustand: '^5.0.3',
  axios: '^1.8.4',
  'react-router-dom': '^7.5.0',
  '@tanstack/react-query': '^5.74.4',

  // Styling
  tailwindcss: '^4.1.4',
  '@tailwindcss/vite': '^4.1.4',
  '@tailwindcss/postcss': '^4',
  clsx: '^2.1.1',
  'tailwind-merge': '^3.6.0',

  // Linting
  // 규칙과 플러그인은 settings 가 소유한다. 프로젝트에는 eslint 본체와,
  // settings 가 들 수 없는 것만 남긴다.
  //   - eslint-config-next: 설치된 next 버전과 짝을 이뤄야 함
  //   - @eslint/eslintrc: next 설정을 flat config 로 감싸는 FlatCompat 용
  eslint: '^9.18.0',
  '@eslint/eslintrc': '^3.2.0',
  'eslint-config-next': '^15.0.0',

  // Formatting & Tokens
  prettier: '^3.3.0',
  'prettier-plugin-tailwindcss': '^0.6.11',
  '@trivago/prettier-plugin-sort-imports': '^5.2.2',
  'style-dictionary': '^5.4.0',
  zod: '^3.24.3',

  // Node 런타임 (.nvmrc)
  node: '20',
};

export default versions;
