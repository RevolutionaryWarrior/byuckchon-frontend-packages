import { createContext } from "react";

export type OverlayRenderFn = (props: { isOpen: boolean }) => React.ReactNode;
export type OverlayNode = React.ReactNode | OverlayRenderFn;

export type OverlayContextValue = {
  open: (node: OverlayNode) => Promise<any>;
  close: (value?: any) => void;
  requestClose: (value?: any) => void;
  finishClose: () => void;
};

export const OverlayContext = createContext<OverlayContextValue | null>(null);
