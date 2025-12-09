export type FilterOptions = {
  removeUndefined?: boolean;
  removeNull?: boolean;
  removeEmptyString?: boolean;
  removeEmptyArray?: boolean;
  removeEmptyObject?: boolean;
  // 정제 옵션
  normalizeNumbers?: boolean; // 숫자를 문자열로 변환
  normalizeBooleans?: boolean; // 불리언 문자열을 불리언으로 변환 ("true"/"false")
  normalizeNested?: boolean; // 중첩된 객체/배열도 정제할지 여부
};

/**
 * 서버로 전달하는 params를 정제하는 함수
 *
 * undefined, null, 빈 문자열, 빈 배열, 빈 객체 등을 제거하고,
 * 값의 타입을 정규화합니다.
 * 문자열 값은 trim() 처리되며, trim 후 빈 문자열이 되면 제거됩니다.
 * 숫자 0과 false는 유효한 값으로 간주하여 유지합니다.
 *
 * @param params - 정제할 파라미터 객체
 * @param options - 필터링 및 정제 옵션 설정
 * @param options.removeUndefined - undefined 값을 제거할지 여부 (기본값: true)
 * @param options.removeNull - null 값을 제거할지 여부 (기본값: true)
 * @param options.removeEmptyString - 빈 문자열을 제거할지 여부 (기본값: true)
 * @param options.removeEmptyArray - 빈 배열을 제거할지 여부 (기본값: true)
 * @param options.removeEmptyObject - 빈 객체를 제거할지 여부 (기본값: true)
 * @param options.normalizeNumbers - 숫자를 문자열로 변환할지 여부 (기본값: false)
 * @param options.normalizeBooleans - 불리언 문자열을 불리언으로 변환할지 여부 (기본값: false)
 * @param options.normalizeNested - 중첩된 객체/배열도 정제할지 여부 (기본값: false)
 * @returns 정제된 파라미터 객체
 *
 * @example
 * ```typescript
 * // 기본 사용 (제거만)
 * const params = {
 *   name: "John",
 *   email: "  ",
 *   age: 30,
 *   tags: [],
 *   active: false
 * };
 * const filtered = filterParams(params);
 * // 결과: { name: "John", age: 30, active: false }
 *
 * // 숫자를 문자열로 변환
 * const params2 = { id: 123, name: "John" };
 * const filtered2 = filterParams(params2, { normalizeNumbers: true });
 * // 결과: { id: "123", name: "John" }
 *
 * // 불리언 문자열을 불리언으로 변환
 * const params3 = { active: "true", enabled: "false" };
 * const filtered3 = filterParams(params3, { normalizeBooleans: true });
 * // 결과: { active: true, enabled: false }
 * ```
 */
export const filterParams = (
  params: Record<string, unknown>,
  options: FilterOptions = {}
): Record<string, unknown> => {
  const {
    removeUndefined = true,
    removeNull = true,
    removeEmptyString = true,
    removeEmptyArray = true,
    removeEmptyObject = true,
    normalizeNumbers = false,
    normalizeBooleans = false,
    normalizeNested = false,
  } = options;

  const shouldRemove = (value: unknown): boolean => {
    switch (true) {
      case removeUndefined && value === undefined:
        return true;
      case removeNull && value === null:
        return true;
      case removeEmptyString && value === "":
        return true;
      case removeEmptyArray && Array.isArray(value) && value.length === 0:
        return true;
      case removeEmptyObject &&
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0:
        return true;
      default:
        return false;
    }
  };

  const normalizeValue = (value: unknown): unknown => {
    // 중첩된 객체/배열 재귀 정제
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        if (normalizeNested) {
          return value
            .map((item) => normalizeValue(item))
            .filter((item) => !shouldRemove(item));
        }
        return value;
      }
      if (typeof value === "object") {
        if (normalizeNested) {
          return filterParams(value as Record<string, unknown>, options);
        }
        return value;
      }
    }

    // 문자열 정제
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (normalizeBooleans) {
        const lowerTrimmed = trimmed.toLowerCase();
        if (lowerTrimmed === "true") return true;
        if (lowerTrimmed === "false") return false;
      }
      return trimmed;
    }

    // 숫자를 문자열로 변환
    if (normalizeNumbers && typeof value === "number") {
      return String(value);
    }

    return value;
  };

  return Object.fromEntries(
    Object.entries(params)
      .map(([key, value]) => [key, normalizeValue(value)])
      .filter(([, value]) => !shouldRemove(value))
  );
};
