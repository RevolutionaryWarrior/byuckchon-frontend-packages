import CloseIcon from "@icons/icon_byuckicon_close.svg?react";
import ActiveButton from "../ActiveButton";
import { useUITheme } from "../UIThemeProvider/useUITheme";

type Props = {
  title: string;
  description: string;
  firstOptionText: string;
  secondOptionText: string;
  onClickFirstOption: () => void;
  onClickSecondOption: () => void;
  Icon?: React.ReactNode;
};

const baseTheme = {
  modal: "bg-white p-4",
  icon: "top-4 right-4",
  title: "text-h-2",
  description: "text-subtitle-1",
  buttonWrapper: "flex gap-4 mt-6",
};

export default function ChoiceModal({
  title,
  description,
  firstOptionText,
  secondOptionText,
  onClickFirstOption,
  onClickSecondOption,
  Icon,
}: Props) {
  const theme = useUITheme();

  const mergedTheme = {
    ...baseTheme,
    ...(theme?.choiceModal ?? {}),
  };

  return (
    <article className={`${mergedTheme.modal} relative`}>
      <div className={`${mergedTheme.icon} absolute cursor-pointer`}>
        {Icon ? Icon : <CloseIcon className="size-5" />}
      </div>
      <div className="text-center">
        <p className={mergedTheme.title}>{title}</p>
        <p className={mergedTheme.description}>{description}</p>
      </div>
      <div className={mergedTheme.buttonWrapper}>
        <ActiveButton className="py-4" onClick={onClickFirstOption}>
          {firstOptionText}
        </ActiveButton>
        <ActiveButton className="py-4" onClick={onClickSecondOption}>
          {secondOptionText}
        </ActiveButton>
      </div>
    </article>
  );
}
