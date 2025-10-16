type Props = {
  totalCount: number;
  currentPage: number;
  renderCount: number;
  onPageChange: (page: number) => void;
  mode?: "single" | "multi";
};

const usePagination = (props: Props) => {
  const { totalCount, renderCount, currentPage, onPageChange, mode } = props;

  const generatePaginationRange = () => {
    const start: number = Math.floor((currentPage - 1) / renderCount) * renderCount + 1;
    const end: number = Math.min(start + renderCount - 1, totalCount);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handlePageChange = (step: number, checkLogic: (page: number) => boolean) => {
    const selectedStep = currentPage + step;
    const limitPage = onPageChange(selectedStep < 1 ? 1 : totalCount);

    if (checkLogic(selectedStep)) {
      return onPageChange(selectedStep);
    }

    return limitPage;
  };

  const actions = () => {
    const isDefaultMode = mode === "multi";
    const step = isDefaultMode ? 10 : 1;

    return {
      onPrev: () => handlePageChange(-step, (page) => page >= 1),
      onNext: () => handlePageChange(step, (page) => page < totalCount),
      onDeepPrev: () => handlePageChange(isDefaultMode ? -totalCount : -renderCount, (page) => page >= 1),
      onDeepNext: () => handlePageChange(isDefaultMode ? totalCount : renderCount, (page) => page < totalCount),
    };
  };

  return {
    renderPages: generatePaginationRange(),
    isPageActive: (page: number) => page === currentPage,
    actions: actions(),
  };
};

export default usePagination;
