import { useState } from "react";

interface UseCheckListOptions {
  initialCount: number;
  initialItems?: boolean | boolean[];
}

interface UseCheckListReturn {
  checkedItems: boolean[];
  isAllChecked: boolean;
  toggleItem: (index: number) => void;
  toggleAll: (checked?: boolean) => void;
  reset: () => void;
}

/**
 * 체크리스트 상태를 관리하는 React 훅
 *
 * @param options - 체크리스트 옵션
 * @param options.initialCount - 초기 항목 개수 (필수값)
 * @param options.initialItems - 초기 체크될 항목들, boolean[] 타입으로 넣어주세요 (선택값)
 *
 * initialCount 를 넣어주어야 toggleAll 함수가 정상적으로 작동합니다!
 *
 * @returns 체크리스트 상태와 제어 함수들
 **/

const useCheckList = ({
  initialCount = 0,
  initialItems,
}: UseCheckListOptions): UseCheckListReturn => {
  const getInitialItems = () => {
    if (initialItems !== undefined) {
      return Array.isArray(initialItems) ? initialItems : [initialItems];
    }

    return Array(initialCount).fill(false);
  };

  const [checkedItems, setCheckedItems] = useState<boolean[]>(getInitialItems);

  const isAllChecked =
    checkedItems.length > 0 && checkedItems.every((item) => item === true);

  const actions = {
    toggleItem: (index: number) => {
      setCheckedItems((prev) => {
        const newItems = [...prev];
        newItems[index] = !newItems[index];
        return newItems;
      });
    },
    toggleAll: (checked?: boolean) => {
      setCheckedItems((prev) => {
        const targetValue = checked !== undefined ? checked : !isAllChecked;
        return prev.map(() => targetValue);
      });
    },
    reset: () => {
      setCheckedItems(getInitialItems());
    },
  };

  return {
    checkedItems,
    isAllChecked,
    ...actions,
  };
};

export default useCheckList;
