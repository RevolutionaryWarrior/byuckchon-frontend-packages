type Props = {
    totalCount: number;
    currentPage: number;
    renderCount: number;
    onPageChange: (page: number) => void;
}

const usePagination = (props: Props) => {
    const { totalCount, renderCount, currentPage, onPageChange } = props;
    const start: number = Math.floor((currentPage - 1) / renderCount) * renderCount + 1;
    const end: number = Math.min(start + renderCount - 1, totalCount);
    const renderPages: number[] = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const isPageActive = (page: number) => {
        return page === currentPage;
    }
    
    const actions = {
        prev: () => {
            if (currentPage > 1) {
                return onPageChange(currentPage - 1);
            }
        },
        next: () => {
            if (currentPage < totalCount) {
                return onPageChange(currentPage + 1);
            }
        },
        doublePrev: () => {
            if (currentPage - renderCount <= 0) {
            return onPageChange(1);
            }

            return onPageChange(currentPage - renderCount);
        },
        doubleNext: () => {
            if (currentPage + renderCount <= totalCount) {
                return onPageChange(currentPage + renderCount);
            }

            return onPageChange(totalCount);
        },
    }

    return {
        renderPages,
        isPageActive,
        actions,
    }
}

export default usePagination;