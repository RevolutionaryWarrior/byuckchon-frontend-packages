/**
 * @byuckchon-frontend/settings — Prettier 프리셋
 * -----------------------------------------------------------------------
 * 사용법 (프로젝트 루트 prettier.config.js):
 *
 *   import byuckchon from '@byuckchon-frontend/settings/prettier';
 *   export default byuckchon;
 *
 * 프로젝트별 예외가 필요하면 펼쳐서 덮어쓴다:
 *
 *   export default { ...byuckchon, printWidth: 100 };
 *
 * plugins 는 이름만 선언한다. 실제 해석은 프로젝트의 node_modules 에서 이뤄지므로
 * 아래 두 플러그인은 프로젝트의 devDependencies 에 있어야 한다.
 *   - @trivago/prettier-plugin-sort-imports
 *   - prettier-plugin-tailwindcss
 * -----------------------------------------------------------------------
 */

/** @type {import('prettier').Config} */
const config = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  // ESLint 의 import/order 와 같은 순서로 맞춘다. (react → next → 외부 → @/ → 상대경로)
  // 둘의 기준이 다르면 저장할 때마다 prettier 와 ESLint 가 서로 다른 모양을 요구한다.
  importOrder: ['^react$', '^next(/.*)?$', '<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
  // 그룹 사이 빈 줄을 넣지 않는다. (ESLint 의 newlines-between: 'never' 와 짝)
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};

export default config;
