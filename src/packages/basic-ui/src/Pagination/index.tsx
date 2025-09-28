import React from "react";
import { usePagination } from "@byuckchon-frontend/hooks";
import { useUITheme } from "../UIThemeProvider/useUITheme";
import ArrowLeftIcon from "@icons/icon_byuckicon_chevron_left.svg?react";
import ArrowRightIcon from "@icons/icon_byuckicon_chevron_right.svg?react";
import DoubleArrowLeftIcon from "@icons/icon_byuckicon_chevrons_left.svg?react";
import DoubleArrowRightIcon from "@icons/icon_byuckicon_chevrons_right.svg?react";

interface Props {
  totalCount: number;
  currentPage: number;
  renderCount: number;
  onPageChange: (page: number) => void;
  Icon?: {
    DoublePrev?: React.ReactNode;
    Prev?: React.ReactNode;
    Next?: React.ReactNode;
    DoubleNext?: React.ReactNode;
  };
  className?: string;
}

const baseTheme = {
  pageList: "flex justify-center gap-2 text-center",
  actionButton: "flex cursor-pointer items-center justify-center border border-[#D4D6DD] bg-white p-2 text-xs",
  pageItem: "size-[30px] text-[#7B7B7B] text-sm content-center",
  pageItemActive: "bg-[#0058E4] text-white",
};

const Pagination = ({ totalCount, currentPage, renderCount, onPageChange, Icon, className }: Props) => {
  const { renderPages, isPageActive, actions } = usePagination({
    totalCount,
    currentPage,
    renderCount,
    onPageChange,
  });
  const theme = useUITheme();
  const mergedTheme = {
    ...baseTheme,
    ...(theme?.pagination ?? {}),
  };

  const IconButton = ({
    children,
    ...props
  }: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button className={`${mergedTheme.actionButton}`} {...props}>
      {children}
    </button>
  );

  return (
    <nav className={`${mergedTheme.pageList} ${className}`} aria-label="pagination">
      <IconButton onClick={actions.doublePrev}>{Icon?.DoublePrev ?? <DoubleArrowLeftIcon />}</IconButton>
      <IconButton onClick={actions.prev}>{Icon?.Prev ?? <ArrowLeftIcon />}</IconButton>
      <ul>
        {renderPages.map((page) => (
          <li
            key={page}
            className={`${isPageActive(page) ? mergedTheme.pageItemActive : ""} ${mergedTheme.pageItem} cursor-pointer`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </li>
        ))}
      </ul>
      <IconButton onClick={actions.next}>{Icon?.Next ?? <ArrowRightIcon />}</IconButton>
      <IconButton onClick={actions.doubleNext}>{Icon?.DoubleNext ?? <DoubleArrowRightIcon />}</IconButton>
    </nav>
  );
};

export default Pagination;
