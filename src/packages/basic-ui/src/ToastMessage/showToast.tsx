import { toast, type ToastContentProps } from "react-toastify";
import CloseIcon from "@icons/icon_byuckicon_close_white.svg?react";
import type { ToastMessageProps } from ".";

/**
 * Toast 메시지를 표시하는 함수
 * @param options - Toast 메시지 옵션
 * @returns Toast ID
 * @example
 * showToast({
 *   message: '저장되었습니다.',
 *   textAlign: 'left',
 *   isCloseButton: true,
 *   Icon: <Icon />
 *   iconPosition: 'center',
 * });
 */

export function showToast(
  options: ToastMessageProps
): ReturnType<typeof toast> {
  const {
    message,
    textAlign = "left",
    isCloseButton = true,
    Icon,
    iconPosition = "center",
  } = options;

  function ToastUI({ closeToast }: ToastContentProps) {
    return (
      <div className="w-full px-[16px] py-[12px]">
        <div
          className={`flex gap-[12px] items-${iconPosition} text-white text-[16px] font-medium text-${textAlign}`}
        >
          {Icon && <div className="size-5">{Icon}</div>}
          <span className="flex-1 leading-[20px] pt-[5px] break-keep">
            {message}
          </span>
          {isCloseButton && (
            <button onClick={closeToast}>
              <CloseIcon className="size-5 fill-white" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return toast(ToastUI, {
    closeButton: false,
    className: "!p-0 !w-[335px] !bg-[#00000099] !rounded-none !min-h-[44px]",
  });
}
