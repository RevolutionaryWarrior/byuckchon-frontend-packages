/**
 * Next(@svgr/webpack) 프로젝트용 에셋 모듈 선언.
 *
 * Vite 와 달리 `*.svg` 의 default export 가 컴포넌트다.
 * 그래서 두 선언을 한 프로젝트에 같이 두면 안 된다.
 *
 * 사용법 (프로젝트 src/global.d.ts):
 *   /// <reference types="@byuckchon-frontend/settings/types/svg-next" />
 */

declare module '*.svg' {
  import type React from 'react';

  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.webp' {
  const src: string;
  export default src;
}
