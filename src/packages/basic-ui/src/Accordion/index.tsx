import React, { useState, useRef } from "react";
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
  details: {
    itemTextStyle: "text-base font-medium text-[#222]",
    contentTextStyle: "p-4 text-sm text-[#222]",
    dropdownIconStyle: "w-5 h-5 transition-transform duration-200",
    borderColor: "border-[#CCCCCC]",
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
    details: {
      ...baseTheme.details,
      ...theme?.details,
    },
  };

  const currentMode = mergedTheme.mode;

  switch (currentMode) {
    case "default":
      return {
        header: mergedTheme.header.defaultBg,
        headerHover: "hover:bg-[#F5F5F5]",
        content: mergedTheme.content.defaultBg,
        details: mergedTheme.details,
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
        details: mergedTheme.details,
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
        details: mergedTheme.details,
      };
  }
}

export default function Accordion({
  items,
  className = "",
  allowMultiple = true,
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
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  function setItemRef(index: number) {
    return (el: HTMLDivElement | null) => {
      void (el
        ? itemRefs.current.set(index, el)
        : itemRefs.current.delete(index));
    };
  }

  function handleToggle(index: number) {
    const wasOpen = openItems.has(index);

    setOpenItems((prev) => {
      if (allowMultiple) {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
          return newSet;
        }
        newSet.add(index);
        return newSet;
      }

      if (prev.has(index)) {
        return new Set();
      }

      return new Set([index]);
    });

    if (!wasOpen) {
      setTimeout(() => {
        const itemElement = itemRefs.current.get(index);
        if (itemElement) {
          itemElement.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        }
      }, 50);
    }
  }

  return (
    <div
      className={clsx(
        variant === "attached" ? "space-y-0" : spacing,
        className
      )}
    >
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        const bgClasses = getBackgroundClasses(isOpen, accordionTheme);

        return (
          <div
            key={`accordion-${index}`}
            ref={setItemRef(index)}
            className={clsx(
              `border-t ${bgClasses.details.borderColor} overflow-hidden`,
              "first:border-t-0"
            )}
          >
            <button
              type="button"
              onClick={() => handleToggle(index)}
              className={clsx(
                "w-full flex items-center justify-between p-4",
                "transition-colors duration-200 cursor-pointer",
                bgClasses.header,
                bgClasses.headerHover
              )}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${index}`}
            >
              <div className="flex items-center gap-2">
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                <h3 className={bgClasses.details.itemTextStyle}>
                  {item.title}
                </h3>
              </div>
              <IconChevronDown
                className={clsx(
                  bgClasses.details.dropdownIconStyle,
                  isOpen && "transform rotate-180"
                )}
              />
            </button>
            <div
              id={`accordion-content-${index}`}
              className={clsx(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? `max-h-[1000px] opacity-100` : `max-h-0 opacity-0`
              )}
            >
              <div
                className={clsx(
                  bgClasses.details.contentTextStyle,
                  bgClasses.content
                )}
              >
                {item.children}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
