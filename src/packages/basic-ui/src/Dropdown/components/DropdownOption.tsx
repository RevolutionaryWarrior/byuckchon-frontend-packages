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
  const optionClassName = twMerge(
    // 기본 스타일
    "cursor-pointer border-b border-[#CCCCCC] h-[52px] text-base flex items-center px-3 hover:bg-gray-50 transition-colors duration-150",
    // 선택된 상태
    isSelected && "bg-blue-500 text-white hover:bg-blue-600",
    // 비활성화 상태
    option.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
    // 외부에서 전달받은 클래스
    className
  );

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
