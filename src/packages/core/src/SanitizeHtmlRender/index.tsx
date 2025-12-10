import React from "react";
import dompurify, { type Config } from "dompurify";

/**
 * HTML sanitization 설정 옵션
 *
 * @interface SanitizeHtmlConfig
 * @property {string[]} [allowElements] - 허용할 HTML 태그 목록. 비어있으면 기본 DOMPurify 허용 태그 사용
 * @property {string[]} [addElements] - 기본 허용 태그에 추가할 HTML 태그 목록. allowElements가 있으면 무시됨
 * @property {string[]} [dropElements] - 제거할 HTML 태그 목록
 * @property {Record<string, string[]>} [allowAttributes] - 태그별 허용할 속성 목록.
 * @property {Record<string, string[]>} [dropAttributes] - 태그별 제거할 속성 목록
 */
export interface SanitizeHtmlConfig {
  allowElements?: string[];
  addElements?: string[];
  dropElements?: string[];
  allowAttributes?: Record<string, string[]>;
  dropAttributes?: Record<string, string[]>;
}

interface SanitizeHtmlProps {
  content: string;
  config?: SanitizeHtmlConfig;
  tagName?: keyof React.JSX.IntrinsicElements;
  className?: string;
}

const DefaultConfig: SanitizeHtmlConfig = {
  allowElements: [],
  addElements: [],
  dropElements: [],
  allowAttributes: {},
  dropAttributes: {},
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
 *
 * @example
 * ```tsx
 * // 기본 사용 (div 태그)
 * <SanitizeHtmlRender content='<h1>제목</h1><script>alert("XSS")</script>' />
 * // 결과: <div><h1>제목</h1></div>
 *
 * // 특정 태그로 렌더링 (tagName)
 * <SanitizeHtmlRender
 *   content='<h1>제목</h1>'
 *   tagName="section"
 *   className="p-4 bg-gray-50"
 * />
 * // 결과: <section class="p-4 bg-gray-50"><h1>제목</h1></section>
 *
 * // 특정 태그만 허용 (allowElements)
 * <SanitizeHtmlRender
 *   content='<h1>제목</h1><p>내용</p><div>div</div>'
 *   config={{
 *     allowElements: ['h1', 'p']
 *   }}
 * />
 * // 결과: <div><h1>제목</h1><p>내용</p></div>
 *
 * // 특정 속성만 허용 (allowAttributes)
 * <SanitizeHtmlRender
 *   content='<a href="https://example.com" onclick="alert()">링크</a>'
 *   config={{
 *     allowAttributes: { a: ['href'] }
 *   }}
 * />
 * // 결과: <div><a href="https://example.com">링크</a></div>
 *
 * // 기본 허용 태그에 몇 개만 추가 (addElements)
 * <SanitizeHtmlRender
 *   content='<h1>제목</h1><p>내용</p><custom-tag>커스텀</custom-tag>'
 *   config={{
 *     addElements: ['custom-tag', 'my-component']
 *   }}
 * />
 * // 결과: 기본 허용 태그(h1, p 등) + custom-tag, my-component가 허용됨
 *
 * // 특정 태그 제거 (dropElements)
 * <SanitizeHtmlRender
 *   content='<h1>제목</h1><p>내용</p><script>alert("XSS")</script><div>div</div>'
 *   config={{
 *     dropElements: ['script', 'div']
 *   }}
 * />
 * // 결과: <div><h1>제목</h1><p>내용</p></div>
 *
 * // 특정 속성 제거 (dropAttributes)
 * <SanitizeHtmlRender
 *   content='<a href="https://example.com" onclick="alert()" target="_blank">링크</a>'
 *   config={{
 *     dropAttributes: { a: ['onclick', 'target'] }
 *   }}
 * />
 * // 결과: <div><a href="https://example.com">링크</a></div>
 * ```
 */
export const SanitizeHtmlRender = ({
  content,
  config,
  tagName: Component = "div",
  className,
}: SanitizeHtmlProps) => {
  const sanitizeConfig = config || DefaultConfig;

  // DOMPurify Config 형식으로 변환
  const dompurifyConfig: Config = {
    ALLOW_UNKNOWN_PROTOCOLS: false,
  };

  // allowElements가 있으면 해당 태그만 사용, 없으면 기본 태그 사용
  if (sanitizeConfig.allowElements && sanitizeConfig.allowElements.length > 0) {
    // allowElements가 지정되면 해당 태그만 허용
    dompurifyConfig.ALLOWED_TAGS = sanitizeConfig.allowElements;
  } else if (
    sanitizeConfig.addElements &&
    sanitizeConfig.addElements.length > 0
  ) {
    // addElements가 있으면 기본 태그에 추가
    // DOMPurify의 ADD_TAGS를 사용하여 기본 허용 태그를 유지하면서 추가 태그만 허용
    dompurifyConfig.ADD_TAGS = sanitizeConfig.addElements;
  }

  // allowAttributes가 있으면 ALLOWED_ATTR로 변환
  // allowAttributes를 설정하면 기본 허용 속성이 무시되므로 필요한 모든 속성을 명시해야 함
  if (sanitizeConfig.allowAttributes) {
    const allowedAttrs = Object.values(sanitizeConfig.allowAttributes).flat();

    if (allowedAttrs.length > 0) {
      // 기본 허용 속성도 포함 (class, id 등)
      dompurifyConfig.ALLOWED_ATTR = [
        ...new Set([...allowedAttrs, "class", "id", "style"]),
      ];
    }
  }

  // dropElements가 있으면 FORBID_TAGS로 변환
  if (sanitizeConfig.dropElements && sanitizeConfig.dropElements.length > 0) {
    dompurifyConfig.FORBID_TAGS = sanitizeConfig.dropElements;
  }

  // dropAttributes가 있으면 FORBID_ATTR로 변환
  if (sanitizeConfig.dropAttributes) {
    const forbiddenAttrs = Object.values(sanitizeConfig.dropAttributes).flat();

    if (forbiddenAttrs.length > 0) {
      dompurifyConfig.FORBID_ATTR = forbiddenAttrs;
    }
  }

  const sanitizedContent = dompurify.sanitize(content, dompurifyConfig);

  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};
