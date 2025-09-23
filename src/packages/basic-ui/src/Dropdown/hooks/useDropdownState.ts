import { useState, useEffect, useCallback } from "react";
import type { DropdownOptionType } from "../index";

interface UseDropdownStateProps {
  options: DropdownOptionType[];
  value?: string | number;
  disabled: boolean;
  onChange?: (value: string | number, option: DropdownOptionType) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export function useDropdownState({
  options,
  value,
  disabled,
  onChange,
  onOpen,
  onClose,
}: UseDropdownStateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    DropdownOptionType | undefined
  >();

  // 선택된 옵션 찾기
  useEffect(() => {
    const option = options.find((opt) => opt.value === value);
    setSelectedOption(option);
  }, [value, options]);

  const openDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    onOpen?.();
  }, [disabled, onOpen]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggleDropdown = useCallback(() => {
    if (disabled) return;
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }, [disabled, isOpen, closeDropdown, openDropdown]);

  const selectOption = useCallback(
    (option: DropdownOptionType) => {
      if (option.disabled) return;

      setSelectedOption(option);
      setIsOpen(false);
      onChange?.(option.value, option);
      onClose?.();
    },
    [onChange, onClose]
  );

  return {
    isOpen,
    selectedOption,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    selectOption,
  };
}
