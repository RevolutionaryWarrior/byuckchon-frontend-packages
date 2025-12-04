import { useState } from "react";

interface CheckListItem {
  id: number;
  content: string;
  description?: string;
  isRequired: boolean;
}

interface UseCheckListOptions {
  initialItems: CheckListItem[];
}

interface UseCheckListReturn {
  requiredIds: number[];
  checkedItems: number[];
  isRequiredChecked: boolean;
  isAllChecked: boolean;
  toggleItem: (id: number) => void;
  toggleAll: () => void;
  reset: () => void;
}

/**
 * 체크리스트 상태를 관리하는 React 훅
 *
 * @param options - 체크리스트 옵션
 * @param options.initialItems - 체크리스트 항목 배열 (id, content, isRequired 포함)
 *
 * @returns 체크리스트 상태와 제어 함수들
 * @returns requiredIds - 필수 항목들의 id 배열
 * @returns checkedItems - 현재 체크된 항목들의 id 배열
 * @returns isRequiredChecked - 필수 항목이 모두 체크되었는지 여부
 * @returns isAllChecked - 모든 항목이 체크되었는지 여부
 * @returns toggleItem - id로 항목 토글
 * @returns toggleAll - 전체 토글
 * @returns reset - 초기 상태로 리셋
 *
 * @example
 * ```tsx
 * const items = [
 *   { id: 1, content: "필수 항목 1", isRequired: true },
 *   { id: 2, content: "일반 항목 1", isRequired: false },
 *   { id: 3, content: "필수 항목 2", isRequired: true },
 * ];
 *
 * const { checkedItems, isRequiredChecked, toggleItem } = useCheckList({
 *   initialItems: items,
 * });
 *
 * // id로 토글
 * toggleItem(1);
 *
 * // 필수 항목 체크 여부 확인
 * if (isRequiredChecked) {
 *   console.log("모든 필수 항목이 체크되었습니다!");
 * }
 * ```
 **/

const useCheckList = ({
  initialItems,
}: UseCheckListOptions): UseCheckListReturn => {
  // 현재 체크된 항목들의 id 배열
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  // 필수 항목들의 id 배열
  const requiredIds = initialItems
    .filter((item) => item.isRequired)
    .map((item) => item.id);

  // 모든 항목의 id 배열
  const allIds = initialItems.map((item) => item.id);

  // 필수 항목이 모두 체크되었는지 확인
  const isRequiredChecked =
    requiredIds.length === 0 ||
    requiredIds.every((id) => checkedItems.includes(id));

  // 모든 항목이 체크되었는지 확인
  const isAllChecked =
    allIds.length > 0 && allIds.every((id) => checkedItems.includes(id));

  const actions = {
    toggleItem: (id: number) => {
      setCheckedItems((prev) => {
        if (prev.includes(id)) {
          return prev.filter((itemId) => itemId !== id);
        }
        return [...prev, id];
      });
    },
    toggleAll: () => {
      setCheckedItems(() => {
        if (isAllChecked) {
          return [];
        }
        return [...allIds];
      });
    },
    reset: () => {
      setCheckedItems([]);
    },
  };

  return {
    requiredIds,
    checkedItems,
    isRequiredChecked,
    isAllChecked,
    ...actions,
  };
};

export default useCheckList;
