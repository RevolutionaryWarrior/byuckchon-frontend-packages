import type { DropdownOptionType } from "../index";
import { twMerge } from "tailwind-merge";

type Props = {
  option: DropdownOptionType;
  isSelected: boolean;
  handleOptionClick: (option: DropdownOptionType) => void;
  className?: string;
};

export function DropdownOption({
  option,
  isSelected,
  handleOptionClick,
  className,
}: Props) {
  const optionClassName = twMerge([
    option.disabled && "opacity-50",
    isSelected && "bg-blue-500 text-white",
    "cursor-pointer border-b border-[#CCCCCC] h-[52px] text-base flex items-center px-3",
    className,
  ]);

  return (
    <div
      className={optionClassName}
      onClick={() => handleOptionClick(option)}
      role="option"
      aria-selected={isSelected}
      tabIndex={-1}
    >
      <span>{option.label}</span>
    </div>
  );
}
