import { useState, useEffect, useCallback } from "react";
import type { DropdownOptionType } from "../index";

interface UseDropdownStateProps {
  options: DropdownOptionType[];
  value?: string | number;
  onChange?: (value: string | number, option: DropdownOptionType) => void;
  onClose?: () => void;
}

export function useDropdownState({
  options,
  value,
  onChange,
  onClose,
}: UseDropdownStateProps) {
  const [selectedOption, setSelectedOption] = useState<
    DropdownOptionType | undefined
  >();

  // 선택된 옵션 찾기
  useEffect(() => {
    const option = options.find((opt) => opt.value === value);
    setSelectedOption(option);
  }, [value, options]);

  const selectOption = useCallback(
    (option: DropdownOptionType) => {
      if (option.disabled) return;

      setSelectedOption(option);
      onChange?.(option.value, option);
      onClose?.();
    },
    [onChange, onClose]
  );

  return {
    selectedOption,
    selectOption,
  };
}
