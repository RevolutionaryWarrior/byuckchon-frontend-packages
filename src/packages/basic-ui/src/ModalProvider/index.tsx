import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
  modal: React.ReactNode | null;
  onClose?: () => void;
};

export function ModalProvider({ children, modal, onClose }: Props) {
  return (
    <>
      {children}
      {modal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-10">{modal}</div>
          </div>,
          document.body
        )}
    </>
  );
}
