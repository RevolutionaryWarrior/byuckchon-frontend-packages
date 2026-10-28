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

  // 목표 페이지를 1 ~ totalCount 로 맞춘 뒤 한 번만 onPageChange 를 호출한다.
  // 이미 그 페이지면(첫/마지막 페이지에서 이전/다음) 호출하지 않는다.
  const handlePageChange = (step: number) => {
    const lastPage = Math.max(totalCount, 1);
    const targetPage = Math.min(Math.max(currentPage + step, 1), lastPage);

    if (targetPage === currentPage) return;

    onPageChange(targetPage);
  };

  const actions = () => {
    const isDefaultMode = mode === "multi";
    const step = isDefaultMode ? 10 : 1;

    return {
      onPrev: () => handlePageChange(-step),
      onNext: () => handlePageChange(step),
      onDeepPrev: () => handlePageChange(isDefaultMode ? -totalCount : -renderCount),
      onDeepNext: () => handlePageChange(isDefaultMode ? totalCount : renderCount),
    };
  };

  return {
    renderPages: generatePaginationRange(),
    isPageActive: (page: number) => page === currentPage,
    actions: actions(),
  };
};

export default usePagination;
