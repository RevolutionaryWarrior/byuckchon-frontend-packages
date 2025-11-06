import { type ToastContentProps } from "react-toastify";
import CloseIcon from "@icons/icon_byuckicon_close_white.svg?react";
import { useUITheme } from "../UIThemeProvider/useUITheme";

const baseToastMessageVariants = {
  default: {
    bg: "bg-[#00000099] rounded-none min-h-[44px]",
    text: "text-white",
  },
  error: {
    bg: "bg-[#FF000099] rounded-none min-h-[44px]",
    text: "text-white",
  },
  success: {
    bg: "bg-[#10B98199] rounded-none min-h-[44px]",
    text: "text-white",
  },
  warning: {
    bg: "bg-[#F59E0B99] rounded-none min-h-[44px]",
    text: "text-white",
  },
};

interface ToastUIProps extends ToastContentProps {
  message: string;
  textAlign?: "left" | "center" | "right";
  isCloseButton?: boolean;
  Icon?: React.ReactNode;
  iconPosition?: "start" | "center";
  variant?: "default" | "error" | "success" | "warning";
}

export function ToastUI({
  closeToast,
  message,
  textAlign = "left",
  isCloseButton = true,
  Icon,
  iconPosition = "center",
  variant = "default",
}: ToastUIProps) {
  const theme = useUITheme();

  const variantKey = variant;
  const mergedStyle = {
    ...baseToastMessageVariants[variantKey],
    ...(theme?.toastMessageTheme?.[variantKey] ?? {}),
  };

  const textAlignClass =
    textAlign === "center"
      ? "text-center"
      : textAlign === "right"
      ? "text-right"
      : "text-left";

  const iconPositionClass =
    iconPosition === "start" ? "items-start" : "items-center";

  return (
    <div className={`w-full px-[16px] py-[12px] ${mergedStyle.bg}`}>
      <div
        className={`flex gap-[12px] ${iconPositionClass} ${mergedStyle.text} text-[16px] font-medium`}
      >
        {Icon && <div className="size-5">{Icon}</div>}
        <span
          className={`flex-1 leading-[20px] pt-[5px] break-keep ${textAlignClass}`}
        >
          {message}
        </span>
        {isCloseButton && (
          <button onClick={closeToast} className="size-5 cursor-pointer">
            <CloseIcon className="fill-white" />
          </button>
        )}
      </div>
    </div>
  );
}
