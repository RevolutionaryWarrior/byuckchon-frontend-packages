import CloseIcon from "@icons/icon_byuckicon_close.svg?react";
import ActiveButton from "../ActiveButton";
import { useUITheme } from "../UIThemeProvider/useUITheme";

type Props = {
  title: string;
  description: string;
  confirmText: string;
  onClickConfirm: () => void;
  Icon?: React.ReactNode;
  isScrollable?: boolean;
  customScrollClassName?: string;
};

const baseTheme = {
  modal: "bg-white p-4",
  icon: "top-4 right-4",
  title: "text-h-2",
  description: "text-subtitle-1",
  buttonWrapper: "flex gap-4 mt-6",
};

export default function AlertModal({
  title,
  description,
  confirmText,
  onClickConfirm,
  Icon,
  isScrollable = false,
  customScrollClassName = "",
}: Props) {
  const theme = useUITheme();

  const mergedTheme = {
    ...baseTheme,
    ...(theme?.alertModal ?? {}),
  };

  return (
    <article className={`${mergedTheme.modal} relative`}>
      <div className={`${mergedTheme.icon} absolute cursor-pointer`}>
        {Icon ? Icon : <CloseIcon className="size-5" />}
      </div>
      <div className="text-center">
        <p className={mergedTheme.title}>{title}</p>
        <p
          className={`${
            isScrollable ? "max-h-[220px] overflow-y-auto" : ""
          } ${customScrollClassName} ${mergedTheme.description}`}
        >
          {description}
        </p>
      </div>
      <div className={mergedTheme.buttonWrapper}>
        <ActiveButton className="py-4" onClick={onClickConfirm}>
          {confirmText}
        </ActiveButton>
      </div>
    </article>
  );
}
