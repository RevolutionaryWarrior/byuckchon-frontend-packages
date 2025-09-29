import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DropdownTrigger } from "./components/DropdownTrigger";
import { DropdownOption } from "./components/DropdownOption";
import { useDetectClose } from "@byuckchon-frontend/hooks";
import { twMerge } from "tailwind-merge";

// 타입 정의
export interface DropdownOptionType {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export type TriggerProps = {
  isOpen: boolean;
  selectedOption?: DropdownOptionType;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export type DropdownProps = {
  options: DropdownOptionType[];
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
  icon?: React.ReactNode;
  onChange?: (value: string | number, option: DropdownOptionType) => void;
  onClose?: () => void;
  renderTrigger?: (props: TriggerProps) => React.ReactNode;
  renderOption?: (option: DropdownOptionType) => React.ReactNode;
};

const baseDropdownSizes = {
  small: {
    dropdown: "text-sm",
  },
  medium: {
    dropdown: "text-base",
  },
  large: {
    dropdown: "text-lg",
  },
};

export default function Dropdown({
  options = [],
  value,
  placeholder = "선택하세요",
  disabled = false,
  size = "medium",
  icon,
  onChange,
  renderTrigger,
  renderOption,
}: DropdownProps) {
  const { isOpen, setIsOpen, ref: dropdownRef } = useDetectClose();
  // useDropdownState 로직을 직접 구현
  const [selectedOption, setSelectedOption] = useState<
    DropdownOptionType | undefined
  >();

  // 기본 값 설정
  useEffect(() => {
    const option = options.find((opt) => opt.value === value);
    setSelectedOption(option);
  }, [value, options]);

  const selectOption = useCallback(
    (option: DropdownOptionType) => {
      if (option.disabled) return;

      setSelectedOption(option);
      onChange?.(option.value, option);
    },
    [onChange]
  );

  const toggleDropdown = useCallback(() => {
    if (disabled) return;
    if (isOpen) {
      setIsOpen(false);
    } else {
      if (disabled) return;
      setIsOpen(true);
    }
  }, [disabled, isOpen, setIsOpen]);

  // 옵션 선택 핸들러
  const handleOptionClick = useCallback(
    (option: DropdownOptionType) => {
      selectOption(option);
      setIsOpen(false);
    },
    [selectOption, setIsOpen]
  );

  const dropdownClassName = useMemo(() => {
    return twMerge([
      "absolute z-50 w-full border border-[#CCCCCC] shadow-lg max-h-[260px] overflow-y-auto",
      baseDropdownSizes[size].dropdown,
    ]);
  }, [size]);

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
        <DropdownTrigger
          size={size}
          {...triggerProps}
          onClick={toggleDropdown}
        />
      )}

      {isOpen && (
        <div
          className={dropdownClassName}
          role="listbox"
          aria-label="옵션 목록"
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 text-center">
              선택할 수 있는 옵션이 없습니다
            </div>
          ) : (
            options.map((option) => (
              <DropdownOption
                key={option.value}
                option={option}
                isSelected={selectedOption?.value === option.value}
                size={size}
                handleOptionClick={handleOptionClick}
                renderOption={renderOption}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
