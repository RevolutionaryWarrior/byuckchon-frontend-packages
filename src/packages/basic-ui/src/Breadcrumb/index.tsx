import clsx from "clsx";

type Props = {
  items: {
    label: React.ReactNode | string;
    icon?: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
  }[];
  mode: "localNavMode" | "progressMode";
  labelStyle: string;
  isSeparator?: boolean;
  separatorColor?: string;
  separatorActiveColor?: string;
};

export default function Breadcrumb({
  items,
  mode,
  labelStyle = "text-[#222222] font-medium text-[16px]",
  isSeparator = true,
  separatorColor = "#222222",
  separatorActiveColor = "#0058E4",
}: Props) {
  const getSeparator = (isActive: boolean) => {
    const fillColor = isActive ? separatorActiveColor : separatorColor;
    switch (mode) {
      case "localNavMode":
        return <RightArrowIcon fill={fillColor} />;
      case "progressMode":
        return <LinkIcon fill={fillColor} />;
    }
  };

  const renderSeparator = (isActive: boolean, isFirst: boolean) => {
    if (isFirst) return null;
    if (isSeparator) return getSeparator(isActive);
    return null;
  };

  return (
    <div className="flex items-center">
      {items.map((item, index) => {
        const isActive = item.active ?? false;
        const isFirst = index === 0;

        const itemClassName = clsx("flex items-center cursor-pointer", {
          "pr-[12px] py-[8px] gap-[4px]": mode === "localNavMode",
          "bg-[#0058E4] text-white": mode === "localNavMode" && isActive,
        });

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
