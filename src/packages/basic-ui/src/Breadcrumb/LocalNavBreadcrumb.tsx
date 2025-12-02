import clsx from "clsx";
import type { LocalNavBreadcrumbProps } from "./types";

function RightArrowIcon({ fill }: { fill: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="14"
      viewBox="0 0 8 14"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.274587 12.8504C-0.0915291 12.4843 -0.0915291 11.8907 0.274587 11.5246L5.23667 6.5625L0.274588 1.60041C-0.091529 1.2343 -0.091529 0.640704 0.274588 0.274589C0.640704 -0.0915289 1.2343 -0.0915289 1.60041 0.274589L7.22541 5.89959C7.59153 6.2657 7.59153 6.8593 7.22541 7.22541L1.60041 12.8504C1.2343 13.2165 0.640704 13.2165 0.274587 12.8504Z"
        fill={fill}
      />
    </svg>
  );
}

export function LocalNavBreadcrumb({
  items,
  labelStyle = "text-[#222222] font-medium text-[16px]",
  isSeparator = true,
  separatorColor = "#222222",
  separatorActiveColor = "#0058E4",
}: LocalNavBreadcrumbProps) {
  const renderSeparator = (isActive: boolean, isFirst: boolean) => {
    if (isFirst) return null;
    if (!isSeparator) return null;
    const fillColor = isActive ? separatorActiveColor : separatorColor;
    return <RightArrowIcon fill={fillColor} />;
  };

  return (
    <div className="flex items-center">
      {items.map((item, index) => {
        const isActive = item.active ?? false;
        const isFirst = index === 0;

        const itemClassName = clsx(
          "flex items-center cursor-pointer pr-[12px] py-[8px] gap-[4px]",
          {
            "bg-[#0058E4] text-white": isActive,
          }
        );

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
