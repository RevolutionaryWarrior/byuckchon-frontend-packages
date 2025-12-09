import { ToastContainer } from "react-toastify";
// eslint-disable-next-line react-refresh/only-export-components
export { showToast } from "./showToast";

type Variant = "default" | "error" | "success" | "warning";

export interface ToastOptions {
  textAlign?: "left" | "center" | "right";
  isCloseButton?: boolean;
  Icon?: React.ReactNode;
  iconPosition?: "start" | "center";
  variant?: Variant;
  autoClose?: number | false;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
}

export default function ToastMessageContainer() {
  return <ToastContainer hideProgressBar />;
}
