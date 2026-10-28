import { useEffect, useRef, useState } from "react";
import type { ElementRefObject } from "../types";

export default function useDetectClose() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref: ElementRefObject<HTMLDivElement> = useRef<HTMLDivElement | null>(
    null
  );

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    };

    if (isOpen) document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return { isOpen, setIsOpen, ref };
}
