import { useCallback, useMemo, useState } from "react";
import { OverlayContext, type OverlayNode } from "./OverlayContext";

type OverlayState = {
  node: OverlayNode | null;
  resolve?: (value: any) => void;
  isOpen: boolean;
  closeValue: any;
};

export default function OverlayRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<OverlayState>({
    node: null,
    resolve: undefined,
    isOpen: false,
    closeValue: null,
  });

  const open = useCallback((node: OverlayNode) => {
    return new Promise((resolve) => {
      setState({
        node,
        resolve,
        isOpen: true,
        closeValue: null,
      });
    });
  }, []);

  const requestClose = useCallback((value?: any) => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
      closeValue: value,
    }));
  }, []);

  const finishClose = useCallback(() => {
    setState((prev) => {
      prev.resolve?.(prev.closeValue);
      return {
        node: null,
        resolve: undefined,
        isOpen: false,
        closeValue: null,
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      open,
      requestClose,
      finishClose,
    }),
    [open, requestClose, finishClose]
  );

  return (
    <OverlayContext.Provider value={value}>
      {children}

      {state.node && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
          {typeof state.node === "function"
            ? state.node({ isOpen: state.isOpen })
            : state.node}
        </div>
      )}
    </OverlayContext.Provider>
  );
}
