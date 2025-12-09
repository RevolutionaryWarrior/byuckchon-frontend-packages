import { useContext } from "react";
import { OverlayContext } from "./OverlayContext";

export function useOverlay() {
  const ctx = useContext(OverlayContext);

  if (!ctx) {
    throw new Error(
      "useOverlay는 반드시 OverlayRoot 내부에서 사용해야 합니다."
    );
  }

  return ctx;
}
