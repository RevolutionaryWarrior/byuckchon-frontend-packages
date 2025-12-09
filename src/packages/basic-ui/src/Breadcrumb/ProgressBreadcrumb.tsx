import type { ProgressBreadcrumbProps } from "./types";

function LinkIcon({ fill }: { fill: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="88"
      height="2"
      viewBox="0 0 88 2"
      fill="none"
      className="flex-shrink-0"
    >
      <rect width="88" height="2" fill={fill} />
    </svg>
  );
}

export function ProgressBreadcrumb({
  items,
  labelStyle = "text-[#222222] font-medium text-[16px]",
  isSeparator = true,
  separatorColor = "#222222",
  separatorActiveColor = "#0058E4",
}: ProgressBreadcrumbProps) {
  const renderSeparator = (isActive: boolean, isFirst: boolean) => {
    if (isFirst) return null;
    if (!isSeparator) return null;
    const fillColor = isActive ? separatorActiveColor : separatorColor;
    return <LinkIcon fill={fillColor} />;
  };

  return (
    <div className="flex items-center">
      {items.map((item, index) => {
        const isActive = item.active ?? false;
        const isFirst = index === 0;

        const itemClassName = "flex items-center cursor-pointer";

        return (
          <div
            key={`${index}-${item.label}`}
            className={itemClassName}
            onClick={item.onClick}
          >
            {renderSeparator(isActive, isFirst)}
            {item.icon && (
              <div className="flex-shrink-0 flex items-center pl-[12px]">
                {item.icon}
              </div>
            )}
            {typeof item.label === "string" ? (
              <span className={`px-[8px] ${labelStyle}`}>{item.label}</span>
            ) : (
              item.label
            )}
          </div>
        );
      })}
    </div>
  );
}
