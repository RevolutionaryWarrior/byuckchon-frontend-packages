/**
 * useImpressionRef
 *
 * 요소가 일정 비율 이상 화면에 노출되고 일정 시간 유지되면
 * `onImpressionStart` / `onImpressionEnd` 콜백을 발생시키는 Hook.
 *
 * - IntersectionObserver 기반 노출 감지
 * - 문서 가시성 변화(탭 전환/백그라운드) 대응
 * - debounce 로 노출 확정 처리
 *
 * @template Element 감지 대상 DOM 타입 (기본: HTMLElement)
 *
 * @param {Object} options 설정 객체
 * @param {() => void} [options.onImpressionStart] 노출 확정 시 호출
 * @param {() => void} [options.onImpressionEnd] 노출 종료 시 호출
 * @param {HTMLElement | null} [options.root] 관찰 기준 영역
 * @param {string} [options.rootMargin="0px"]
 * @param {number} [options.areaThreshold=0.5] 노출 비율 threshold (0~1)
 * @param {number} [options.timeThreshold=300] 유지 시간 threshold(ms)
 *
 * @returns {{ ref: React.RefObject<Element> }} 감지 대상 ref
 */


import { useCallback, useEffect, useRef } from "react";
import useVisibilityEvent from "../useVisibilityEvent";

type Options = {
  onImpressionStart?: () => void; // 노출 시작 콜백
  onImpressionEnd?: () => void; // 노출 종료 콜백
  root?: HTMLElement | null;
  rootMargin?: string; // 미리 감지 or 더 들어왔을 때 감지
  areaThreshold?: number; // 0~1
  timeThreshold?: number; // ms
};

export default function useImpressionRef<Element extends HTMLElement>({
  onImpressionStart = () => {},
  onImpressionEnd = () => {},
  root = null,
  rootMargin = "0px",
  areaThreshold = 0.5,
  timeThreshold = 300,
}: Options) {
  const ref = useRef<Element | null>(null);

  const startCallbackRef = useRef<() => void>(onImpressionStart);
  const endCallbackRef = useRef<() => void>(onImpressionEnd);

  useEffect(() => {
    startCallbackRef.current = onImpressionStart;
  }, [onImpressionStart]);

  useEffect(() => {
    endCallbackRef.current = onImpressionEnd;
  }, [onImpressionEnd]);

  // 물리적으로 들어왔는지 여부
  const isIntersectingRef = useRef<boolean>(false);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  // 노출됨으로 확정할건지 여부
  const impressedValueRef = useRef<boolean>(false);

  const setDebouncedIsImpressed = useCallback(
    (newValue: boolean) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      if (newValue === impressedValueRef.current) return;

      debounceTimer.current = setTimeout(() => {
        impressedValueRef.current = newValue;
        if (newValue) startCallbackRef.current();
        else endCallbackRef.current();
      }, timeThreshold);
    },
    [timeThreshold]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        // intersectionRatio : 0~1
        // isIntersecting : 일부라도 들어왔는지 여부 (true/false)
        const isVisible =
          entry.isIntersecting && entry.intersectionRatio >= areaThreshold;

        isIntersectingRef.current = isVisible;

        if (document.visibilityState === "hidden") return;

        setDebouncedIsImpressed(isVisible);
      },
      {
        root,
        rootMargin,
        threshold: areaThreshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [root, rootMargin, areaThreshold, setDebouncedIsImpressed]);

  useVisibilityEvent((state) => {
    if (!isIntersectingRef.current) return;

    const visible = state === "visible";
    setDebouncedIsImpressed(visible);
  });

  return { ref };
}
