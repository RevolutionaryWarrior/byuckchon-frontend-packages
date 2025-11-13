import { useCallback, useRef } from "react";

/**
 * 함수 호출을 제한하는 스로틀 훅입니다.
 * 지정된 지연 시간(delay) 동안 함수가 호출되면 첫 번째 호출만 실행하고, 이후 호출은 무시합니다.
 * delay 시간이 지나면 다시 함수 호출이 가능해집니다.
 *
 * @template T - 스로틀할 함수의 타입
 * @param {T} callback - 스로틀할 함수
 * @param {number} delay - 제한 시간(밀리초)
 * @returns {T} 스로틀된 함수. 원본 함수와 동일한 시그니처를 가집니다.
 *
 * @example
 * ```tsx
 * const handleScroll = (event: Event) => {
 *   console.log("Scrolled:", event);
 * };
 *
 * const throttledScroll = useThrottle(handleScroll, 300);
 *
 * // 300ms 이내에 여러 번 호출해도 첫 번째 호출만 실행됩니다
 * window.addEventListener("scroll", throttledScroll);
 * ```
 *
 * @example
 * ```tsx
 * const handleSearch = (value: string) => {
 *   console.log("Searching for:", value);
 * };
 *
 * const throttledSearch = useThrottle(handleSearch, 1000);
 *
 * throttledSearch("test"); // 실행됨
 * throttledSearch("test2"); // 무시됨
 * throttledSearch("test3"); // 무시됨
 * // 1초 후
 * throttledSearch("test4"); // 실행됨
 * ```
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay?: number
): T => {
  const isWaiting = useRef(false);
  const DELAY = delay ? delay : 500;

  return useCallback(
    ((...args: Parameters<T>) => {
      if (!isWaiting.current) {
        callback(...args);
        isWaiting.current = true;
        setTimeout(() => {
          isWaiting.current = false;
        }, DELAY);
      }
    }) as T,
    [callback, DELAY]
  );
};

export default useThrottle;
