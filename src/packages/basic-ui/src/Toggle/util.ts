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
    // 마지막 프리픽스가 peer-checked 면 체크 상태용으로 분리
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
    // 마지막 프리픽스에 peer-checked 가 포함되어 있으면 그대로 사용
    if (parts.includes("peer-checked")) checked.push(t);
  }
  return checked.join(" ");
};
