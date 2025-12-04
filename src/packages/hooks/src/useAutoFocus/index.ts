import { useEffect, useRef } from "react";

export default function useAutoFocus(trigger: boolean) {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (trigger && ref.current) {
      ref.current.focus();
    }
  }, [trigger]);

  return ref;
}
