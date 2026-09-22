import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * 디자인 토큰에서 생성된 타이포그래피 유틸리티 이름의 기본 패턴.
 *
 * tailwind-merge 는 모르는 `text-*` 를 전부 "글자 색" 으로 분류한다.
 * 그래서 아무 설정 없이 쓰면 타이포와 색이 충돌해 한쪽이 조용히 사라진다.
 *
 *   twMerge('text-body-sm-regular', 'text-primitive-neutral-600')
 *     → 'text-primitive-neutral-600'   ← 타이포가 사라짐
 *
 * 아래 패턴에 걸리는 이름은 색이 아니라 타이포로 취급한다.
 */
const DEFAULT_TYPOGRAPHY: ReadonlyArray<string | RegExp> = [
  /^(display|heading|title|subtitle|body|caption|label|overline)(-|$)/,
];

export interface CreateCnOptions {
  /**
   * 이 프로젝트의 타이포그래피 유틸리티 이름. `text-` 를 뗀 부분과 비교한다.
   *
   * 문자열을 주면 완전일치 또는 `<문자열>-` 접두사로 판정하고, 정규식도 받는다.
   * 토큰 이름 체계가 기본 패턴과 다르면 여기에 직접 넘긴다.
   *
   *   createCn({ typography: ['tab-bar', 'sub', /^input(-|$)/] })
   */
  typography?: ReadonlyArray<string | RegExp>;
}

function matcher(patterns: ReadonlyArray<string | RegExp>) {
  return (value: string) =>
    patterns.some((pattern) =>
      typeof pattern === 'string'
        ? value === pattern || value.startsWith(`${pattern}-`)
        : pattern.test(value),
    );
}

/**
 * 프로젝트의 타이포그래피 이름 체계에 맞춘 `cn` 을 만든다.
 *
 * 기본 `cn` 으로 충분하지 않을 때만 쓴다.
 */
export function createCn(options?: CreateCnOptions) {
  const isTypography = matcher(options?.typography ?? DEFAULT_TYPOGRAPHY);

  const merge = extendTailwindMerge({
    extend: {
      classGroups: {
        // 타이포를 글자 크기 그룹으로 옮겨 글자 색과 충돌하지 않게 한다.
        'font-size': [{ text: [isTypography] }],
      },
    },
  });

  return (...inputs: ClassValue[]) => merge(clsx(inputs));
}

/** 클래스 병합. 같은 성격의 클래스가 겹치면 뒤에 온 것이 이긴다. */
export const cn = createCn();
