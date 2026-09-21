/**
 * Vite(vite-plugin-svgr) 프로젝트용 에셋 모듈 선언.
 *
 * 사용법 (프로젝트 src/global.d.ts):
 *   /// <reference types="@byuckchon-frontend/settings/types/svg-vite" />
 */

declare module '*.svg' {
  import type React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

  const src: string;
  export default src;
}

declare module '*.svg?react' {
  import type React from 'react';

  const Component: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default Component;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}
