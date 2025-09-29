import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DropdownTrigger } from "./components/DropdownTrigger";
import { DropdownOption } from "./components/DropdownOption";
import { createClassName } from "./utils/classNameUtils";
import { useUITheme } from "../UIThemeProvider/useUITheme";
import { useDetectClose } from "@byuckchon-frontend/hooks";

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
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  className?: string;
  icon?: React.ReactNode;
  onChange?: (value: string | number, option: DropdownOptionType) => void;
  onClose?: () => void;
  renderTrigger?: (props: TriggerProps) => React.ReactNode;
  renderOption?: (option: DropdownOptionType) => React.ReactNode;
};

export default function Dropdown({
  options = [],
  value,
  placeholder = "선택하세요",
  disabled = false,
  variant = "primary",
  size = "medium",
  className = "",
  icon,
  onChange,
  renderTrigger,
  renderOption,
}: DropdownProps) {
  const theme = useUITheme();
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

  // 스타일 클래스 메모이제이션
  const triggerClassName = useMemo(() => {
    const baseVariant = baseDropdownVariants[variant];
    const themeVariant = theme?.dropdown?.[variant];

    const mergedVariant = {
      ...baseVariant,
      ...(themeVariant ?? {}),
    };

    return createClassName([
      baseDropdownStyles.trigger,
      mergedVariant.bg,
      mergedVariant.border,
      mergedVariant.textColor,
      baseDropdownSizes[size].trigger,
      disabled && baseDropdownStyles.disabled,
      className,
    ]);
  }, [variant, size, disabled, className, theme]);

  const dropdownClassName = useMemo(() => {
    const baseVariant = baseDropdownVariants[variant];
    const themeVariant = theme?.dropdown?.[variant];

    const mergedVariant = {
      ...baseVariant,
      ...(themeVariant ?? {}),
    };

    return createClassName([
      baseDropdownStyles.dropdown,
      mergedVariant.bg,
      mergedVariant.border,
      mergedVariant.textColor,
      baseDropdownSizes[size].dropdown,
    ]);
  }, [variant, size, theme]);

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
    <div ref={dropdownRef} className={baseDropdownStyles.container}>
      {renderTrigger ? (
        renderTrigger(triggerProps)
      ) : (
        <DropdownTrigger
          triggerClassName={triggerClassName}
          toggleDropdown={toggleDropdown}
          {...triggerProps}
        />
      )}

      {isOpen && (
        <div
          className={dropdownClassName}
          role="listbox"
          aria-label="옵션 목록"
        >
          {options.length === 0 ? (
            <div className={baseDropdownStyles.empty}>
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

const baseDropdownStyles = {
  container: "relative inline-block w-full",
  trigger: `
    w-full text-left border border-[#CCCCCC] shadow-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    transition-colors duration-200
    flex items-center justify-between
  `,
  triggerContent: "flex items-center gap-2",
  icon: "flex-shrink-0",
  placeholder: "text-[#8F9098]",
  arrow: "ml-auto transition-transform duration-200",
  arrowOpen: "transform rotate-180",
  disabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
  dropdown: `
    absolute z-50 w-full border border-[#CCCCCC]
    shadow-lg max-h-60 overflow-auto
  `,
  option: `
    cursor-pointer hover:bg-gray-100 transition-colors duration-150
    flex items-center gap-2
    border-b border-[#CCCCCC]
  `,
  optionSelected: "bg-blue-50 text-blue-600",
  optionDisabled: "text-gray-400 cursor-not-allowed hover:bg-transparent",
  optionIcon: "flex-shrink-0",
  empty: "px-3 py-2 text-gray-500 text-center",
};

const baseDropdownVariants = {
  primary: {
    bg: "bg-[#fff]",
    border: "border-[#CCCCCC]",
    textColor: "text-[#000]",
  },
  secondary: {
    bg: "bg-[#000]",
    border: "border-[#fff]",
    textColor: "text-[#fff]",
  },
};

const baseDropdownSizes = {
  small: {
    trigger: "px-2 py-2 text-sm",
    dropdown: "text-sm",
    option: "p-2",
  },
  medium: {
    trigger: "px-3 py-4  text-base",
    dropdown: "text-base",
    option: "px-3 py-4",
  },
  large: {
    trigger: "px-5 py-6 text-lg",
    dropdown: "text-lg",
    option: "px-5 py-6",
  },
};
