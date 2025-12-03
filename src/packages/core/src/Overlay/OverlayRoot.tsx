import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { OverlayContext, type OverlayNode } from "./OverlayContext";

/* eslint-disable @typescript-eslint/no-explicit-any */
type OverlayState = {
  node: OverlayNode | null;
  resolve?: (value: any) => void;
  isOpen: boolean;
  closeValue: any;
};

export default function OverlayRoot({
  children,
  overlayBgClassName = "bg-black/40",
}: {
  children: React.ReactNode;
  overlayBgClassName?: string;
}) {
  const [state, setState] = useState<OverlayState>({
    node: null,
    resolve: undefined,
    isOpen: false,
    closeValue: null,
  });

  function open(node: OverlayNode) {
    return new Promise((resolve) => {
      setState({
        node,
        resolve,
        isOpen: true,
        closeValue: null,
      });
    });
  }

  function requestClose(value?: any) {
    setState((prev) => ({
      ...prev,
      isOpen: false,
      closeValue: value,
    }));
  }

  function finishClose() {
    setState((prev) => {
      prev.resolve?.(prev.closeValue);

      return {
        node: null,
        resolve: undefined,
        isOpen: false,
        closeValue: null,
      };
    });
  }

  function close(value?: any) {
    requestClose(value);
    finishClose();
  }

  const value = {
    open,
    close,
    requestClose,
    finishClose,
  };

  return (
    <OverlayContext.Provider value={value}>
      {children}

      {state.node && (
        <div
          className={twMerge(
            "fixed inset-0 z-[9999] flex items-center justify-center",
            overlayBgClassName
          )}
        >
          {typeof state.node === "function"
            ? state.node({ isOpen: state.isOpen })
            : state.node}
        </div>
      )}
    </OverlayContext.Provider>
  );
}
