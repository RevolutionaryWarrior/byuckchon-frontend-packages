import React, { useState } from "react";
import clsx from "clsx";
import IconChevronDown from "@icons/icon_byuckicon_chevron_down.svg?react";
import { useUITheme } from "../UIThemeProvider/useUITheme";
import type { AccordionTheme } from "./theme";

type AccordionItem = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
};

type Props = {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
  itemTextStyle?: string;
  ContentTextStyle?: string;
  borderColor?: string;
  variant?: "attached" | "spaced";
  spacing?: string;
};

const baseTheme: Required<AccordionTheme> = {
  mode: "highlight",
  header: {
    defaultBg: "bg-white",
    openBg: "bg-[#F1F1F1]",
    hoverBg: "hover:bg-[#F5F5F5]",
  },
  content: {
    defaultBg: "bg-white",
    openBg: "bg-[#F1F1F1]",
  },
};

function getBackgroundClasses(isOpen: boolean, theme?: AccordionTheme) {
  const mergedTheme = {
    mode: theme?.mode ?? baseTheme.mode,
    header: {
      ...baseTheme.header,
      ...theme?.header,
    },
    content: {
      ...baseTheme.content,
      ...theme?.content,
    },
  };

  const currentMode = mergedTheme.mode;

  switch (currentMode) {
    case "default":
      return {
        header: mergedTheme.header.defaultBg,
        headerHover: "hover:bg-[#F5F5F5]",
        content: mergedTheme.content.defaultBg,
      };
    case "inverted":
      return {
        header: isOpen
          ? mergedTheme.header.defaultBg
          : mergedTheme.header.openBg,
        headerHover: isOpen ? "hover:bg-[#F5F5F5]" : "hover:bg-[#E8E8E8]",
        content: isOpen
          ? mergedTheme.content.defaultBg
          : mergedTheme.content.openBg,
      };
    case "highlight":
    default:
      return {
        header: isOpen
          ? mergedTheme.header.openBg
          : mergedTheme.header.defaultBg,
        headerHover: isOpen ? "hover:bg-[#E8E8E8]" : mergedTheme.header.hoverBg,
        content: isOpen
          ? mergedTheme.content.openBg
          : mergedTheme.content.defaultBg,
      };
  }
}

export default function Accordion({
  items,
  className = "",
  allowMultiple = true,
  itemTextStyle = "text-base font-medium text-[#222]",
  ContentTextStyle = "p-4 text-sm text-[#222]",
  borderColor = "border-[#CCCCCC]",
  variant = "attached",
  spacing = "space-y-2",
}: Props) {
  const theme = useUITheme();
  const accordionTheme = theme?.accordion;
  const [openItems, setOpenItems] = useState<Set<number>>(
    new Set(
      items
        .map((item, index) => (item.defaultOpen ? index : -1))
        .filter((i) => i !== -1)
    )
  );

  function handleToggle(index: number) {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (allowMultiple) {
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
      } else {
        if (newSet.has(index)) {
          newSet.clear();
        } else {
          newSet.clear();
          newSet.add(index);
        }
      }
      return newSet;
    });
  }

  return (
    <div
      className={clsx(
        variant === "attached" ? "space-y-0" : spacing,
        className
      )}
    >
      {items.map((item, index) => {
        const itemId = `accordion-${index}`;
        const isOpen = openItems.has(index);
        const isFirst = index === 0;
        const bgClasses = getBackgroundClasses(isOpen, accordionTheme);

        return (
          <div
            key={itemId}
            className={clsx(
              `border-t ${borderColor} overflow-hidden`,
              isFirst && "border-t-0"
            )}
          >
            <button
              type="button"
              onClick={() => handleToggle(index)}
              className={clsx(
                "w-full flex items-center justify-between p-4",
                "transition-colors duration-200",
                bgClasses.header,
                bgClasses.headerHover
              )}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${itemId}`}
            >
              <div className="flex items-center gap-2">
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                <h3 className={clsx(itemTextStyle)}>{item.title}</h3>
              </div>
              <IconChevronDown
                className={clsx(
                  "w-5 h-5 transition-transform duration-200",
                  isOpen && "transform rotate-180"
                )}
              />
            </button>
            <div
              id={`accordion-content-${itemId}`}
              className={clsx(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? `max-h-[1000px] opacity-100` : `max-h-0 opacity-0`
              )}
            >
              <div className={clsx(ContentTextStyle, bgClasses.content)}>
                {item.children}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
