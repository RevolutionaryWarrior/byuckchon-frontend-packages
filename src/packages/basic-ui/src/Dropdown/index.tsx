import React, { useEffect, useMemo, useRef, useState } from "react";
import ChevronDownIcon from "@icons/icon_byuckicon_chevron_down.svg?react";
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
  Icon?: React.ReactNode;
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
  Icon?: React.ReactNode;
  triggerClassName?: string;
  optionWrapperClassName?: string;
  optionClassName?: string;
  onChange: (option: DropdownOptionType) => void;
  renderTrigger?: (props: TriggerProps) => React.ReactNode;
  renderOption?: (option: DropdownOptionType) => React.ReactNode;
};

export default function Dropdown({
  options = [],
  selectedOption,
  placeholder = "선택하세요",
  disabled = false,
  Icon,
  triggerClassName,
  optionWrapperClassName,
  optionClassName,
  onChange,
  renderTrigger,
  renderOption,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    };

    if (isOpen) document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const selectOption = (option: DropdownOptionType) => {
    if (option.disabled) return;
    onChange?.(option);
  };

  const handleOptionClick = (option: DropdownOptionType) => {
    selectOption(option);
    setIsOpen(false);
  };

  const triggerProps: TriggerProps = useMemo(
    () => ({
      isOpen,
      selectedOption,
      placeholder,
      disabled,
      Icon,
    }),
    [isOpen, selectedOption, placeholder, disabled, Icon]
  );

  return (
    <div ref={ref} className="relative inline-block w-full">
      {renderTrigger ? (
        renderTrigger(triggerProps)
      ) : (
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={selectedOption?.label || placeholder}
          className={twMerge(
            "cursor-pointer w-full text-left border border-[#CCCCCC] flex items-center justify-between h-[52px] text-base px-3",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200",
            disabled && "bg-gray-100 text-gray-400 cursor-not-allowed",
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
            {Icon ? Icon : <ChevronDownIcon />}
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
                  "cursor-pointer border-b border-[#CCCCCC] h-[52px] text-base flex items-center px-3 hover:bg-gray-50 transition-colors duration-150",
                  selectedOption?.value === option.value &&
                    "bg-blue-500 text-white hover:bg-blue-600",
                  option.disabled &&
                    "opacity-50 cursor-not-allowed hover:bg-transparent",
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
