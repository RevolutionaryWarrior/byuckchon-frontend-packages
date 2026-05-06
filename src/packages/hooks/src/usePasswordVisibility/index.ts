import { useState } from 'react';

export default function usePasswordVisibility(...fields: string[]) {
  const [visibleFields, setVisibleFields] = useState<string[]>([]);

  const hasField = (field: string) =>
    fields.length === 0 || fields.includes(field);

  const isVisible = (field: string) =>
    hasField(field) && visibleFields.includes(field);
  const isHidden = (field: string) => !isVisible(field);

  const toggle = (field: string) => {
    if (!hasField(field)) return;

    setVisibleFields((prev) =>
      prev.includes(field) ? prev.filter((v) => v !== field) : [...prev, field],
    );
  };

  // test check PR open workflows

  return {
    isVisible,
    isHidden,
    toggle,
  };
}
