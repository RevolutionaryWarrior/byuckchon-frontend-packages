import { useEffect, useState } from "react";

type State = {
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

type UseIntersectionObserverOptions = {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
  initialIsIntersecting?: boolean;
};

type IntersectionReturn = [(node?: Element | null) => void, boolean] & {
  ref: (node?: Element | null) => void;
  isIntersecting: boolean;
};

/**
 * Intersection Observer API를 사용하여 요소의 뷰포트 교차 상태를 감지하는 React 훅
 *
 * @param options - Intersection Observer 옵션
 * @param options.root - 교차 영역을 계산할 때 사용하는 루트 요소 (기본값: null, 뷰포트 사용)
 * @param options.rootMargin - 루트 요소의 경계를 확장/축소하는 마진 (기본값: "0%")
 * @param options.threshold - 교차 비율의 임계값 (기본값: 0.5)
 * @param options.freezeOnceVisible - 한 번 보이면 더 이상 관찰하지 않음 (기본값: false)
 * @param options.initialIsIntersecting - 초기 교차 상태 (기본값: false)
 *
 * @returns 교차 상태와 ref 함수를 포함한 객체 또는 배열
 * @returns ref - 요소에 연결할 ref 함수
 * @returns isIntersecting - 현재 교차 상태 (boolean)
 **/

const useIntersectionObserver = ({
  threshold = 0.5, // 기본 threshold는 0.5 (절반)
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false,
  initialIsIntersecting = false,
}: UseIntersectionObserverOptions = {}): IntersectionReturn => {
  const [ref, setRef] = useState<Element | null>(null);
  const [state, setState] = useState<State>(() => ({
    isIntersecting: initialIsIntersecting,
  }));

  const frozen = state.entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    // ref가 있는지 확인
    if (!ref) return;

    // 브라우저가 Intersection Observer를 허용하는지 확인
    if (!("IntersectionObserver" in window)) return;

    // 1) 이미 intersecting 상태이거나
    // 2) 한 번 Observe 했으면 재관찰 방지
    if (frozen) return;

    let unobserve: (() => void) | undefined;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        const thresholds = Array.isArray(observer.thresholds)
          ? observer.thresholds
          : [observer.thresholds];

        entries.forEach((entry) => {
          const isIntersecting =
            entry.isIntersecting &&
            thresholds.some(
              (threshold) => entry.intersectionRatio >= threshold
            );

          setState({ isIntersecting, entry });

          // 현재 요소가 화면에 보이고 한 번만 관찰하도록 설정되어 있으면 관찰 중지
          if (isIntersecting && freezeOnceVisible && unobserve) {
            unobserve();
            unobserve = undefined;
          }
        });
      },
      { threshold, root, rootMargin }
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ref,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(threshold),
    root,
    rootMargin,
    frozen,
    freezeOnceVisible,
  ]);

  const result = [setRef, !!state.isIntersecting] as IntersectionReturn;

  result.ref = result[0];
  result.isIntersecting = result[1];

  return result;
};

export default useIntersectionObserver;
