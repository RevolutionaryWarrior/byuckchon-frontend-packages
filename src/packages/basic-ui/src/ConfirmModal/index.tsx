import CloseIcon from "@icons/icon_byuckicon_close.svg?react";
import ActiveButton from "../ActiveButton";
import { useUITheme } from "../UIThemeProvider/useUITheme";

type Props = {
  title: string;
  description: string;
  cancelText: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
  Icon?: React.ReactNode;
  onClose?: () => void;
};

const baseTheme = {
  modal: "bg-white p-4",
  icon: "top-4 right-4",
  title: "text-h-2",
  description: "text-subtitle-1",
  buttonWrapper: "flex gap-4 mt-6",
};

export default function ConfirmModal({
  title,
  description,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
  Icon,
  onClose,
}: Props) {
  const theme = useUITheme();

  const mergedTheme = {
    ...baseTheme,
    ...(theme?.confirmModal ?? {}),
  };

  return (
    <article className={`${mergedTheme.modal} relative`}>
      <div className={`${mergedTheme.icon} absolute cursor-pointer`}>
        {Icon ? Icon : <CloseIcon className="size-5" onClick={onClose} />}
      </div>
      <div className="text-center">
        <p className={mergedTheme.title}>{title}</p>
        <p className={mergedTheme.description}>{description}</p>
      </div>
      <div className={mergedTheme.buttonWrapper}>
        <ActiveButton variant="secondary" className="py-4" onClick={onCancel}>
          {cancelText}
        </ActiveButton>
        <ActiveButton className="py-4" onClick={onConfirm}>
          {confirmText}
        </ActiveButton>
      </div>
    </article>
  );
}
