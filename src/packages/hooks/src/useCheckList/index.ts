import { useState } from "react";

interface UseCheckListOptions {
  items?: boolean | boolean[];
  initialCount?: number;
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
 * @param options.items - 초기 체크 상태 배열 또는 단일 값
 * @param options.initialCount - 초기 항목 개수 (items가 없을 때 사용)
 *
 * @returns 체크리스트 상태와 제어 함수들
 **/

const useCheckList = ({
  items,
  initialCount = 0,
}: UseCheckListOptions = {}): UseCheckListReturn => {
  const getInitialItems = () => {
    if (items !== undefined) {
      return Array.isArray(items) ? items : [items];
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
