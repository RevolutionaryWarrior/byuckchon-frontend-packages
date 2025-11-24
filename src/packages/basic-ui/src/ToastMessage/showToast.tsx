import { toast, type ToastContentProps } from "react-toastify";
import type { ToastMessageProps } from ".";
import { ToastUI } from "./ToastUI";

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
 *   valriant: 'default' | 'error' | 'success' | 'warning',
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
    variant,
  } = options;

  // showToast 함수가 일반함수라 theme 훅을 가져오면 경고가 나오는데 이를 해결하기 위해 ToastContent 함수를 생성
  function ToastContent(props: ToastContentProps) {
    return (
      <ToastUI
        {...props}
        message={message}
        textAlign={textAlign}
        isCloseButton={isCloseButton}
        Icon={Icon}
        iconPosition={iconPosition}
        variant={variant}
      />
    );
  }

  // 기본 className 설정 (react-toastify 컨테이너용)
  const defaultClassName = `!p-0 !w-[335px] !rounded-none !min-h-[44px]`;

  return toast(ToastContent, {
    closeButton: false,
    className: defaultClassName,
  });
}
