#!/usr/bin/env node
/**
 * byuckchon-pr-description
 * -----------------------------------------------------------------------
 * PR 의 커밋 목록을 타입별로 묶어 PR 본문에 채워 넣는다.
 *
 * GitHub Actions 에서 실행한다. 필요한 환경변수:
 *   GH_TOKEN / GITHUB_TOKEN     (pull-requests: write 권한)
 *   REPO / GITHUB_REPOSITORY    owner/repo
 *   PR_NUMBER
 *
 * 사람이 쓴 내용은 건드리지 않는다. 아래 마커 사이만 교체한다.
 *   <!-- byuckchon:commits:start -->
 *   <!-- byuckchon:commits:end -->
 * 마커가 없으면 본문 끝에 한 번 덧붙인다. (PR 템플릿이 없어도 동작)
 * -----------------------------------------------------------------------
 */

import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const START = '<!-- byuckchon:commits:start -->';
const END = '<!-- byuckchon:commits:end -->';

/** 커밋 타입별 표시 순서와 제목. 목록에 없는 타입은 "기타"로 모은다. */
const TYPES = [
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

const TYPE_LABEL = new Map(TYPES);
const SECTION_ORDER = [...new Set(TYPES.map(([, label]) => label)), '📦 분류 없음'];

const CONVENTIONAL = /^(?<type>[a-z]+)(?:\((?<scope>[^)]*)\))?(?<breaking>!)?:\s*(?<subject>.+)$/;

/* ============================================================
   순수 로직 (테스트 가능)
============================================================ */

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

/**
 * 커밋 본문에서 리뷰 포인트를 뽑는다.
 *
 * AI 로 코드를 짜다 보면 "여긴 리뷰어가 봐야 한다"는 판단이 생긴다.
 * 그걸 커밋 본문에 남겨두면 PR 에 자동으로 모인다.
 *
 *   feat: 주문 목록 API 연동
 *
 *   NOTE: 응답 스키마 미확정이라 any 가 남아 있습니다
 *   TODO: 에러 처리 미구현
 */
const NOTE_LINE = /^[\s>*-]*(NOTE|TODO)\s*:\s*(.+)$/i;

export function parseNotes(message) {
  return String(message)
    .split('\n')
    .slice(1) // 첫 줄(제목)은 제외
    .map((line) => NOTE_LINE.exec(line.trim()))
    .filter(Boolean)
    .map((matched) => ({
      kind: matched[1].toUpperCase(),
      text: matched[2].trim(),
    }));
}

/**
 * PR 제목에 브랜치 유형을 대괄호로 붙인다.
 *
 *   feature/update-mypage-style/hyuk + "마이페이지 디자인 적용"
 *     → "[feature] 마이페이지 디자인 적용"
 *
 * 사람이 쓴 제목은 그대로 두고 앞에만 붙인다. 이미 대괄호가 있으면 건드리지 않는다.
 * 제목이 브랜치명 그대로면(제목을 안 쓴 경우) 브랜치 가운데 토막으로 대신 만든다.
 */
export function buildTitle(currentTitle, branch) {
  const title = (currentTitle ?? '').trim();
  const segments = String(branch ?? '').split('/').filter(Boolean);

  if (segments.length < 2) return title || null;
  if (/^\[[^\]]+\]/.test(title)) return title;

  const type = segments[0];
  // 마지막 토막은 작업자 이름이라 제외한다.
  const summary = segments.slice(1, -1).join(' ').replace(/[-_]+/g, ' ').trim();
  const body = title && title !== branch ? title : summary;

  if (!body) return title || null;
  return `[${type}] ${body}`;
}

/** 머지 커밋은 제외한다. (부모가 2개 이상) */
export function isMergeCommit(commit) {
  return Array.isArray(commit.parents) && commit.parents.length > 1;
}

/**
 * 커밋 목록 → 마크다운 섹션.
 * @param {Array<{sha: string, message: string, url?: string}>} commits
 */
export function renderCommitSection(commits) {
  if (!commits.length) return '_커밋이 없습니다._';

  const sections = new Map();
  const breaking = [];

  for (const commit of commits) {
    const parsed = parseCommit(commit.message);
    const label = parsed.type ? TYPE_LABEL.get(parsed.type) : '📦 분류 없음';
    const short = commit.sha.slice(0, 7);
    const scope = parsed.scope ? `**${parsed.scope}** — ` : '';
    const text = parsed.fallback ?? parsed.subject;

    if (!sections.has(label)) sections.set(label, []);
    sections.get(label).push(`- ${scope}${text} (${short})`);

    if (parsed.breaking) breaking.push(`- ${text} (${short})`);
  }

  const lines = [];

  if (breaking.length) {
    lines.push('### ⚠️ Breaking Changes', ...breaking, '');
  }

  for (const label of SECTION_ORDER) {
    const items = sections.get(label);
    if (!items?.length) continue;
    lines.push(`### ${label}`, ...items, '');
  }

  return lines.join('\n').trimEnd();
}

/** 리뷰 포인트 섹션. 없으면 빈 문자열. */
export function renderNoteSection(commits) {
  const lines = [];

  for (const commit of commits) {
    for (const note of parseNotes(commit.message)) {
      lines.push(`- \`${note.kind}\` ${note.text} (${commit.sha.slice(0, 7)})`);
    }
  }

  if (!lines.length) return '';
  return ['## ⚠️ 리뷰 포인트', '', ...lines].join('\n');
}

/** 본문의 마커 구간만 교체한다. 마커가 없으면 끝에 덧붙인다. */
export function applyToBody(body, section, noteSection = '') {
  const parts = [`## 커밋 내역`, '', section];
  if (noteSection) parts.push('', noteSection);
  const block = `${START}\n${parts.join('\n')}\n${END}`;
  const current = body ?? '';
  const startIndex = current.indexOf(START);
  const endIndex = current.indexOf(END);

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    return current.slice(0, startIndex) + block + current.slice(endIndex + END.length);
  }

  return current.trim() ? `${current.trimEnd()}\n\n${block}\n` : `${block}\n`;
}

/* ============================================================
   GitHub API
============================================================ */

function requireEnv() {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  const repo = process.env.REPO || process.env.GITHUB_REPOSITORY;
  const prNumber = process.env.PR_NUMBER;

  if (!token || !repo || !prNumber) {
    throw new Error(
      'GH_TOKEN/GITHUB_TOKEN, REPO/GITHUB_REPOSITORY, PR_NUMBER 가 모두 필요합니다.',
    );
  }
  // GitHub Actions 가 기본 제공한다. GHES 에서도 그대로 동작한다.
  const apiUrl = (process.env.GITHUB_API_URL || 'https://api.github.com').replace(/\/$/, '');

  return { token, repo, prNumber, apiUrl };
}

async function api(method, apiPath, { token, repo, apiUrl }, body) {
  const response = await fetch(`${apiUrl}/repos/${repo}${apiPath}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'byuckchon-pr-description',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${method} ${apiPath} → ${response.status} ${await response.text()}`);
  }
  return response.json();
}

/** PR 커밋을 전부 가져온다. (GitHub 은 PR 당 최대 250개까지 반환) */
async function fetchCommits(env) {
  const collected = [];

  for (let page = 1; page <= 3; page += 1) {
    const batch = await api('GET', `/pulls/${env.prNumber}/commits?per_page=100&page=${page}`, env);
    collected.push(...batch);
    if (batch.length < 100) break;
  }

  return collected
    .filter((commit) => !isMergeCommit(commit))
    .map((commit) => ({ sha: commit.sha, message: commit.commit.message }));
}

async function main() {
  const env = requireEnv();
  const commits = await fetchCommits(env);

  const pullRequest = await api('GET', `/pulls/${env.prNumber}`, env);

  const nextBody = applyToBody(
    pullRequest.body,
    renderCommitSection(commits),
    renderNoteSection(commits),
  );
  const nextTitle = buildTitle(pullRequest.title, pullRequest.head?.ref);

  const patch = {};
  if (nextBody !== (pullRequest.body ?? '')) patch.body = nextBody;
  if (nextTitle && nextTitle !== pullRequest.title) patch.title = nextTitle;

  if (!Object.keys(patch).length) {
    console.log('PR 이 이미 최신입니다. 변경하지 않았습니다.');
    return;
  }

  await api('PATCH', `/pulls/${env.prNumber}`, env, patch);

  const changed = [
    patch.title ? `제목 → ${patch.title}` : null,
    patch.body ? `본문 (커밋 ${commits.length}건)` : null,
  ].filter(Boolean);
  console.log(`PR 갱신 완료 — ${changed.join(' / ')}`);
}

// 직접 실행될 때만 동작한다. (테스트에서 import 할 수 있도록)
// npx 는 node_modules/.bin 의 심볼릭 링크로 실행하므로 realpath 로 비교한다.
function isDirectRun() {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
}

if (isDirectRun()) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
