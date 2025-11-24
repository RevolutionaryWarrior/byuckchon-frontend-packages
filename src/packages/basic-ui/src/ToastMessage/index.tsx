import { ToastContainer } from "react-toastify";
// eslint-disable-next-line react-refresh/only-export-components
export { showToast } from "./showToast";

export interface ToastContainerProps {
  autoClose?: number | false;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
}

type Variant = "default" | "error" | "success" | "warning";

export interface ToastMessageProps {
  message: string;
  textAlign?: "left" | "center" | "right";
  isCloseButton?: boolean;
  Icon?: React.ReactNode;
  iconPosition?: "start" | "center";
  variant?: Variant;
}

export default function ToastMessage({
  autoClose = false,
  position = "bottom-center",
}: ToastContainerProps) {
  return (
    <ToastContainer autoClose={autoClose} position={position} hideProgressBar />
  );
}
