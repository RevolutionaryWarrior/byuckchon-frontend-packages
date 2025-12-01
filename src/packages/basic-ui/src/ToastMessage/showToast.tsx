import { toast, type ToastContentProps } from "react-toastify";
import type { ToastOptions } from ".";
import { ToastUI } from "./ToastUI";

/**
 * Toast 메시지를 표시하는 함수
 * @param message - Toast에 표시할 메시지
 * @param options - Toast 옵션 (선택사항)
 * @returns Toast ID
 * @example
 * showToast('저장되었습니다.', {
 *   textAlign: 'left',
 *   isCloseButton: true,
 *   Icon: <Icon />,
 *   iconPosition: 'center',
 *   variant: 'default' | 'error' | 'success' | 'warning',
 *   autoClose: 3000, // 3초 후 자동 닫기, false면 자동 닫기 안 함
 *   position: 'bottom-center', // 토스트 표시 위치
 * });
 */
export function showToast(
  message: string,
  options?: ToastOptions
): ReturnType<typeof toast> {
  const {
    textAlign = "left",
    isCloseButton = true,
    Icon,
    iconPosition = "center",
    variant,
    autoClose = false,
    position = "top-center",
  } = options ?? {};

  function ToastContent({ closeToast }: ToastContentProps) {
    return (
      <ToastUI
        closeToast={closeToast}
        message={message}
        textAlign={textAlign}
        isCloseButton={isCloseButton}
        Icon={Icon}
        iconPosition={iconPosition}
        variant={variant}
      />
    );
  }

  const defaultClassName = `!p-0 !w-[335px] !rounded-none !min-h-[44px]`;

  return toast(ToastContent, {
    closeButton: false,
    className: defaultClassName,
    autoClose: autoClose,
    position: position,
  });
}
