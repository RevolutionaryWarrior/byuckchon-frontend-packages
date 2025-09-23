export function createClassName(
  classes: (string | false | undefined)[]
): string {
  return classes.filter(Boolean).join(" ");
}
