import PropTypes from 'prop-types';

function PaginationControls({ currentPage, totalPages, onPageChange }) {
    if (typeof totalPages !== 'number' || totalPages <= 1) {
        return null;
    }

    const getPageNumbersToDisplay = () => {
        const pageNumbers = [];
        const pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(pageNum =>
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
            );

        let lastPageAdded = 0;
        pagesToShow.forEach(pageNum => {
            if (pageNum - lastPageAdded > 1) {
                pageNumbers.push('...');
            }
            pageNumbers.push(pageNum);
            lastPageAdded = pageNum;
        });

        return pageNumbers;
    };

    const pageNumbersToDisplay = getPageNumbersToDisplay();

    return (
        <div className="pagination-container">
            {pageNumbersToDisplay.map((pageNum, index) => (
                <div
                    key={pageNum === '...' ? `dots-${index}` : pageNum}
                    className={`page-button-wrapper ${currentPage === pageNum ? 'active' : ''} ${pageNum === '...' ? 'disabled' : ''}`}
                >
                    {pageNum === '...' ? (
                        <span className="page-dots">...</span>
                    ) : (
                        <button
                            className="page-button"
                            onClick={() => onPageChange(pageNum)}
                            disabled={currentPage === pageNum}
                        >
                            {pageNum}
                        </button>
                    )}
                </div>
            ))}

        </div>
    );
}

PaginationControls.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default PaginationControls;