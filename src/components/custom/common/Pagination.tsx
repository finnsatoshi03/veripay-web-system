import { ChevronLeft, ChevronRight, ChevronsDown } from 'lucide-react';

// Define the props interface
interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (rows: number) => void;
}

// Type the component with the interface
const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}: PaginationProps) => {
  const goPrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const goNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    let maxPagesToShow = 4; // Default for larger screens

    // Adjust for smaller screens
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      maxPagesToShow = 2;
    }

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-10py-2 px-3 md:py-3 md:px-4 rounded-md">
      {/* Rows per page selector */}
      <div className="flex items-center">
        <span className="text-xs md:text-sm text-gray-600 mr-2">Rows per page:</span>
        <div className="relative">
          <select
            className="appearance-none pl-2 pr-6 py-1 text-xs md:text-sm border border-gray-300 rounded text-gray-700"
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronsDown size={14} />
          </div>
        </div>
      </div>

      {/* Page navigation */}
      <div className="flex items-center space-x-1 w-full sm:w-auto justify-center sm:justify-end">
        {/* Prev Button */}
        <button
          onClick={goPrev}
          disabled={currentPage === 1}
          className={`flex items-center px-2 md:px-3 py-1 text-xs md:text-sm border rounded-md ${
            currentPage === 1
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 mr-1" />
          <span className="xs:inline">Prev</span>
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs md:text-sm ${
              p === currentPage
                ? ' border'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={goNext}
          disabled={currentPage === totalPages}
          className={`flex items-center px-2 md:px-3 py-1 text-xs md:text-sm border rounded-md ${
            currentPage === totalPages
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="xs:inline">Next</span>
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;