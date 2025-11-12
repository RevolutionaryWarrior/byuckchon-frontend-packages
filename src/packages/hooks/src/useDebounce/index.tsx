import { useCallback, useRef, useState } from "react";

/**
 * 함수 호출을 지연시키는 디바운스 훅입니다.
 * 첫 번째 호출은 300ms 후 실행되고, 이후 호출들은 지정된 지연 시간(delay) 동안 연속된 호출을 취소하고 마지막 호출만 실행합니다.
 *
 * @template T - 디바운스할 함수의 타입
 * @param {T} callback - 디바운스할 함수
 * @param {number} delay - 첫 호출 이후의 지연 시간(밀리초, 기본값: 500)
 * @returns {T} 디바운스된 함수. 원본 함수와 동일한 시그니처를 가집니다.
 *
 * @example
 * ```tsx
 * const handleSearch = (value: string) => {
 *   console.log("Searching for:", value);
 * };
 *
 * const debouncedSearch = useDebounce(handleSearch, 500);
 *
 * // 빠르게 여러 번 호출해도 마지막 호출만 500ms 후 실행됩니다
 * debouncedSearch("test");
 * debouncedSearch("test2");
 * debouncedSearch("test3"); // 이것만 실행됨
 * ```
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay?: number
): T => {
  const schedule = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isFirstCall, setIsFirstCall] = useState<boolean>(true);

  const FIRST_DELAY = 300;
  const DELAY = delay ?? 10000;
  const CURRENT_DELAY = isFirstCall ? FIRST_DELAY : DELAY;

  return useCallback(
    ((...args: Parameters<T>) => {
      if (schedule.current !== null) clearTimeout(schedule.current);

      schedule.current = setTimeout(() => {
        callback(...args);
        if (isFirstCall) setIsFirstCall(false);
      }, CURRENT_DELAY);
    }) as T,
    [callback, CURRENT_DELAY, isFirstCall]
  );
};

export default useDebounce;
