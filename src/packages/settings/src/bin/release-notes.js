#!/usr/bin/env node
/**
 * byuckchon-release-notes
 * -----------------------------------------------------------------------
 * 배포가 **성공한 뒤에만** 태그 이름과 릴리즈 노트를 만든다.
 * (bc deploy 가 만드는 deploy.yml 의 release job 에서 실행)
 *
 *   npx byuckchon-release-notes --prefix "web@" --version date
 *     → 이전 web@* 태그 이후 커밋을 feat / fix 로 묶어 notes.md 작성
 *     → $GITHUB_OUTPUT 에 tag=web@2026.11.05 기록
 *
 *   npx byuckchon-release-notes --slack notes.md
 *     → SLACK_WEBHOOK_URL 로 "web@2026.11.05 운영 배포 완료" + Release 링크 전송
 *
 * 커밋 기록이 필요하므로 checkout 에 `fetch-depth: 0` 이 있어야 한다.
 * 태그는 만들지 않는다. 다음 step 의 `gh release create` 가 만든다.
 * -----------------------------------------------------------------------
 */

import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { parseCommit } from './lib/commits.js';

/** 릴리즈 노트에 남기는 섹션. 나머지(refactor · chore …)는 사용자에게 의미가 없어 뺀다. */
const RELEASE_SECTIONS = [
  ['feat', '✨ 기능'],
  ['fix', '🐛 수정'],
];

/* ============================================================
   순수 로직 (테스트 가능)
============================================================ */

/** 한국 시간 기준 오늘 → "2026.11.05" (러너는 UTC 라 그대로 쓰면 오전 배포 날짜가 하루 밀린다) */
export function todayStamp(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now); // 2026-11-05
  return parts.replaceAll('-', '.');
}

/**
 * 날짜 버전 태그를 정한다. 같은 날 두 번째 배포부터 .2 .3 … 을 붙인다.
 *   web@2026.11.05 → web@2026.11.05.2 → web@2026.11.05.3
 */
export function nextDateTag(prefix, stamp, existingTags) {
  const base = `${prefix}${stamp}`;
  const taken = new Set(existingTags);
  if (!taken.has(base)) return base;

  let n = 2;
  while (taken.has(`${base}.${n}`)) n += 1;
  return `${base}.${n}`;
}

/** 커밋 제목에 PR 번호가 없으면 짧은 sha 를 붙인다. (squash 머지는 보통 "(#123)" 이 이미 있다) */
function itemOf(subject, sha) {
  return /\(#\d+\)\s*$/.test(subject) ? `- ${subject}` : `- ${subject} (${sha.slice(0, 7)})`;
}

/**
 * 커밋 목록 → notes.md 내용
 * @param {object} args
 * @param {string} args.tag 이번 태그
 * @param {string | null} args.previousTag 이전 태그 (첫 릴리즈면 null)
 * @param {Array<{ sha: string, message: string }>} args.commits 이전 태그 이후 커밋 (머지 제외)
 */
export function renderReleaseNotes({ tag, previousTag, commits }) {
  const grouped = new Map(RELEASE_SECTIONS.map(([type]) => [type, []]));

  for (const commit of commits) {
    const parsed = parseCommit(commit.message);
    if (!grouped.has(parsed.type)) continue;
    grouped.get(parsed.type).push(itemOf(parsed.subject, commit.sha));
  }

  const summary = RELEASE_SECTIONS.map(
    ([type, label]) => `${label} ${grouped.get(type).length}`,
  ).join(' · ');

  const lines = [`## ${tag}`, '', summary, ''];

  for (const [type, label] of RELEASE_SECTIONS) {
    const items = grouped.get(type);
    if (!items.length) continue;
    lines.push(`### ${label}`, ...items, '');
  }

  if (!grouped.get('feat').length && !grouped.get('fix').length) {
    lines.push('_사용자에게 보이는 변경(feat · fix)이 없습니다._', '');
  }

  lines.push(
    previousTag
      ? `<sub>이전 ${previousTag} 이후 커밋 ${commits.length}개</sub>`
      : `<sub>첫 릴리즈 — 커밋 ${commits.length}개</sub>`,
  );

  return lines.join('\n') + '\n';
}

/** notes.md → Slack 메시지 */
export function renderSlackMessage(notes, releaseUrl) {
  const tag = /^##\s+(.+)$/m.exec(notes)?.[1]?.trim() ?? '새 버전';
  const summary = notes.split('\n').find((line) => line.startsWith('✨')) ?? '';
  const link = releaseUrl ? `\n<${releaseUrl}|릴리즈 노트 보기>` : '';
  return { text: `🚀 *${tag}* 운영 배포 완료\n${summary}${link}`.trim(), tag };
}

/* ============================================================
   git
============================================================ */

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

/** HEAD 에서 닿는 가장 가까운 <prefix>* 태그 */
function findPreviousTag(prefix) {
  try {
    return git(['describe', '--tags', '--abbrev=0', '--match', `${prefix}*`, 'HEAD']);
  } catch {
    return null; // 첫 릴리즈
  }
}

const SEPARATOR = '\u001e';

/** 이전 태그 이후 커밋 (머지 커밋 제외, 오래된 순) */
function collectCommits(previousTag) {
  const range = previousTag ? [`${previousTag}..HEAD`] : ['HEAD'];
  const raw = git(['log', '--no-merges', '--reverse', `--format=%H%n%B${SEPARATOR}`, ...range]);

  return raw
    .split(SEPARATOR)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [sha, ...rest] = chunk.split('\n');
      return { sha, message: rest.join('\n') };
    });
}

/* ============================================================
   CLI
============================================================ */

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith('--')) continue;
    const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[(i += 1)] : true;
    args[key.slice(2)] = value;
  }
  return args;
}

function writeNotes(args) {
  const prefix = typeof args.prefix === 'string' ? args.prefix : '';
  const version = args.version ?? 'date';
  const out = typeof args.out === 'string' ? args.out : 'notes.md';

  if (version !== 'date') {
    // TODO: SemVer 모드 — feat → minor, fix → patch, `!` → major 로 이전 태그에서 올린다.
    throw new Error(`--version ${version} 은 아직 지원하지 않습니다. (현재는 date 만)`);
  }

  const existing = git(['tag', '--list', `${prefix}*`]).split('\n').filter(Boolean);
  // --date 2026.11.05 는 로컬 확인용. CI 에서는 쓰지 않는다.
  const stamp = typeof args.date === 'string' ? args.date : todayStamp();
  const tag = nextDateTag(prefix, stamp, existing);

  const previousTag = findPreviousTag(prefix);
  const commits = collectCommits(previousTag);
  writeFileSync(out, renderReleaseNotes({ tag, previousTag, commits }), 'utf8');

  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `tag=${tag}\n`);
  }
  console.log(`${out} 작성 — ${tag} (이전 ${previousTag ?? '없음'}, 커밋 ${commits.length}개)`);
}

async function postSlack(file) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) {
    console.log('SLACK_WEBHOOK_URL 이 없어 Slack 알림을 건너뜁니다.');
    return;
  }

  const notes = readFileSync(file, 'utf8');
  const { tag } = renderSlackMessage(notes);
  const { GITHUB_SERVER_URL, GITHUB_REPOSITORY } = process.env;
  const releaseUrl =
    GITHUB_SERVER_URL && GITHUB_REPOSITORY
      ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/releases/tag/${encodeURIComponent(tag)}`
      : null;

  const { text } = renderSlackMessage(notes, releaseUrl);
  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error(`Slack 전송 실패 → ${response.status} ${await response.text()}`);
  }
  console.log(`Slack 알림 전송 — ${tag}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (typeof args.slack === 'string') {
    await postSlack(args.slack);
    return;
  }
  writeNotes(args);
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
