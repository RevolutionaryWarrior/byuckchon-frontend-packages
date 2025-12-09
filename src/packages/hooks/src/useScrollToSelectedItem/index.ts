import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";

type ScrollDirection = "horizontal" | "vertical" | "both";

interface UseScrollToSelectedItemOptions {
  direction?: ScrollDirection;
  offset?: number;
  behavior?: ScrollBehavior;
}

interface UseScrollToSelectedItemReturn<T extends HTMLElement> {
  containerRef: RefObject<HTMLDivElement | null>;
  selectedItemRef: RefObject<T | null>;
  scrollToSelected: () => void;
}

export default function useScrollToSelectedItem<T extends HTMLElement>(
  isSelected: boolean,
  options: UseScrollToSelectedItemOptions = {}
): UseScrollToSelectedItemReturn<T> {
  const {
    direction = "horizontal",
    offset = 20,
    behavior = "smooth",
  } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedItemRef = useRef<T | null>(null);

  const scrollToSelected = useCallback(() => {
    if (!containerRef.current || !selectedItemRef.current) return;

    const container = containerRef.current;
    const selectedItem = selectedItemRef.current;

    if (direction === "horizontal" || direction === "both") {
      const containerLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const itemLeft = selectedItem.offsetLeft;
      const itemWidth = selectedItem.offsetWidth;

      if (
        itemLeft < containerLeft ||
        itemLeft + itemWidth > containerLeft + containerWidth
      ) {
        container.scrollTo({
          left: Math.max(0, itemLeft - offset),
          behavior,
        });
      }
    }

    if (direction === "vertical" || direction === "both") {
      const containerTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemHeight = selectedItem.offsetHeight;

      if (
        itemTop < containerTop ||
        itemTop + itemHeight > containerTop + containerHeight
      ) {
        container.scrollTo({
          top: Math.max(0, itemTop - offset),
          behavior,
        });
      }
    }
  }, [direction, offset, behavior]);

  useEffect(() => {
    if (isSelected) {
      scrollToSelected();
    }
  }, [isSelected, scrollToSelected]);

  return {
    containerRef,
    selectedItemRef,
    scrollToSelected,
  };
}
