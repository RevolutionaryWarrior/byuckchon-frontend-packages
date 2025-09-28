type Props = {
  totalCount: number;
  currentPage: number;
  renderCount: number;
  onPageChange: (page: number) => void;
};

const usePagination = (props: Props) => {
  const { totalCount, renderCount, currentPage, onPageChange } = props;

  const generatePaginationRange = () => {
    const start: number = Math.floor((currentPage - 1) / renderCount) * renderCount + 1;
    const end: number = Math.min(start + renderCount - 1, totalCount);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handlePageChange = (step: number, checkLogic: (page: number) => boolean) => {
    const selectedPage = currentPage + step;
    const limitPage = onPageChange(step > 0 ? totalCount : 1);

    if (checkLogic(selectedPage)) {
      return onPageChange(selectedPage);
    }

    return limitPage;
  };

  const actions = {
    prev: () => handlePageChange(-1, (page) => page > 1),
    next: () => handlePageChange(1, (page) => page < totalCount),
    doublePrev: () => handlePageChange(-renderCount, (page) => page > 1),
    doubleNext: () => handlePageChange(renderCount, (page) => page < totalCount),
  };

  return {
    renderPages: generatePaginationRange(),
    isPageActive: (page: number) => page === currentPage,
    actions,
  };
};

export default usePagination;
