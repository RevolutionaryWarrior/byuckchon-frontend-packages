import { useEffect, useRef } from "react";
import type { ElementRefObject } from "../types";

export default function useAutoFocus<T extends HTMLElement>(
  trigger: boolean
): ElementRefObject<T> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (trigger && ref.current) {
      ref.current.focus();
    }
  }, [trigger]);

  return ref;
}
