export const checkNumber = (
  className: string,
  prefix: "w" | "h"
): number | null => {
  if (!className) return null;

  const re = new RegExp(
    `(?:^|\\s)(?:[\\w-]+:)*${prefix}-(\\d+(?:\\.\\d+)?)(?=\\s|$)`,
    "g"
  );

  let m: RegExpExecArray | null;
  let last: number | null = null;

  while ((m = re.exec(className))) {
    const n = parseFloat(m[1]);
    if (!isNaN(n)) last = n;
  }
  return last;
};

export const getBaseBgClasses = (className?: string): string => {
  if (!className) return "";
  const tokens = className.trim().split(/\s+/);
  const base: string[] = [];
  for (const t of tokens) {
    if (!/bg-(?:\[[^\]]+\]|[A-Za-z0-9-]+)/.test(t)) continue;
    const parts = t.split(":");
    const last = parts[parts.length - 1];
    if (!last.startsWith("bg-")) continue;
    if (parts.includes("peer-checked")) continue;
    base.push(t);
  }
  return base.join(" ");
};

export const getCheckedBgClasses = (className?: string): string => {
  if (!className) return "";
  const tokens = className.trim().split(/\s+/);
  const checked: string[] = [];
  for (const t of tokens) {
    if (!/bg-(?:\[[^\]]+\]|[A-Za-z0-9-]+)/.test(t)) continue;
    const parts = t.split(":");
    const last = parts[parts.length - 1];
    if (!last.startsWith("bg-")) continue;
    if (parts.includes("peer-checked")) checked.push(t);
  }
  return checked.join(" ");
};
