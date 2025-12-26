import React from "react";
import dompurify, { type Config } from "dompurify";

/**
 * HTML sanitization 설정 옵션
 *
 * @interface SanitizeHtmlConfig
 * @property {string[]} [addElements] - 기본 허용 태그에 추가할 HTML 태그 목록. allowElements가 있으면 무시됨
 * @property {string[]} [allowElements] - 허용할 HTML 태그 목록. 비어있으면 기본 DOMPurify 허용 태그 사용
 * @property {Record<string, string[]>} [allowAttributes] - 태그별 허용할 속성 목록.
 * @property {string[]} [dropElements] - 제거할 HTML 태그 목록
 * @property {Record<string, string[]>} [dropAttributes] - 태그별 제거할 속성 목록
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

const getAttrs = (attrMap: Record<string, string[]> | undefined): string[] => {
  if (!attrMap) return [];
  return Array.from(new Set(Object.values(attrMap).flat()));
};

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
 * @returns {JSX.Element} sanitize된 HTML을 렌더링하는 React 컴포넌트
 */

export const SanitizeHtmlRender = ({
  content,
  config,
  tagName: Component = "div",
  className,
}: SanitizeHtmlProps) => {
  const sanitizeConfig = { ...DefaultConfig, ...config };

  // 1. ALLOWED_ATTR 계산
  const allowedAttrs = getAttrs(sanitizeConfig.allowAttributes);
  const allowedAttrsConfig =
    allowedAttrs.length > 0
      ? {
          ALLOWED_ATTR: [...new Set([...allowedAttrs, "class", "id", "style"])],
        }
      : {};

  // 2. FORBID_ATTR 계산
  const forbiddenAttrs = getAttrs(sanitizeConfig.dropAttributes);
  const forbiddenAttrsConfig =
    forbiddenAttrs.length > 0 ? { FORBID_ATTR: forbiddenAttrs } : {};

  // 3. ADD_TAGS 계산
  const addTagsConfig =
    sanitizeConfig.addElements &&
    sanitizeConfig.addElements.length > 0 &&
    !(sanitizeConfig.allowElements && sanitizeConfig.allowElements.length > 0)
      ? { ADD_TAGS: sanitizeConfig.addElements }
      : {};

  // 4. ALLOWED_TAGS 계산
  const allowedTagsConfig =
    sanitizeConfig.allowElements && sanitizeConfig.allowElements.length > 0
      ? { ALLOWED_TAGS: sanitizeConfig.allowElements }
      : {};

  // 5. FORBID_TAGS 계산
  const forbidTagsConfig =
    sanitizeConfig.dropElements && sanitizeConfig.dropElements.length > 0
      ? { FORBID_TAGS: sanitizeConfig.dropElements }
      : {};

  const dompurifyConfig: Config = {
    ALLOW_UNKNOWN_PROTOCOLS: false,

    ...addTagsConfig,
    ...allowedTagsConfig,
    ...forbiddenAttrsConfig,
    ...allowedAttrsConfig,
    ...forbidTagsConfig,
  };

  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{
        __html: dompurify.sanitize(content, dompurifyConfig),
      }}
    />
  );
};
