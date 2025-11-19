import { useEffect, useRef } from "react";

type VisibilityState = Document["visibilityState"];

export default function useVisibilityEvent(
  callback: (visibility: VisibilityState) => void
) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = () => {
      callbackRef.current(document.visibilityState);
    };

    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);
}
