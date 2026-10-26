import React from "react";
import dompurify, { type Config } from "dompurify";

/**
 * HTML sanitization 설정 옵션
 *
 * @interface SanitizeHtmlConfig
 * @property {string[]} [addElements] - 기본 허용 태그에 추가할 HTML 태그 목록. allowElements가 있으면 무시됨
 * @property {string[]} [allowElements] - 허용할 HTML 태그 목록. 비어있으면 기본 DOMPurify 허용 태그 사용
 * @property {Record<string, string[]>} [allowAttributes] - 태그별로 추가 허용할 속성 목록. 기본 허용 속성(href, src, title 등)은 그대로 두고 지정한 속성을 더 허용한다. 기본 목록에 없는 속성은 지정한 태그에서만 허용된다.
 * @property {string[]} [dropElements] - 제거할 HTML 태그 목록
 * @property {Record<string, string[]>} [dropAttributes] - 태그별 제거할 속성 목록. 지정한 태그에서만 제거한다.
 */
export interface SanitizeHtmlConfig {
  addElements?: string[];
  allowElements?: string[];
  allowAttributes?: Record<string, string[]>;
  dropElements?: string[];
  dropAttributes?: Record<string, string[]>;
}

interface SanitizeHtmlProps {
  content: string;
  config?: SanitizeHtmlConfig;
  tagName?: keyof React.JSX.IntrinsicElements;
  className?: string;
}

const DefaultConfig: SanitizeHtmlConfig = {
  addElements: [],
  allowElements: [],
  allowAttributes: {},
  dropElements: [],
  dropAttributes: {},
};

/** { a: ['Title'] } → Map { 'a' => Set { 'title' } } (DOMPurify 는 태그·속성명을 소문자로 비교한다) */
const toAttrMap = (
  attrMap: Record<string, string[]> | undefined
): Map<string, Set<string>> => {
  const map = new Map<string, Set<string>>();
  if (!attrMap) return map;

  Object.entries(attrMap).forEach(([tag, attrs]) => {
    map.set(
      tag.toLowerCase(),
      new Set(attrs.map((attr) => attr.toLowerCase()))
    );
  });
  return map;
};

type BrowserWindow = Window & typeof globalThis;

/**
 * DOM 이 있는 환경이면 window 를, 서버(SSR)·Node 처럼 DOM 이 없으면 null 을 돌려준다.
 * DOMPurify 는 DOM 없이 초기화되면 sanitize 가 없는 빈 인스턴스가 되므로 미리 걸러야 한다.
 */
const getBrowserWindow = (): BrowserWindow | null =>
  typeof window === "undefined" || !window.document ? null : window;

let defaultPurifier: ReturnType<typeof dompurify> | null = null;

/** 설정 없이 DOMPurify 가 기본으로 허용하는 속성인지 확인한다. */
const isDefaultAllowedAttr = (win: BrowserWindow, attr: string): boolean => {
  defaultPurifier ??= dompurify(win);
  return defaultPurifier.isValidAttribute("div", attr, "");
};

/**
 * 태그별 allowAttributes / dropAttributes 를 적용한 DOMPurify 인스턴스를 만든다.
 *
 * - allowAttributes: 기본 허용 속성은 유지하고 지정한 속성을 추가로 허용한다.
 *   기본 목록에 없는 속성(예: a 에만 지정한 foo)은 지정한 태그에서만 살리고 다른 태그에서는 제거한다.
 * - dropAttributes 에 지정한 태그: 지정한 속성만 제거한다.
 *
 * 훅이 다른 호출에 섞이지 않도록 호출마다 새 인스턴스를 만든다.
 * 허용 여부만 훅에서 거르고 URI 검사(javascript: 등)는 DOMPurify 가 그대로 수행한다.
 */
const createPurifier = (win: BrowserWindow, config: SanitizeHtmlConfig) => {
  const purifier = dompurify(win);
  const allowMap = toAttrMap(config.allowAttributes);
  const dropMap = toAttrMap(config.dropAttributes);

  // 기본 허용 목록에 없는 속성은 ADD_ATTR 로 열어주되, 지정한 태그에서만 살린다.
  const addedAttrs = new Set<string>();
  allowMap.forEach((attrs) => {
    attrs.forEach((attr) => {
      if (!isDefaultAllowedAttr(win, attr)) addedAttrs.add(attr);
    });
  });

  if (addedAttrs.size > 0 || dropMap.size > 0) {
    purifier.addHook("uponSanitizeAttribute", (node, data) => {
      const tag = node.nodeName.toLowerCase();
      const attr = data.attrName;

      if (dropMap.get(tag)?.has(attr)) {
        data.keepAttr = false;
        return;
      }

      // 기본 목록에 없던 속성은 allowAttributes 로 지정한 태그에서만 살린다.
      if (addedAttrs.has(attr) && !allowMap.get(tag)?.has(attr)) {
        data.keepAttr = false;
      }
    });
  }

  return { purifier, addedAttrs: [...addedAttrs] };
};

const buildDompurifyConfig = (
  config: SanitizeHtmlConfig,
  addedAttrs: string[]
): Config => {
  const hasAllowElements = !!config.allowElements?.length;

  return {
    ALLOW_UNKNOWN_PROTOCOLS: false,
    ...(config.addElements?.length && !hasAllowElements
      ? { ADD_TAGS: config.addElements }
      : {}),
    ...(hasAllowElements ? { ALLOWED_TAGS: config.allowElements } : {}),
    ...(addedAttrs.length > 0 ? { ADD_ATTR: addedAttrs } : {}),
    ...(config.dropElements?.length ? { FORBID_TAGS: config.dropElements } : {}),
  };
};

const subscribeNoop = () => () => {};

/** React 18+: 서버·하이드레이션 첫 렌더는 false, 그 외 클라이언트 렌더는 바로 true */
const useIsClientSync = () =>
  React.useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );

/** React 17: 마운트 이후 true */
const useIsClientLegacy = () => {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => setIsClient(true), []);
  return isClient;
};

const useIsClient =
  typeof React.useSyncExternalStore === "function"
    ? useIsClientSync
    : useIsClientLegacy;

/**
 * DOMPurify를 사용하여 HTML을 안전하게 sanitize하고 렌더링하는 React 컴포넌트
 *
 * XSS 공격을 방지하기 위해 위험한 스크립트, 이벤트 핸들러 등을 제거하고,
 * 설정된 규칙에 따라 허용된 태그와 속성만 유지하여 렌더링합니다.
 *
 * @param {SanitizeHtmlProps} props - 컴포넌트 props
 * @param {string} props.content - sanitize할 HTML 문자열
 * @param {SanitizeHtmlConfig} [props.config] - HTML sanitization 설정 옵션
 * @param {keyof React.JSX.IntrinsicElements} [props.tagName="div"] - 렌더링할 HTML 태그 (기본값: "div")
 * @param {string} [props.className] - 적용할 CSS 클래스명
 *
 * 서버 렌더링(SSR)에서는 DOM 이 없어 sanitize 할 수 없으므로 빈 태그를 렌더링하고,
 * 하이드레이션 이후 클라이언트에서 sanitize 한 내용을 채운다. (하이드레이션 불일치 없음)
 *
 * @returns {JSX.Element} sanitize된 HTML을 렌더링하는 React 컴포넌트
 */

export const SanitizeHtmlRender = ({
  content,
  config,
  tagName: Component = "div",
  className,
}: SanitizeHtmlProps) => {
  const isClient = useIsClient();
  const win = isClient ? getBrowserWindow() : null;

  let html = "";
  if (win) {
    const sanitizeConfig = { ...DefaultConfig, ...config };
    const { purifier, addedAttrs } = createPurifier(win, sanitizeConfig);
    html = purifier.sanitize(
      content,
      buildDompurifyConfig(sanitizeConfig, addedAttrs)
    );
  }

  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
