import { useEffect, useRef } from "react";

export default function useAutoFocus<T extends HTMLElement>(trigger: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (trigger && ref.current) {
      ref.current.focus();
    }
  }, [trigger]);

  return ref;
}
