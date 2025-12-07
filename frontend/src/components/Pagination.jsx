import '../styles/Pagination.css';

function Pagination({ pagination, onPageChange }) {
  const { currentPage, totalPages, hasNextPage, hasPreviousPage, totalItems } = pagination;

  const handlePrevious = () => {
    if (hasPreviousPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing page {currentPage} of {totalPages} ({totalItems} total items)
      </div>
      
      <div className="pagination-controls">
        <button
          onClick={handlePrevious}
          disabled={!hasPreviousPage}
          className="pagination-btn"
        >
          Previous
        </button>
        
        <div className="page-numbers">
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`page-number ${page === currentPage ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={handleNext}
          disabled={!hasNextPage}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;


