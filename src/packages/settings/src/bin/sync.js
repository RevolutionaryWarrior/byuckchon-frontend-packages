#!/usr/bin/env node
/**
 * byuckchon-settings-sync
 * -----------------------------------------------------------------------
 * settings 가 관리하지만 "실제 파일로 존재해야만 하는" 설정을 프로젝트에 내려받는다.
 *
 * eslint / prettier / tsconfig 는 import·extends 로 참조가 되므로 여기 없다.
 * (settings 버전만 올리면 자동으로 반영된다)
 * 반면 아래 파일들은 참조 문법이 없어서 내용 전체가 프로젝트에 있어야 한다.
 *
 *   npx byuckchon-settings-sync              # 프로젝트 유형을 감지해 해당하는 것 전부
 *   npx byuckchon-settings-sync vscode       # 하나만
 *   npx byuckchon-settings-sync --check      # 차이만 보고 (CI 용, 다르면 exit 1)
 *   npx byuckchon-settings-sync --list       # 대상 목록
 *
 * 프로젝트가 값을 바꾸는 것은 자유다. 팀 표준으로 되돌리고 싶을 때 실행하면 된다.
 * JSON 대상은 settings 가 정의하지 않은 키를 건드리지 않는다.
 * -----------------------------------------------------------------------
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const src = (...p) => path.join(HERE, '..', ...p);

/**
 * scope: 어떤 프로젝트에 해당하는지
 *   'all'      — 단일·모노레포 모두
 *   'monorepo' — 모노레포 루트에만
 *   'single'   — 단일 프로젝트에만
 */
const TARGETS = {
  vscode: { source: src('vscode/settings.json'), target: '.vscode/settings.json', kind: 'json', scope: 'all' },
  nvmrc: { source: src('project/nvmrc'), target: '.nvmrc', kind: 'text', scope: 'all' },
  npmrc: { source: src('project/npmrc.monorepo'), target: '.npmrc', kind: 'text', scope: 'monorepo' },
  turbo: { source: src('project/turbo.json'), target: 'turbo.json', kind: 'json', scope: 'monorepo' },
};

/** pnpm-workspace.yaml 또는 turbo.json 이 있으면 모노레포 루트로 본다. */
async function detectProjectType(cwd) {
  for (const marker of ['pnpm-workspace.yaml', 'pnpm-workspace.yml', 'turbo.json']) {
    try {
      await fs.access(path.join(cwd, marker));
      return 'monorepo';
    } catch {
      /* 다음 marker 확인 */
    }
  }
  return 'single';
}

async function readText(file) {
  try {
    return await fs.readFile(file, 'utf8');
  } catch {
    return null;
  }
}

/** 변경이 필요한 키(JSON) 또는 전체 변경 여부(text)를 돌려준다. */
function diffOf(spec, current, managed) {
  if (spec.kind === 'json') {
    const a = current ? JSON.parse(current) : null;
    const b = JSON.parse(managed);
    return Object.keys(b).filter((k) => JSON.stringify(a?.[k]) !== JSON.stringify(b[k]));
  }
  return current === managed ? [] : ['내용'];
}

function mergedContent(spec, current, managed) {
  if (spec.kind !== 'json') return managed;
  const a = current ? JSON.parse(current) : {};
  const b = JSON.parse(managed);
  return JSON.stringify({ ...a, ...b }, null, 2) + '\n';
}

async function syncOne(name, spec, { check, cwd }) {
  const managed = await readText(spec.source);
  if (managed === null) {
    console.error(`  ${spec.target}: settings 안에서 원본을 찾지 못했습니다 (${spec.source})`);
    return { name, status: 'error' };
  }

  const targetPath = path.resolve(cwd, spec.target);
  const current = await readText(targetPath);
  const diff = diffOf(spec, current, managed);

  if (diff.length === 0) {
    console.log(`  ${spec.target}: 이미 팀 표준과 같습니다.`);
    return { name, status: 'same' };
  }

  if (check) {
    console.error(`  ${spec.target}: 팀 표준과 다릅니다 (${diff.join(', ')})`);
    return { name, status: 'drift' };
  }

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, mergedContent(spec, current, managed), 'utf8');
  console.log(`  ${spec.target}: 갱신 (${diff.join(', ')})`);
  return { name, status: 'updated' };
}

async function run() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const names = args.filter((a) => !a.startsWith('--'));
  const cwd = process.cwd();

  if (args.includes('--list')) {
    for (const [name, spec] of Object.entries(TARGETS)) {
      console.log(`${name.padEnd(8)} → ${spec.target.padEnd(22)} (${spec.scope})`);
    }
    return;
  }

  const projectType = await detectProjectType(cwd);

  let selected;
  if (names.length) {
    selected = names.map((name) => {
      if (!TARGETS[name]) {
        console.error(`알 수 없는 대상: ${name}\n사용 가능: ${Object.keys(TARGETS).join(', ')}`);
        process.exit(1);
      }
      return [name, TARGETS[name]];
    });
  } else {
    selected = Object.entries(TARGETS).filter(
      ([, spec]) => spec.scope === 'all' || spec.scope === projectType,
    );
    console.log(`프로젝트 유형: ${projectType === 'monorepo' ? '모노레포' : '단일 프로젝트'}`);
  }

  const results = [];
  for (const [name, spec] of selected) {
    results.push(await syncOne(name, spec, { check, cwd }));
  }

  if (results.some((r) => r.status === 'error')) process.exit(1);

  const drifted = results.filter((r) => r.status === 'drift');
  if (drifted.length) {
    console.error(`\n${drifted.length}개가 팀 표준과 다릅니다.`);
    console.error('  npx byuckchon-settings-sync  로 맞출 수 있습니다.');
    process.exit(1);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
