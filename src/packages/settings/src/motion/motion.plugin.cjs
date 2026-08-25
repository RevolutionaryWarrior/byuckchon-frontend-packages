/**
 * motion.plugin.cjs
 * -----------------------------------------------------------------------
 * Tailwind CSS v3 전용 모션 유틸리티 플러그인입니다.
 *
 * v4 프로젝트는 `@utility` 문법으로 작성된 motion.utilities.css를 그대로
 * import 해서 사용하지만, v3는 `@utility` 문법을 지원하지 않으므로
 * 같은 클래스들을 Tailwind v3 plugin API(addUtilities)로 재정의합니다.
 *
 * 사용법 (tailwind.config.js / tailwind.config.cjs):
 *
 *   module.exports = {
 *     // ...
 *     plugins: [
 *       require('@byuckchon-frontend/settings/motion/plugin'),
 *     ],
 *   };
 *
 * 토큰(CSS 변수)은 별도로 진입 CSS에서 import 해야 합니다:
 *
 *   @tailwind base;
 *   @tailwind components;
 *   @tailwind utilities;
 *   @import "@byuckchon-frontend/settings/motion/tokens";
 *   @import "./tokens.css"; ← 프로젝트별 override (없으면 생략)
 *
 * ⚠️ 이 파일은 motion.utilities.css(v4)와 클래스/동작이 1:1로 동기화되어야
 *    합니다. 모션 유틸을 추가/수정할 때는 두 파일을 함께 수정하세요.
 * -----------------------------------------------------------------------
 */

const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addUtilities }) {
  addUtilities({
    /* ============================================================
       Common — Button, Table row, Calendar cell 등 다수 컴포넌트 공유
    ============================================================ */
    '.motion-hover-scale': {
      transitionProperty: 'transform',
      transitionDuration: 'var(--motion-hover-scale-duration)',
      transitionTimingFunction: 'var(--motion-ease-out)',
      '&:hover': {
        transform: 'scale(1.03)',
      },
    },
    '.motion-press': {
      transitionProperty: 'transform',
      transitionDuration: 'var(--motion-press-duration)',
      transitionTimingFunction: 'var(--motion-ease-out)',
      '&:active': {
        transform: 'scale(0.97)',
      },
    },

    /* ============================================================
       Accordion / Dropdown / Table 정렬 화살표
    ============================================================ */
    '.motion-collapse': {
      display: 'grid',
      gridTemplateRows: '0fr',
      transitionProperty: 'grid-template-rows',
      transitionDuration: 'var(--motion-collapse-duration)',
      transitionTimingFunction: 'ease-out',
      '&[data-open="true"]': {
        gridTemplateRows: '1fr',
      },
      '& > div': {
        overflow: 'hidden',
      },
    },
    '.motion-rotate': {
      transitionProperty: 'transform',
      transitionDuration: 'var(--motion-rotate-duration)',
      transitionTimingFunction: 'ease-out',
      '&[data-open="true"]': {
        transform: 'rotate(180deg)',
      },
    },

    /* ============================================================
       Toggle
    ============================================================ */
    '.motion-toggle-knob': {
      transitionProperty: 'transform',
      transitionDuration: 'var(--motion-toggle-duration)',
      transitionTimingFunction: 'var(--motion-ease-out)',
    },

    /* ============================================================
       Checkbox
    ============================================================ */
    '.motion-check-pop': {
      transform: 'scale(0)',
      transitionProperty: 'transform',
      transitionDuration: 'var(--motion-check-pop-duration)',
      transitionTimingFunction: 'var(--motion-ease-spring)',
      'input:checked + label &, .cb-checked &': {
        transform: 'scale(1)',
      },
    },

    /* ============================================================
       Input
    ============================================================ */
    '.motion-label-float': {
      transitionProperty: 'transform, color',
      transitionDuration: 'var(--motion-label-float-duration)',
      transitionTimingFunction: 'var(--motion-ease-out)',
      transformOrigin: 'left top',
      transform: 'translateY(0) scale(1)',
      '&[data-focus="true"]': {
        transform: 'translateY(-10px) scale(0.8)',
      },
    },

    /* ============================================================
       Dropdown menu / Modal content
    ============================================================ */
    '.motion-scale-in': {
      opacity: '0',
      transform: 'scale(0.95)',
      transitionProperty: 'opacity, transform',
      transitionDuration: 'var(--motion-scale-in-duration)',
      transitionTimingFunction: 'var(--motion-ease-out)',
      pointerEvents: 'none',
      '&[data-open="true"]': {
        opacity: '1',
        transform: 'scale(1)',
        pointerEvents: 'auto',
      },
    },

    /* ============================================================
       Modal / BottomSheet / Drawer 배경 딤
    ============================================================ */
    '.motion-backdrop': {
      opacity: '0',
      transitionProperty: 'opacity',
      transitionDuration: 'var(--motion-backdrop-duration)',
      transitionTimingFunction: 'var(--motion-ease-out)',
      pointerEvents: 'none',
      '&[data-open="true"]': {
        opacity: '1',
        pointerEvents: 'auto',
      },
    },

    /* ============================================================
       BottomSheet 본체
    ============================================================ */
    '.motion-sheet': {
      transform: 'translateY(100%)',
      transitionProperty: 'transform',
      transitionDuration: 'var(--motion-sheet-duration)',
      transitionTimingFunction: 'var(--motion-ease-out)',
      '&[data-open="true"]': {
        transform: 'translateY(0)',
      },
    },

    /* ============================================================
       Drawer 본체 (우측 진입 기준. 좌측은 -100%로 시작하도록 별도 클래스화 가능)
    ============================================================ */
    '.motion-slide-x-right': {
      transform: 'translateX(100%)',
      transitionProperty: 'transform',
      transitionDuration: 'var(--motion-slide-x-duration)',
      transitionTimingFunction: 'var(--motion-ease-out)',
      '&[data-open="true"]': {
        transform: 'translateX(0)',
      },
    },
    '.motion-slide-x-left': {
      transform: 'translateX(-100%)',
      transitionProperty: 'transform',
      transitionDuration: 'var(--motion-slide-x-duration)',
      transitionTimingFunction: 'var(--motion-ease-out)',
      '&[data-open="true"]': {
        transform: 'translateX(0)',
      },
    },

    /* ============================================================
       ToastMessage
    ============================================================ */
    '.motion-toast': {
      opacity: '0',
      transform: 'translateY(8px) scale(0.98)',
      transitionProperty: 'opacity, transform',
      transitionDuration: 'var(--motion-toast-duration)',
      transitionTimingFunction: 'var(--motion-ease-out)',
      '&[data-open="true"]': {
        opacity: '1',
        transform: 'translateY(0) scale(1)',
      },
    },

    /* ============================================================
       Tooltip
    ============================================================ */
    '.motion-tooltip': {
      opacity: '0',
      transform: 'translateY(4px)',
      transitionProperty: 'opacity, transform',
      transitionDuration: 'var(--motion-tooltip-duration)',
      transitionTimingFunction: 'var(--motion-ease-out)',
      pointerEvents: 'none',
      '.group:hover &': {
        opacity: '1',
        transform: 'translateY(0)',
        pointerEvents: 'auto',
      },
    },

    /* ============================================================
       Pagination / Tab indicator
    ============================================================ */
    '.motion-tab-indicator': {
      position: 'absolute',
      '&[data-ready="true"]': {
        transitionProperty: 'left, width',
        transitionDuration: 'var(--motion-tab-indicator-duration)',
        transitionTimingFunction: 'ease-out',
      },
    },
  });
});
