import React from "react";
import usePagination from "./hooks";
import { useUITheme } from "../UIThemeProvider/useUITheme";
import ArrowLeftIcon from "@icons/icon_byuckicon_chevron_left.svg?react";
import ArrowRightIcon from "@icons/icon_byuckicon_chevron_right.svg?react";
import DoubleArrowLeftIcon from "@icons/icon_byuckicon_chevrons_left.svg?react";
import DoubleArrowRightIcon from "@icons/icon_byuckicon_chevrons_right.svg?react";

type IconButtonType = {
  children: React.ReactNode;
  showButton?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type Props = {
  totalCount: number;
  currentPage: number;
  renderCount: number;
  onPageChange: (page: number) => void;
  showDeepButton?: boolean;
  mode?: "single" | "multi";
  Icon?: {
    DeepPrev?: React.ReactNode;
    Prev?: React.ReactNode;
    Next?: React.ReactNode;
    DeepNext?: React.ReactNode;
  };
  className?: string;
};

const baseTheme = {
  pageList: "flex justify-center gap-2 text-center",
  actionButton: "flex cursor-pointer items-center justify-center border border-[#D4D6DD] bg-white p-2 text-xs",
  pageItem: "size-[30px] text-[#7B7B7B] text-sm content-center",
  pageItemActive: "bg-[#0058E4] text-white",
};

const Pagination = ({
  totalCount,
  currentPage,
  renderCount,
  onPageChange,
  showDeepButton,
  mode,
  Icon,
  className,
}: Props) => {
  const {
    renderPages,
    isPageActive,
    actions: { onPrev, onNext, onDeepPrev, onDeepNext },
  } = usePagination({
    totalCount,
    currentPage,
    renderCount,
    onPageChange,
    mode: mode ?? "multi",
  });
  const theme = useUITheme();
  const mergedTheme = {
    ...baseTheme,
    ...(theme?.pagination ?? {}),
  };

  const IconButton = ({ children, showButton = true, ...props }: IconButtonType) => (
    <button className={`${mergedTheme.actionButton} ${showButton ? "block" : "hidden"}`} {...props}>
      {children}
    </button>
  );

  return (
    <nav className={`${mergedTheme.pageList} ${className}`} aria-label="pagination">
      <IconButton onClick={onDeepPrev} showButton={showDeepButton}>
        {Icon?.DeepPrev ?? <DoubleArrowLeftIcon />}
      </IconButton>
      <IconButton onClick={onPrev}>{Icon?.Prev ?? <ArrowLeftIcon />}</IconButton>
      {renderPages.map((page) => (
        <button
          key={page}
          className={`${isPageActive(page) ? mergedTheme.pageItemActive : ""} ${mergedTheme.pageItem} cursor-pointer`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <IconButton onClick={onNext}>{Icon?.Next ?? <ArrowRightIcon />}</IconButton>
      <IconButton onClick={onDeepNext} showButton={showDeepButton}>
        {Icon?.DeepNext ?? <DoubleArrowRightIcon />}
      </IconButton>
    </nav>
  );
};

export default Pagination;
