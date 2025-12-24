/**
 * PAGINATION COMPONENT
 * Reusable pagination component with page numbers
 */
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, total, onPageChange, itemName = 'items' }) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // First page + ellipsis
    if (start > 1) {
      pages.push(
        <button 
          key={1} 
          onClick={() => onPageChange(1)} 
          className="pagination-btn"
        >
          1
        </button>
      );
      if (start > 2) {
        pages.push(<span key="start-ellipsis" className="pagination-ellipsis">...</span>);
      }
    }

    // Middle pages
    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Last page + ellipsis
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="pagination-btn"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination-container">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="pagination-btn pagination-nav"
      >
        « Trước
      </button>
      
      {renderPageNumbers()}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="pagination-btn pagination-nav"
      >
        Sau »
      </button>
      
      {total && (
        <span className="pagination-info">
          Tổng: {total} {itemName}
        </span>
      )}
    </div>
  );
};

export default Pagination;
