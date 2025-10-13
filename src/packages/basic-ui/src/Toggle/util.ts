export const checkNumber = (
  className: string,
  prefix: "w" | "h"
): number | null => {
  // 동적 변환이 없다면 유지
  if (!className) return null;

  let lastNumber = null;
  const tmp = new RegExp(
    `(?:^|\\s)(?:[\\w-]+:)*${prefix}-(\\d+(?:\\.\\d+)?)(?=\\s|$)`,
    "g"
  );

  while (true) {
    const matchNumber = tmp.exec(className);
    if (!matchNumber) break;

    const sizeNumber = parseFloat(matchNumber[1]);
    if (!isNaN(sizeNumber)) lastNumber = sizeNumber;
  }

  return lastNumber;
};

export const getBgClasses = (
  isChecked: boolean,
  className?: string
): string => {
  // 동적 변환이 없다면 유지
  if (!className) return "";

  const tokens = className.trim().split(/\s+/);
  const base = [];

  for (const t of tokens) {
    if (!/bg-(?:\[[^\]]+\]|[A-Za-z0-9-]+)/.test(t)) continue;

    const parts = t.split(":");
    const last = parts[parts.length - 1];

    if (!last.startsWith("bg-")) continue;
    const hasPeerChecked = parts.includes("peer-checked");

    if (isChecked && hasPeerChecked) {
      base.push(last);
    }

    if (!isChecked && !hasPeerChecked) {
      base.push(t);
    }
  }
  return base.join(" ");
};
