/**
 * @byuckchon-frontend/settings — Style Dictionary 프리셋
 * -----------------------------------------------------------------------
 * 디자이너가 Figma(Tokens Studio)에서 export 한 tokens.json 을
 * 프로젝트의 tokens.css 로 변환하는 공통 설정입니다.
 *
 * 사용법 (프로젝트 루트 token.config.js):
 *
 *   import { defineTokenConfig } from '@byuckchon-frontend/settings/tokens';
 *
 *   export default defineTokenConfig();
 *
 * 변환 규칙을 바꿔야 할 일이 생기면 프로젝트가 아니라 이 파일을 고칩니다.
 * 각 프로젝트는 settings 버전을 올리는 것만으로 최신 규칙을 따라옵니다.
 *
 * ⚠️ style-dictionary 는 peerDependency 입니다. 이 모듈이 registerFormat/
 *    registerTransform 을 호출하는 인스턴스와 CLI 가 실행하는 인스턴스가
 *    같아야 하므로, 프로젝트에 설치된 style-dictionary 하나만 존재해야 합니다.
 * -----------------------------------------------------------------------
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import StyleDictionary from 'style-dictionary';

/* ============================================================
   motion 변수 화이트리스트
   motion.tokens.css 를 그대로 읽어서 만들기 때문에 목록이 따로 놀 일이 없다.
============================================================ */

const MOTION_TOKENS_CSS = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../motion/motion.tokens.css',
);

function knownMotionVariables() {
  try {
    const css = fs.readFileSync(MOTION_TOKENS_CSS, 'utf8');
    return new Set(css.match(/--motion-[a-z0-9-]+(?=\s*:)/g) ?? []);
  } catch {
    // 목록을 못 읽으면 경고 기능만 끄고 변환은 그대로 진행한다.
    return null;
  }
}

/* ============================================================
   이름 / 값 변환
============================================================ */

const DURATION_NAME = /(duration|delay)$/;
const BARE_NUMBER = /^-?\d+(\.\d+)?$/;

function kebab(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function lastSegment(token) {
  const segments = token.path ?? [];
  return segments.length ? String(segments[segments.length - 1]) : String(token.name ?? '');
}

/**
 * 디자이너가 토큰 키를 어떻게 주든 같은 CSS 변수명이 나오게 한다.
 *
 *   "--motion-toast-duration"          → --motion-toast-duration  (변수명을 통째로 준 경우)
 *   { motion: { toast: { duration } } } → --motion-toast-duration  (계층으로 준 경우)
 */
function cssVariableName(token, prefix = '') {
  const last = lastSegment(token);
  if (last.startsWith('--')) return kebab(last);

  // 디자이너가 "color" 그룹 아래에 색을 넣어두면 --color-color-* 가 되므로 한 번만 붙인다.
  const name = kebab(token.name ?? (token.path ?? []).join('-'));
  if (prefix && name.startsWith(prefix)) return `--${name}`;
  return `--${prefix}${name}`;
}

/** @utility text-* 이름. typography 그룹 아래에 있으면 그 접두사는 뺀다. */
function typographyClassName(token) {
  const name = kebab(token.name ?? lastSegment(token)).replace(/^-+/, '');
  return name.replace(/^typography-/, '');
}

function isBareNumber(value) {
  return typeof value === 'number' || (typeof value === 'string' && BARE_NUMBER.test(value));
}

/**
 * 디자이너는 단위 없이 숫자만 준다는 전제로 단위를 붙여준다.
 *   "--motion-toast-duration": 250      → 250ms
 *   "--motion-ease-out": [0.16,1,0.3,1] → cubic-bezier(0.16, 1, 0.3, 1)
 */
function cssValue(name, value) {
  if (Array.isArray(value)) {
    if (value.length === 4 && value.every((n) => typeof n === 'number')) {
      return `cubic-bezier(${value.join(', ')})`;
    }
    return value.join(' ');
  }
  if (isBareNumber(value) && DURATION_NAME.test(name)) return `${value}ms`;
  return String(value);
}

/** typography 하위 값(fontSize 등)은 숫자면 px 로 본다. (기존 동작 유지) */
function withPx(value) {
  return isBareNumber(value) ? `${value}px` : value;
}

function typeOf(token) {
  return token.$type ?? token.type;
}

function valueOf(token) {
  return token.$value ?? token.value;
}

/* ============================================================
   등록
============================================================ */

StyleDictionary.registerTransform({
  name: 'name/kebab',
  type: 'name',
  transform: (token) => kebab((token.path ?? []).join('-')),
});

StyleDictionary.registerFormat({
  name: 'css/byuckchon',
  format: ({ dictionary }) => {
    const known = knownMotionVariables();
    const unknownMotion = [];

    const colors = [];
    const typography = [];
    const variables = [];

    dictionary.allTokens.forEach((token) => {
      const type = typeOf(token);
      const value = valueOf(token);
      if (value === undefined || value === null) return;

      /* color → Tailwind 유틸리티로 쓰이도록 @theme 에 넣는다 */
      if (type === 'color') {
        colors.push(`  ${cssVariableName(token, 'color-')}: ${value};`);
        return;
      }

      /* typography → @utility text-* (Tailwind v4) */
      if (type === 'typography' && typeof value === 'object') {
        const body = [
          value.fontSize && `  font-size: ${withPx(value.fontSize)};`,
          value.lineHeight && `  line-height: ${withPx(value.lineHeight)};`,
          value.letterSpacing && `  letter-spacing: ${value.letterSpacing};`,
          value.fontWeight && `  font-weight: ${value.fontWeight};`,
          value.fontFamily && `  font-family: ${value.fontFamily};`,
        ].filter(Boolean);
        typography.push(`@utility text-${typographyClassName(token)} {\n${body.join('\n')}\n}`);
        return;
      }

      /* 그 외(motion 포함) → :root 변수로 그대로 통과 */
      const name = cssVariableName(token);
      if (known && name.startsWith('--motion-') && !known.has(name)) {
        unknownMotion.push(name);
      }
      variables.push(`  ${name}: ${cssValue(name, value)};`);
    });

    if (unknownMotion.length) {
      console.warn(
        '\n⚠ settings 에 존재하지 않는 motion 변수입니다. 오타가 아닌지 확인하세요.\n' +
          unknownMotion.map((name) => `   ${name}`).join('\n') +
          '\n   (이 변수들은 CSS 로 출력되지만 아무 모션에도 연결되지 않습니다)\n' +
          '   전체 목록: MOTION_DESIGN_GUIDE.md\n',
      );
    }

    const blocks = [];
    if (colors.length) blocks.push(`@theme {\n${colors.join('\n')}\n}`);
    if (typography.length) blocks.push(typography.join('\n\n'));
    if (variables.length) blocks.push(`:root {\n${variables.join('\n')}\n}`);

    const header = '/* 이 파일은 tokens.json 에서 자동 생성됩니다. 직접 수정하지 마세요. */';
    return `${header}\n\n${blocks.join('\n\n')}\n`;
  },
});

/* ============================================================
   config factory
============================================================ */

/**
 * 프로젝트 token.config.js 에서 사용하는 기본 설정.
 *
 * @param {object} [overrides] 프로젝트별 예외. source/platforms 를 덮어쓸 수 있다.
 * @returns {object} Style Dictionary config
 */
export function defineTokenConfig(overrides = {}) {
  const { source, buildPath = 'src/', destination = 'tokens.css', ...rest } = overrides;

  return {
    source: source ?? ['src/tokens.json'],
    platforms: {
      css: {
        transforms: ['name/kebab'],
        buildPath,
        files: [{ destination, format: 'css/byuckchon' }],
      },
    },
    ...rest,
  };
}

export default defineTokenConfig;
