import { Drawer } from "vaul";
import CloseIcon from "@icons/icon_byuckicon_close.svg?react";
import ArrowLeftIcon from "@icons/icon_byuckicon_chevron_left.svg?react";
import ActiveButton from "../ActiveButton";

type BottomSheetProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  onBack?: () => void;
  showClose?: boolean;
  extraText?: string;
  onExtraClick?: () => void;
  titleAlign?: "center" | "left";
  radiusClassName?: string;
};

export default function BottomSheet({
  isOpen,
  title,
  onClose,
  onCancel,
  onConfirm,
  cancelText = "취소",
  confirmText = "확인",
  children,
  onBack,
  showClose = true,
  extraText,
  onExtraClick,
  titleAlign = "center",
  radiusClassName = "",
}: BottomSheetProps) {
  const titleClass =
    titleAlign === "left"
      ? "text-h-2 text-left w-full pl-5"
      : "text-h-2 text-center";

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content
          className={`px-4 py-3 fixed bottom-0 left-0 right-0 z-50 w-full bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out max-h-[45vh] ${radiusClassName}`}
        >
          {/* 상단 회색 띠 */}
          <div className="mx-auto mb-2 h-1 w-9 rounded-full bg-[#C4C4C7] cursor-pointer active:cursor-grabbing" />

          {/* 헤더 */}
          <div className="relative flex items-center justify-center px-5 mt-1">
            {onBack && (
              <button
                onClick={onBack}
                className="absolute left-4 top-1/2 -translate-y-1/2"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
              </button>
            )}

            <Drawer.Title className={titleClass}>{title}</Drawer.Title>

            {showClose && (
              <button
                onClick={onClose}
                className="absolute right-0 top-1/2 -translate-y-1/2"
              >
                <CloseIcon className="h-5 w-5 text-gray-600" />
              </button>
            )}
          </div>

          {/* 내용 */}
          <div className="flex flex-col">
            <div className="flex-1 overflow-y-auto py-3 max-h-[140px]">
              {children}
            </div>

            {/* 버튼 영역 */}
            {(onCancel || onConfirm) && (
              <div className="flex gap-4 pt-3">
                {onCancel && (
                  <ActiveButton
                    onClick={onCancel}
                    variant="secondary"
                    className="flex-1"
                  >
                    {cancelText}
                  </ActiveButton>
                )}
                {onConfirm && (
                  <ActiveButton
                    onClick={onConfirm}
                    variant="primary"
                    className="flex-1"
                  >
                    {confirmText}
                  </ActiveButton>
                )}
              </div>
            )}

            {/* 추가 텍스트 버튼 */}
            {extraText && (
              <div className="mt-3 text-center">
                <button
                  onClick={onExtraClick}
                  className="text-[#8F9098] text-caption underline underline-offset-2 cursor-pointer"
                >
                  {extraText}
                </button>
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
