import { useCallback, useRef, useState } from "react";

type Props = {
  onRefresh: () => Promise<void>;
  threshold?: number;
  refreshingDistance?: number;
};

export default function usePullToRefresh({
  onRefresh,
  threshold = 80,
  refreshingDistance = 60,
}: Props) {
  const [pullDistance, setPullDistance] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop === 0 && !isRefreshing) {
        const touchY = e.touches[0].clientY;
        const distance = touchY - touchStartY.current;

        if (distance > 0) {
          const dampedDistance = Math.min(distance * 0.5, threshold * 1.5);
          setPullDistance(dampedDistance);

          if (dampedDistance >= threshold && window.navigator.vibrate) {
            window.navigator.vibrate(1000);
          }
        }
      }
    },
    [isRefreshing, threshold]
  );

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(refreshingDistance);

      try {
        await onRefresh();
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 500);
      }
    } else {
      setPullDistance(0);
    }
    touchStartY.current = 0;
  }, [pullDistance, threshold, isRefreshing, onRefresh, refreshingDistance]);

  return {
    pullDistance,
    isRefreshing,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
