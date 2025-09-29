type Size = "sm" | "md" | "lg";

export const pickNumber = (
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

export const sizeRatios: Record<Size, { rw: number; rh: number }> = {
  sm: { rw: 2.5 / 4, rh: 2.75 / 4 },
  md: { rw: 3 / 5, rh: 3.25 / 5 },
  lg: { rw: 4 / 6, rh: 4.25 / 6 },
};
