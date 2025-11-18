import { useCallback, useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../useIntersectionObserver";

interface UseInfiniteScrollOptions {
  onLoadMore: () => void | Promise<void>;
  enabled?: boolean;
  hasMore?: boolean;
  threshold?: number | number[];
  root?: Element | Document | null;
  rootMargin?: string;
}

interface UseInfiniteScrollReturn {
  ref: (node?: Element | null) => void;
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void | Promise<void>;
}

/**
 * Intersection Observer를 사용하여 무한 스크롤을 구현하는 React 훅
 *
 * 요소가 뷰포트에 들어올 때 자동으로 `onLoadMore`를 호출하여 더 많은 데이터를 로드합니다.
 * `isIntersecting`이 false에서 true로 변경될 때만 로드하여 중복 호출을 방지합니다.
 *
 * @param options - 무한 스크롤 옵션
 * @param options.onLoadMore - 더 많은 데이터를 로드하는 비동기 함수 (필수)
 * @param options.enabled - 무한 스크롤 활성화 여부 (기본값: true)
 * @param options.hasMore - 더 불러올 데이터가 있는지 여부 (기본값: false)
 * @param options.threshold - 교차 비율의 임계값 (기본값: 1)
 * @param options.root - 교차 영역을 계산할 때 사용하는 루트 요소 (기본값: null, 뷰포트 사용)
 * @param options.rootMargin - 루트 요소의 경계를 확장/축소하는 마진 (기본값: "0px")
 *
 * @returns 무한 스크롤 관련 상태와 함수를 포함한 객체
 * @returns ref - 리스트의 끝에 연결할 ref 함수
 * @returns isLoading - 현재 데이터 로딩 중인지 여부
 * @returns hasMore - 더 불러올 데이터가 있는지 여부
 * @returns loadMore - 수동으로 더 많은 데이터를 로드하는 함수
 **/

function useInfiniteScroll({
  onLoadMore,
  enabled = true,
  hasMore = false,
  threshold = 1,
  root = null,
  rootMargin = "0px",
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const onceCheck = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      await onLoadMore();
    } finally {
      setIsLoading(false);
    }
  }, [onLoadMore, hasMore, isLoading]);

  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    root,
    rootMargin,
    freezeOnceVisible: false,
  });

  useEffect(() => {
    const isChanged = !onceCheck.current && isIntersecting;

    if (isChanged && hasMore && !isLoading && enabled) {
      handleLoadMore();
    }

    onceCheck.current = isIntersecting;
  }, [isIntersecting, hasMore, isLoading, enabled, handleLoadMore]);

  return {
    ref,
    isLoading,
    hasMore,
    loadMore: handleLoadMore,
  };
}

export default useInfiniteScroll;
