import { useEffect, useRef, useState } from "react";

type Props = {
  scrollThreshold?: number;
  scrollToTopOption?: ScrollToOptions;
};

const baseOption: ScrollToOptions = {
  top: 0,
  behavior: "smooth" as ScrollBehavior,
};

export default function useScrollTop({
  scrollThreshold = 200,
  scrollToTopOption,
}: Props) {
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const finalScrollOption = { ...baseOption, ...scrollToTopOption };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollY = scrollRef.current.scrollTop;
        setShowScrollTop(scrollY > scrollThreshold);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);

      return () => {
        scrollElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [scrollThreshold]);

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(finalScrollOption);
    }
  };

  return { showScrollTop, scrollRef, scrollToTop };
}
