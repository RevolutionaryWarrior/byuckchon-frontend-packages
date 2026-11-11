/**
 * 커밋 메시지 분류 — byuckchon-pr-description · byuckchon-release-notes 가 함께 쓴다.
 *
 * 두 곳이 같은 기준으로 묶어야 PR 본문과 릴리즈 노트의 분류가 어긋나지 않는다.
 */

/** 커밋 타입별 표시 순서와 제목. 목록에 없는 타입은 "기타"로 모은다. */
export const TYPES = [
  ['feat', '✨ 기능'],
  ['fix', '🐛 수정'],
  ['refactor', '♻️ 리팩터'],
  ['perf', '⚡ 성능'],
  ['style', '💄 스타일'],
  ['design', '💄 스타일'],
  ['docs', '📝 문서'],
  ['test', '✅ 테스트'],
  ['chore', '🔧 기타'],
  ['build', '🔧 기타'],
  ['ci', '🔧 기타'],
  ['config', '🔧 기타'],
];

export const TYPE_LABEL = new Map(TYPES);
export const UNCLASSIFIED = '📦 분류 없음';
export const SECTION_ORDER = [...new Set(TYPES.map(([, label]) => label)), UNCLASSIFIED];

export const CONVENTIONAL =
  /^(?<type>[a-z]+)(?:\((?<scope>[^)]*)\))?(?<breaking>!)?:\s*(?<subject>.+)$/;

/** 커밋 메시지 첫 줄을 파싱한다. 컨벤션을 안 지켰으면 type 이 null. */
export function parseCommit(message) {
  const subjectLine = String(message).split('\n')[0].trim();
  const matched = CONVENTIONAL.exec(subjectLine);

  if (!matched) return { type: null, scope: null, breaking: false, subject: subjectLine };

  const { type, scope, breaking, subject } = matched.groups;
  return {
    type: TYPE_LABEL.has(type) ? type : null,
    scope: scope || null,
    breaking: Boolean(breaking),
    subject: subject.trim(),
    // 컨벤션 형태지만 모르는 타입이면 원문을 그대로 보여준다.
    fallback: TYPE_LABEL.has(type) ? null : subjectLine,
  };
}

/** 파싱 결과 → 섹션 제목 */
export function labelOf(parsed) {
  return parsed.type ? TYPE_LABEL.get(parsed.type) : UNCLASSIFIED;
}
