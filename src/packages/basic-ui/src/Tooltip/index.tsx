import React, { useState } from "react";

type Placement =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left-top"
  | "right-top";

const positionClasses: Record<Placement, string> = {
  "top-left": "bottom-full left-0",
  "top-center": "bottom-full left-1/2 -translate-x-1/2",
  "top-right": "bottom-full right-0",

  "bottom-left": "top-full left-0",
  "bottom-center": "top-full left-1/2 -translate-x-1/2",
  "bottom-right": "top-full right-0",

  "left-top": "right-full top-0",
  "right-top": "left-full top-0",
};

const baseArrow =
  "absolute w-0 h-0 border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent";

const arrowClasses: Record<Placement, string> = {
  "top-left": `${baseArrow} top-full left-2 border-t-[6px] border-t-black`,
  "top-center": `${baseArrow} top-full left-1/2 -translate-x-1/2 border-t-[6px] border-t-black`,
  "top-right": `${baseArrow} top-full right-2 border-t-[6px] border-t-black`,

  "bottom-left": `${baseArrow} bottom-full left-2 border-b-[6px] border-b-black`,
  "bottom-center": `${baseArrow} bottom-full left-1/2 -translate-x-1/2 border-b-[6px] border-b-black`,
  "bottom-right": `${baseArrow} bottom-full right-2 border-b-[6px] border-b-black`,

  "left-top":
    "absolute w-0 h-0 border-t-[6px] border-b-[6px] border-t-transparent border-b-transparent left-full top-2 border-l-[6px] border-l-black",
  "right-top":
    "absolute w-0 h-0 border-t-[6px] border-b-[6px] border-t-transparent border-b-transparent right-full top-2 border-r-[6px] border-r-black",
};

// TODO: 폰트 스타일 추후 삭제
const fontStyles =
  "font-pretendard text-[12px] font-bold leading-[16px] tracking-[-0.12px] not-italic";

type Props = {
  content: React.ReactNode;
  placement?: Placement;
  trigger?: "hover" | "click";
  children: React.ReactElement;
  className?: string;
  offset?: number;
};

export default function Tooltip({
  content,
  placement = "top-center",
  trigger = "hover",
  children,
  className = "",
  offset = 8,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const triggerProps =
    trigger === "hover"
      ? {
          onMouseEnter: () => setOpen(true),
          onMouseLeave: () => setOpen(false),
        }
      : { onClick: () => setOpen((prev) => !prev) };

  const offsetStyle: React.CSSProperties = {};
  if (placement.startsWith("top")) offsetStyle.marginBottom = offset;
  if (placement.startsWith("bottom")) offsetStyle.marginTop = offset;
  if (placement.startsWith("left")) offsetStyle.marginRight = offset;
  if (placement.startsWith("right")) offsetStyle.marginLeft = offset;

  return (
    <div className="relative inline-block" {...triggerProps}>
      {children}
      {open && (
        <div
          className={`${positionClasses[placement]} absolute z-50`}
          style={offsetStyle}
        >
          <div className="relative">
            <div
              className={`${className} ${fontStyles} bg-black text-white px-2 py-1`}
            >
              {content}
            </div>
            <div className={`${arrowClasses[placement]}`} />
          </div>
        </div>
      )}
    </div>
  );
}
