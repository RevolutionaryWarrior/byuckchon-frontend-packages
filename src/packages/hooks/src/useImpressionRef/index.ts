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
