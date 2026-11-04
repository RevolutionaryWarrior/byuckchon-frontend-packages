/**
 * Next(@svgr/webpack) 프로젝트용 에셋 모듈 선언.
 *
 * Vite 와 달리 `*.svg` 의 default export 가 컴포넌트다.
 * 그래서 두 선언을 한 프로젝트에 같이 두면 안 된다.
 *
 * 사용법 (프로젝트 src/global.d.ts):
 *   /// <reference types="@byuckchon-frontend/settings/types/svg-next" />
 */

/**
 * tsconfig/base.json 의 noUncheckedSideEffectImports 가 켜져 있어서
 * `import './globals.css'` 같은 사이드이펙트 import 도 선언이 있어야 한다.
 * Vite 는 vite/client 가 선언해주지만 Next 는 *.module.css 만 선언하므로 여기서 채운다.
 * (*.module.css 는 더 구체적인 Next 의 선언이 우선한다)
 */
declare module '*.css';

declare module '*.svg' {
  import type React from 'react';

  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.webp' {
  const src: string;
  export default src;
}
