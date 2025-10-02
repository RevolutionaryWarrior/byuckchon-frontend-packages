import React, { useMemo } from "react";
import ChevronDownIcon from "@icons/icon_byuckicon_chevron_down.svg?react";
import { useDetectClose } from "@byuckchon-frontend/hooks";
import { twMerge } from "tailwind-merge";

// 타입 정의
export type DropdownOptionType = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

export type TriggerProps = {
  isOpen: boolean;
  selectedOption?: DropdownOptionType;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
};

export type Props = {
  options: DropdownOptionType[];
  selectedOption?: {
    value: string | number;
    label: string;
  };
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  triggerClassName?: string;
  optionWrapperClassName?: string;
  optionClassName?: string;
  onChange?: (option: DropdownOptionType) => void;
  onClose?: () => void;
  renderTrigger?: (props: TriggerProps) => React.ReactNode;
  renderOption?: (option: DropdownOptionType) => React.ReactNode;
};

export default function Dropdown({
  options = [],
  selectedOption,
  placeholder = "선택하세요",
  disabled = false,
  icon,
  triggerClassName,
  optionWrapperClassName,
  optionClassName,
  onChange,
  renderTrigger,
  renderOption,
}: Props) {
  const { isOpen, setIsOpen, ref: dropdownRef } = useDetectClose();

  const selectOption = (option: DropdownOptionType) => {
    if (option.disabled) return;
    onChange?.(option);
  };

  // 옵션 선택 핸들러
  const handleOptionClick = (option: DropdownOptionType) => {
    selectOption(option);
    setIsOpen(false);
  };

  // 트리거 props
  const triggerProps: TriggerProps = useMemo(
    () => ({
      isOpen,
      selectedOption,
      placeholder,
      disabled,
      icon,
    }),
    [isOpen, selectedOption, placeholder, disabled, icon]
  );

  return (
    <div ref={dropdownRef} className="relative inline-block w-full">
      {renderTrigger ? (
        renderTrigger(triggerProps)
      ) : (
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={selectedOption?.label || placeholder}
          className={twMerge(
            // 기본 스타일
            "cursor-pointer w-full text-left border border-[#CCCCCC] flex items-center justify-between h-[52px] text-base px-3",
            // 포커스 상태
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200",
            // 비활성화 상태
            disabled && "bg-gray-100 text-gray-400 cursor-not-allowed",
            // 외부에서 전달받은 클래스
            triggerClassName
          )}
          onClick={() => setIsOpen((prev) => !prev)}
          disabled={disabled}
        >
          <span className="w-full text-left">
            {selectedOption && <span>{selectedOption.label}</span>}
            {!selectedOption && (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </span>
          <span
            className={twMerge(
              isOpen ? "rotate-180" : "",
              "transition-transform duration-200"
            )}
          >
            {icon ? icon : <ChevronDownIcon />}
          </span>
        </button>
      )}

      {options.length > 0 && isOpen && (
        <div
          className={twMerge(
            "absolute z-50 w-full border border-[#CCCCCC] shadow-lg max-h-[260px] overflow-y-auto text-base",
            optionWrapperClassName
          )}
          role="listbox"
          aria-label="옵션 목록"
        >
          {options.map((option, index) => {
            if (renderOption) {
              return renderOption(option);
            }

            return (
              <div
                key={`${option.label}-${option.value}-${index}`}
                className={twMerge(
                  // 기본 스타일
                  "cursor-pointer border-b border-[#CCCCCC] h-[52px] text-base flex items-center px-3 hover:bg-gray-50 transition-colors duration-150",
                  // 선택된 상태
                  selectedOption?.value === option.value &&
                    "bg-blue-500 text-white hover:bg-blue-600",
                  // 비활성화 상태
                  option.disabled &&
                    "opacity-50 cursor-not-allowed hover:bg-transparent",
                  // 외부에서 전달받은 클래스
                  optionClassName
                )}
                onClick={() => handleOptionClick(option)}
                role="option"
                aria-selected={selectedOption?.value === option.value}
                tabIndex={-1}
              >
                <span>{option.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
