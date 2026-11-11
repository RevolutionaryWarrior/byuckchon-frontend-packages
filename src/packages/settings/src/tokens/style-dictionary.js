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
 * 라이트/다크 테마 (tokens.json 이 Tokens Studio 세트로 나뉘어 있을 때):
 *
 *   export default defineTokenConfig({ themes: { default: 'light', dark: 'dark' } });
 *
 *   → default 세트의 색은 @theme 에, 나머지는 [data-theme="dark"] { … } 에 출력된다.
 *     화면은 bg-bg-default 하나만 쓰고 dark: 변형을 쓰지 않는다.
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

/**
 * CSS 식별자로 쓸 수 있게 정리한다.
 * 디자이너가 Figma 레이어 이름을 그대로 토큰명으로 쓰면 공백/언더스코어가 섞여 들어오는데,
 * 그대로 두면 `@utility text-tab bar-active` 처럼 CSS 문법 자체가 깨진다.
 */
function slug(value) {
  const raw = kebab(value);
  const lead = raw.startsWith('--') ? '--' : '';
  return (
    lead +
    raw
      .slice(lead.length)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}

/** Figma 는 letterSpacing 을 % 로 내보내지만 CSS 의 letter-spacing 은 % 를 받지 않는다. */
function letterSpacing(value) {
  const raw = String(value).trim();
  const pct = raw.match(/^(-?\d+(?:\.\d+)?)%$/);
  if (pct) return `${Number(pct[1]) / 100}em`;
  if (BARE_NUMBER.test(raw)) return `${raw}px`;
  return raw;
}

const FONT_WEIGHTS = {
  thin: 100, hairline: 100,
  extralight: 200, ultralight: 200,
  light: 300,
  regular: 400, normal: 400, book: 400,
  medium: 500,
  semibold: 600, demibold: 600,
  bold: 700,
  extrabold: 800, ultrabold: 800,
  black: 900, heavy: 900,
};

/** "Regular" / "Medium" 같은 Figma 굵기 이름을 CSS 숫자로 바꾼다. (CSS 에 없는 키워드라 그냥 두면 무시됨) */
function fontWeight(value, warn) {
  const raw = String(value).trim();
  if (BARE_NUMBER.test(raw)) return raw;
  const hit = FONT_WEIGHTS[raw.toLowerCase().replace(/[^a-z]/g, '')];
  if (hit) return String(hit);
  warn(`굵기 이름을 해석하지 못했습니다: "${raw}"`);
  return raw;
}

/** Figma 의 lineHeight "AUTO" 는 CSS 의 normal 에 해당한다. */
function lineHeight(value) {
  const raw = String(value).trim();
  if (/^auto$/i.test(raw)) return 'normal';
  return isBareNumber(raw) ? `${raw}px` : raw;
}

/** {group.token} 참조를 같은 토큰의 CSS 변수 참조로 바꾼다. (값으로 풀지 않고 var() 로 남김) */
function refToVar(raw, byPath) {
  return String(raw).replace(/\{([^}]+)\}/g, (whole, path) => {
    const token = byPath.get(path.trim());
    if (!token) return whole;
    return `var(${cssVariableName(token, typeOf(token) === 'color' ? 'color-' : '')})`;
  });
}

/** boxShadow 토큰(단일 또는 배열)을 CSS box-shadow 값으로 조립한다. */
function boxShadow(value, original, byPath) {
  const layers = Array.isArray(value) ? value : [value];
  const origins = Array.isArray(original) ? original : [original];
  return layers
    .map((layer, i) => {
      if (!layer || typeof layer !== 'object') return null;
      const src = (origins[i] && typeof origins[i] === 'object' ? origins[i] : layer);
      const px = (v) => (isBareNumber(v) ? `${v}px` : String(v ?? '0px'));
      const inset = String(layer.type ?? '') === 'innerShadow' ? 'inset ' : '';
      const color = refToVar(src.color ?? layer.color ?? 'transparent', byPath);
      return `${inset}${px(layer.x)} ${px(layer.y)} ${px(layer.blur)} ${px(layer.spread)} ${color}`;
    })
    .filter(Boolean)
    .join(', ');
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
  if (last.startsWith('--')) return slug(last);

  // 디자이너가 "color" 그룹 아래에 색을 넣어두면 --color-color-* 가 되므로 한 번만 붙인다.
  const name = slug(token.name ?? (token.path ?? []).join('-'));
  if (prefix && name.startsWith(prefix)) return `--${name}`;
  return `--${prefix}${name}`;
}

/** @utility text-* 이름. typography 그룹 아래에 있으면 그 접두사는 뺀다. */
function typographyClassName(token) {
  return slug(token.name ?? lastSegment(token)).replace(/^typography-/, '');
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
   테마 (themes 옵션을 줬을 때만 사용)
============================================================ */

/**
 * themes: { default: 'light', dark: 'dark' }
 *   키   = 출력 모드 이름 (default 는 @theme, 나머지는 [data-theme="<키>"])
 *   값   = tokens.json 의 최상위 세트 이름
 */
function themeModes(themes) {
  if (!themes || typeof themes !== 'object') return null;
  if (!themes.default) {
    throw new Error('[tokens] themes.default 에 기본 세트 이름을 지정해주세요. 예: { default: "light", dark: "dark" }');
  }
  const bySet = new Map();
  const byKey = new Map();
  Object.entries(themes).forEach(([mode, set]) => {
    bySet.set(String(set), mode);
    byKey.set(mode, mode);
  });
  return {
    modes: Object.keys(themes),
    sets: Object.values(themes).map(String),
    /** 토큰이 속한 세트 → 모드. 테마 세트가 아니면(primitive 등) default 로 본다. */
    modeOfSet: (set) => bySet.get(set) ?? 'default',
    /** 토큰 단위 모드 키("light" 처럼 세트 이름 또는 "dark" 처럼 모드 이름) → 모드 */
    modeOfKey: (key) => bySet.get(key) ?? byKey.get(key) ?? null,
  };
}

/**
 * themes 를 쓰면 tokens.json 최상위 키는 Tokens Studio 의 "세트 이름"이다.
 * 세트 이름은 디자이너가 파일을 나눈 단위일 뿐 토큰의 의미가 아니므로 변수명에서 뺀다.
 *   primitive.gray.100 → --color-gray-100
 *   light.bg.default   → --color-bg-default (dark.bg.default 도 같은 이름 → 모드별로 덮어씀)
 */
function withoutSetName(token) {
  const [set, ...rest] = token.path ?? [];
  if (!rest.length) return { ...token, set: null };
  return { ...token, set: String(set), path: rest, name: kebab(rest.join('-')) };
}

/** 토큰 단위 모드 값인지: { light: "{gray.100}", dark: "{gray.900}" } */
function isModeValue(value, theme) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length > 0 &&
    Object.keys(value).every((key) => theme.modeOfKey(key))
  );
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
  format: ({ dictionary, options }) => {
    const theme = themeModes(options?.themes);
    const known = knownMotionVariables();
    const unknownMotion = [];
    const issues = [];

    const themeColors = [];
    const themeShadows = [];
    const typography = [];
    const variables = [];
    // 모드별 덮어쓰기: dark → ['  --color-bg-default: var(--color-gray-900);', …]
    const overrides = new Map(theme ? theme.modes.filter((m) => m !== 'default').map((m) => [m, []]) : []);

    // themes 에 지정한 세트가 최상위에 있을 때만 세트로 나뉜 파일로 본다.
    // (세트 없이 color/display 같은 그룹이 최상위인 파일에서 그룹 이름을 지우면 안 되므로)
    const splitBySet =
      !!theme && dictionary.allTokens.some((t) => theme.sets.includes(String(t.path?.[0])));
    // 세트 이름을 뺀 토큰으로 바꿔서 이후 규칙을 그대로 태운다.
    const tokens = splitBySet ? dictionary.allTokens.map(withoutSetName) : dictionary.allTokens;

    // {group.token} 참조를 되찾기 위한 경로 → 토큰 색인
    const byPath = new Map(dictionary.allTokens.map((t, i) => [(t.path ?? []).join('.'), tokens[i]]));
    if (theme) {
      // Tokens Studio 는 세트 이름 없이 {gray.100} 으로 참조하기도 한다. 이름이 겹치면 먼저 나온 것을 쓴다.
      tokens.forEach((t) => {
        const key = (t.path ?? []).join('.');
        if (!byPath.has(key)) byPath.set(key, t);
      });
    }

    /** 참조는 resolve 된 값 대신 var(--color-…) 로 남긴다. 못 찾으면 resolve 된 값을 쓴다. */
    const colorRef = (raw, resolved) => {
      if (typeof raw !== 'string') return String(resolved);
      const out = refToVar(raw, byPath);
      return out.includes('{') ? String(resolved) : out;
    };

    let usesModeValue = false;

    tokens.forEach((token) => {
      const type = typeOf(token);
      const value = valueOf(token);
      const label = (token.path ?? []).join('.') || token.name;
      const warn = (message) => issues.push(`${label}: ${message}`);
      if (value === undefined || value === null) return;

      /* color → Tailwind 유틸리티로 쓰이도록 @theme 에 넣는다 */
      if (type === 'color' && !theme) {
        themeColors.push(`  ${cssVariableName(token, 'color-')}: ${value};`);
        return;
      }

      /*
       * themes 모드의 color
       *   default 세트 / primitive → @theme, 그 외 세트 → [data-theme="<모드>"]
       *   값은 참조를 살려 var(--color-…) 로 출력한다. (모드가 바뀌면 참조 대상만 바뀌도록)
       */
      if (type === 'color') {
        const name = cssVariableName(token, 'color-');
        const original = token.original ? valueOf(token.original) : value;
        const push = (mode, line) =>
          mode === 'default' ? themeColors.push(line) : overrides.get(mode)?.push(line);

        // 토큰 단위 모드: "default": { "$value": { "light": "{gray.100}", "dark": "{gray.900}" } }
        if (isModeValue(value, theme)) {
          usesModeValue = true;
          Object.keys(value).forEach((key) => {
            const raw = original && typeof original === 'object' ? original[key] : value[key];
            push(theme.modeOfKey(key), `  ${name}: ${colorRef(raw, value[key])};`);
          });
          if (!Object.keys(value).some((key) => theme.modeOfKey(key) === 'default')) {
            warn('default 모드 값이 없습니다. @theme 에 없는 색은 Tailwind 유틸리티가 생기지 않습니다.');
          }
          return;
        }

        push(theme.modeOfSet(token.set), `  ${name}: ${colorRef(original, value)};`);
        return;
      }

      /* themes 모드에서 default 가 아닌 세트는 color / boxShadow 만 덮어쓴다 */
      if (theme && theme.modeOfSet(token.set) !== 'default') {
        if (type === 'boxShadow' || type === 'shadow') {
          const shadow = boxShadow(value, token.original ? valueOf(token.original) : value, byPath);
          if (shadow) overrides.get(theme.modeOfSet(token.set)).push(`  ${cssVariableName(token, 'shadow-')}: ${shadow};`);
        } else {
          warn(`"${token.set}" 세트에서는 color / boxShadow 만 테마별로 바뀝니다. 이 토큰은 무시됩니다.`);
        }
        return;
      }

      /* boxShadow → @theme 의 --shadow-* (shadow-* 유틸리티가 생성됨) */
      if (type === 'boxShadow' || type === 'shadow') {
        const shadow = boxShadow(value, token.original ? valueOf(token.original) : value, byPath);
        if (shadow) themeShadows.push(`  ${cssVariableName(token, 'shadow-')}: ${shadow};`);
        return;
      }

      /* typography → @utility text-* (Tailwind v4) */
      if (type === 'typography' && typeof value === 'object') {
        if (!value.fontSize) warn('fontSize 가 없습니다.');
        if (value.fontFamily && BARE_NUMBER.test(String(value.fontFamily).trim())) {
          warn(`fontFamily 가 숫자입니다("${value.fontFamily}"). 폰트 이름이 맞는지 확인하세요.`);
        }
        const family =
          value.fontFamily && !BARE_NUMBER.test(String(value.fontFamily).trim())
            ? value.fontFamily
            : null;
        const body = [
          value.fontSize && `  font-size: ${withPx(value.fontSize)};`,
          value.lineHeight && `  line-height: ${lineHeight(value.lineHeight)};`,
          value.letterSpacing !== undefined &&
            value.letterSpacing !== null &&
            `  letter-spacing: ${letterSpacing(value.letterSpacing)};`,
          value.fontWeight && `  font-weight: ${fontWeight(value.fontWeight, warn)};`,
          family && `  font-family: ${family};`,
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

    if (theme) {
      const present = new Set(tokens.map((t) => t.set));
      if (splitBySet && !usesModeValue) {
        // 토큰 단위 모드를 쓰면 일부 세트가 없어도 정상이다.
        theme.sets
          .filter((set) => !present.has(set))
          .forEach((set) => issues.push(`themes: tokens.json 에 "${set}" 세트가 없습니다.`));
      } else if (!usesModeValue && tokens.length) {
        // 디자이너가 아직 세트를 나누지 않은 경우. 토큰 단위 모드도 없으면 단일 테마로 나간다.
        issues.push(`themes: tokens.json 에 ${theme.sets.map((s) => `"${s}"`).join(' / ')} 세트가 없어 테마 없이 출력합니다.`);
      }
      // 기본값 없이 특정 모드에만 있는 변수는 Tailwind 유틸리티가 만들어지지 않는다.
      const defined = new Set([...themeColors, ...themeShadows].map((line) => line.trim().split(':')[0]));
      overrides.forEach((lines, mode) => {
        lines
          .map((line) => line.trim().split(':')[0])
          .filter((name) => !defined.has(name))
          .forEach((name) =>
            issues.push(`${name}: "${mode}" 에만 있고 default 값이 없습니다. (bg-* 같은 유틸리티가 생기지 않음)`),
          );
      });
    }

    if (unknownMotion.length) {
      console.warn(
        '\n⚠ settings 에 존재하지 않는 motion 변수입니다. 오타가 아닌지 확인하세요.\n' +
          unknownMotion.map((name) => `   ${name}`).join('\n') +
          '\n   (이 변수들은 CSS 로 출력되지만 아무 모션에도 연결되지 않습니다)\n' +
          '   전체 목록: MOTION_DESIGN_GUIDE.md\n',
      );
    }

    if (issues.length) {
      console.warn(
        '\n⚠ 토큰 값에 확인이 필요한 항목이 있습니다. 디자이너에게 전달하세요.\n' +
          issues.map((line) => `   ${line}`).join('\n') +
          '\n',
      );
    }

    const blocks = [];
    // 그림자가 색상 변수를 참조할 수 있으므로 색상을 먼저 적어 읽기 쉽게 둔다.
    const themeBlock = [...themeColors, ...themeShadows];
    if (themeBlock.length) blocks.push(`@theme {\n${themeBlock.join('\n')}\n}`);
    overrides.forEach((lines, mode) => {
      if (lines.length) blocks.push(`[data-theme="${mode}"] {\n${lines.join('\n')}\n}`);
    });
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
 * @param {Record<string, string>} [overrides.themes]
 *   라이트/다크 테마. 키는 출력 모드, 값은 tokens.json 의 세트 이름.
 *   예: { default: 'light', dark: 'dark' } → @theme + [data-theme="dark"]
 *   생략하면 지금과 같은 출력(세트 이름이 변수명에 들어감)을 유지한다.
 * @returns {object} Style Dictionary config
 */
export function defineTokenConfig(overrides = {}) {
  const { source, buildPath = 'src/', destination = 'tokens.css', themes, ...rest } = overrides;

  return {
    source: source ?? ['src/tokens.json'],
    platforms: {
      css: {
        transforms: ['name/kebab'],
        buildPath,
        files: [{ destination, format: 'css/byuckchon', ...(themes && { options: { themes } }) }],
      },
    },
    ...rest,
  };
}

export default defineTokenConfig;
