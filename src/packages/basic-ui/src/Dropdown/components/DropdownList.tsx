// src/packages/basic-ui/src/Dropdown/components/DropdownList.tsx
import React from "react";

interface DropdownListProps {
  className: string;
  children: React.ReactNode;
}

export function DropdownList({ className, children }: DropdownListProps) {
  return (
    <div className={className} role="listbox" aria-label="옵션 목록">
      {children}
    </div>
  );
}
