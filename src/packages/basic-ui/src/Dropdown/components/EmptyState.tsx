// src/packages/basic-ui/src/Dropdown/components/EmptyState.tsx
import { baseDropdownStyles } from "../styles";

export function EmptyState() {
  return (
    <div className={baseDropdownStyles.empty}>
      선택할 수 있는 옵션이 없습니다
    </div>
  );
}
