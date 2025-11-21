export type FilterOptions = {
  removeUndefined?: boolean;
  removeNull?: boolean;
  removeEmptyString?: boolean;
  removeEmptyArray?: boolean;
  removeEmptyObject?: boolean;
};

/**
 * 서버로 전달하는 params를 정제하는 함수
 *
 * undefined, null, 빈 문자열, 빈 배열, 빈 객체 등을 제거합니다.
 * 숫자 0과 false는 유효한 값으로 간주하여 유지합니다.
 *
 * @param params - 정제할 파라미터 객체
 * @param options - 필터링 옵션 설정 (기본값: 모든 옵션이 true)
 * @param options.removeUndefined - undefined 값을 제거할지 여부 (기본값: true)
 * @param options.removeNull - null 값을 제거할지 여부 (기본값: true)
 * @param options.removeEmptyString - 빈 문자열을 제거할지 여부 (기본값: true)
 * @param options.removeEmptyArray - 빈 배열을 제거할지 여부 (기본값: true)
 * @param options.removeEmptyObject - 빈 객체를 제거할지 여부 (기본값: true)
 * @returns 정제된 파라미터 객체
 *
 * @example
 * ```typescript
 * const params = {
 *   name: "John",
 *   email: "",
 *   age: 30,
 *   tags: [],
 *   active: false
 * };
 *
 * const filtered = filterParams(params);
 * // 결과: { name: "John", age: 30, active: false }
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

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => !shouldRemove(value))
  );
};
