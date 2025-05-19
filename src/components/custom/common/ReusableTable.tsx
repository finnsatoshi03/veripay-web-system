import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, X, Check, Filter, ChevronsDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define generic interfaces
export interface Column<T> {
  key: Extract<keyof T, string>;
  header: string;
  hidden?: boolean;
  width?: string;
  renderCell?: (item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchPlaceholder?: string;
  showActions?: boolean;
  renderActions?: (item: T) => React.ReactNode;
  onSearch?: (query: string) => void;
  customFilters?: React.ReactNode;
  rowsPerPageOptions?: number[];
  initialRowsPerPage?: number;
}

export default function ReusableTable<T extends { id?: string | number }>({
  data,
  columns: initialColumns,
  title = "Table",
  searchPlaceholder = "Search...",
  showActions = false,
  renderActions,
  onSearch,
  customFilters,
  rowsPerPageOptions = [10, 25, 50, 100],
  initialRowsPerPage = 10,
}: TableProps<T>) {
  // State management
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayData, setDisplayData] = useState<T[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [columns, setColumns] = useState(initialColumns.map(col => ({ ...col, hidden: col.hidden || false })));
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [useScrollableTable, setUseScrollableTable] = useState(false);

  // Update filtered data when search query changes or when data prop changes
  useEffect(() => {
    setFilteredData(data);
    if (onSearch && searchQuery) {
      onSearch(searchQuery);
    }
  }, [data, onSearch]);

  // Local search if no external search handler provided
  useEffect(() => {
    if (!onSearch && searchQuery) {
      const filtered = data.filter((item) => {
        return Object.entries(item).some(([_, value]) => {
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        });
      });
      setFilteredData(filtered);
    } else if (!searchQuery) {
      setFilteredData(data);
    }
    setCurrentPage(1);
  }, [searchQuery, data, onSearch]);

  // Update pagination calculations
  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / rowsPerPage));
    if (currentPage > Math.ceil(filteredData.length / rowsPerPage)) {
      setCurrentPage(1);
    }
  }, [filteredData, rowsPerPage]);

  // Update display data when pagination changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setDisplayData(filteredData.slice(startIndex, endIndex));
  }, [currentPage, rowsPerPage, filteredData]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showColumnToggle && !target.closest(".view-dropdown-container")) {
        setShowColumnToggle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showColumnToggle]);

  // Determine if we should use scrollable table based on rows per page
  useEffect(() => {
    setUseScrollableTable(rowsPerPage >= 50);
  }, [rowsPerPage]);

  // Sync with initialColumns changes
  useEffect(() => {
    setColumns(initialColumns.map(col => ({ ...col, hidden: col.hidden || false })));
  }, [initialColumns]);

  // Pagination helpers
  const goPrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const goNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  // Get page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 4;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
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

  const handleRowsPerPageChange = (value: string) => {
    const newRowsPerPage = parseInt(value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  // Calculate display range
  const startItem = filteredData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, filteredData.length);

  // Toggle column visibility
  const toggleColumnVisibility = (key: string) => {
    setColumns(prev =>
      prev.map(col => (col.key === key ? { ...col, hidden: !col.hidden } : col))
    );
  };

  // Get visible columns
  const visibleColumns = columns.filter(col => !col.hidden);

  // Function to render table cells with custom rendering when available
  const renderTableCell = (column: Column<T>, row: T) => {
    const key = column.key;
    const width = column.width || "auto";

    // If column has custom rendering function, use it
    if (column.renderCell) {
      return (
        <TableCell key={key} className="py-4 px-6" style={{ width }}>
          {column.renderCell(row)}
        </TableCell>
      );
    }

    // Default rendering
    return (
      <TableCell key={key} className="py-4 px-6 truncate" style={{ width }}>
        {String(row[key] || '')}
      </TableCell>
    );
  };

  // Function to render the table rows
  const renderTableRows = () => {
    if (displayData.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={visibleColumns.length + (showActions ? 1 : 0)}
            className="py-6 text-center text-gray-500"
          >
            No matching records found
          </TableCell>
        </TableRow>
      );
    }

    return displayData.map((row) => (
      <TableRow key={row.id || Math.random().toString()}>
        {visibleColumns.map((column) => renderTableCell(column, row))}
        {showActions && (
          <TableCell className="py-4 px-6">
            <div className="flex justify-end space-x-4">
              {renderActions ? renderActions(row) : (
                <>
                  <button className="hover:text-red-600 flex items-center justify-center">
                    <X size={16} />
                  </button>
                  <button className="hover:text-green-600 flex items-center justify-center">
                    <Check size={16} />
                  </button>
                </>
              )}
            </div>
          </TableCell>
        )}
      </TableRow>
    ));
  };

  // Render the table header row
  const tableHeaderRow = (
    <TableRow className="border-b border-gray-300">
      {visibleColumns.map((column) => (
        <TableHead
          key={column.key}
          className="font-semibold text-gray-700 py-4 px-6"
          style={{ width: column.width || "auto" }}
        >
          {column.header}
        </TableHead>
      ))}
      {showActions && (
        <TableHead
          className="font-semibold text-gray-700 py-4 px-6 text-right"
        >
          Actions
        </TableHead>
      )}
    </TableRow>
  );

  return (
    <div className="w-full">
      {/* Search and View Controls */}
      <div className="flex justify-between items-center my-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-80 pl-6 pr-4 text-sm placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <Search className="absolute right-5 top-5 transform -translate-y-1/2 h-3 w-4 text-gray-400" />
        </div>

        <div className="flex items-center space-x-4">
          {customFilters}
          
          <span className="text-sm text-gray-500">
            Showing {filteredData.length > 0 ? startItem : 0}-{endItem} of {filteredData.length}
          </span>
          
          <div className="relative view-dropdown-container">
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 flex items-center"
              onClick={() => setShowColumnToggle(!showColumnToggle)}
            >
              <Filter className="w-4 h-4 mr-1" />
              View
            </button>
            {showColumnToggle && (
              <div className="absolute right-0 mt-1 bg-gray-200 shadow-lg rounded-md border border-gray-300 z-20 w-48">
                <div className="py-2 px-3 border-b border-gray-300 font-medium text-sm">
                  Toggle columns
                </div>
                <div className="py-1">
                  {columns.map((column) => (
                    <button
                      key={column.key}
                      className="px-3 py-2 text-sm w-full text-left flex items-center justify-between hover:bg-gray-300"
                      onClick={() => toggleColumnVisibility(column.key)}
                    >
                      <span>{column.header}</span>
                      <span className="flex items-center justify-center w-5 h-5">
                        {!column.hidden && <Check size={16} />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border border-gray-300 rounded-md overflow-hidden">
        {useScrollableTable ? (
          <div className="w-full">
            {/* Table with fixed layout to ensure columns align properly */}
            <Table className="w-full table-fixed text-sm">
              <TableHeader>{tableHeaderRow}</TableHeader>
            </Table>

            {/* Scrollable body with matching column widths */}
            <ScrollArea className="w-full h-130">
              <Table className="w-full table-fixed">
                <TableBody>
                  {renderTableRows()}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        ) : (
          /* Regular table for fewer rows */
          <Table className="w-full table-fixed">
            <TableHeader>{tableHeaderRow}</TableHeader>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination Section */}
      <div className="flex justify-between items-center mt-10 py-3 px-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">Rows per page:</span>
          <Select 
            defaultValue={rowsPerPage.toString()} 
            onValueChange={handleRowsPerPageChange}
          >
            <SelectTrigger className="w-16 h-8" size="sm">
              <SelectValue placeholder={rowsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              {rowsPerPageOptions.map(option => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Pagination>
            <PaginationContent className="flex items-center gap-1">
              <PaginationItem>
                <PaginationPrevious
                  onClick={goPrev}
                  className={`px-3 py-1 rounded-md ${currentPage === 1
                      ? "text-gray-400 pointer-events-none opacity-50"
                      : "text-gray-700 hover:bg-gray-50"
                    }`}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              {getPageNumbers().map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={page === currentPage}
                    className={`w-8 h-8 flex items-center justify-center ${page === currentPage ? "bg-white border-gray-300" : "hover:bg-gray-200"
                      }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={goNext}
                  className={`px-3 py-1 rounded-md ${currentPage === totalPages
                      ? "text-gray-400 pointer-events-none opacity-50"
                      : "text-gray-700 hover:bg-gray-50"
                    }`}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}