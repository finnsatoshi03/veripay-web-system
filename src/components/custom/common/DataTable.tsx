import { useState, useEffect, type ReactNode } from "react";
import { Search, Filter, Check } from "lucide-react";
import Pagination from "@/components/custom/common/Pagination";

// Define the interface with a constraint on T
interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: {
    key: string;
    header: string;
    hidden?: boolean;
    render?: (item: T) => ReactNode;
  }[];
  searchPlaceholder?: string;
  renderActions?: (item: T, toggleRowActions: (id: any) => void, activeRow: any) => ReactNode;
  idKey?: string;
  renderExtraControls?: () => ReactNode;
}

// Update the component definition with the constraint
export function DataTable<T extends Record<string, any>>({
  data,
  columns: initialColumns,
  searchPlaceholder = "Search...",
  renderActions,
  idKey = "id",
  renderExtraControls
}: DataTableProps<T>) {
  // PAGINATION STATE
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayData, setDisplayData] = useState<T[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [activeRow, setActiveRow] = useState<any | null>(null);
  
  // Column visibility state
  const [columns, setColumns] = useState(initialColumns);
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  // Update filtered data when search query changes or data changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item => {
        // Search through all object properties that are strings
        return Object.entries(item).some(([, value]) => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchQuery.toLowerCase());
          }
          return false;
        });
      });
      setFilteredData(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, data]);

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

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  // Calculate display range
  const startItem = filteredData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, filteredData.length);

  // Handle row actions
  const toggleRowActions = (id: any) => {
    setActiveRow(activeRow === id ? null : id);
  };

  // Toggle column visibility
  const toggleColumnVisibility = (key: string) => {
    setColumns(prev => 
      prev.map(col => 
        col.key === key ? { ...col, hidden: !col.hidden } : col
      )
    );
  };

  // Custom view control with column toggle
  const renderViewControl = () => (
    <div className="relative">
      <button 
        className="px-2 md:px-3 py-1 border border-gray-300 rounded-md text-xs md:text-sm text-gray-700 flex items-center"
        onClick={() => setShowColumnToggle(!showColumnToggle)}
      >
        <Filter className="w-3 h-3 md:w-4 md:h-4 mr-1" />
        View
      </button>
      
      {showColumnToggle && (
        <div className="absolute right-0 mt-1 bg-gray-200 shadow-lg rounded-md border border-gray-300 z-20 w-48 ">
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
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showColumnToggle && !target.closest('.view-dropdown-container')) {
        setShowColumnToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColumnToggle]);

  return (
    <>
      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-4 space-y-3 sm:space-y-0">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-full sm:w-64 md:w-80 pl-6 pr-4 text-sm placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <Search className="absolute right-5 top-5 transform -translate-y-1/2 h-3 w-4 text-gray-400" />
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start sm:space-x-4">
          <span className="text-xs md:text-sm text-gray-500">
            Showing {filteredData.length > 0 ? startItem : 0}-{endItem} of {filteredData.length}
          </span>
          <div className="view-dropdown-container">
            {renderExtraControls ? renderExtraControls() : renderViewControl()}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-gray-300 rounded-md overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                {columns.map((column, index) => (
                  !column.hidden && (
                    <th 
                      key={index} 
                      className="font-semibold text-gray-700 py-3 md:py-4 px-2 md:px-6 text-xs md:text-sm text-left"
                    >
                      {column.header}
                    </th>
                  )
                ))}
                {renderActions && (
                  <th className="font-semibold text-gray-700 py-3 md:py-4 px-2 md:px-6 text-xs md:text-sm text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {displayData.length > 0 ? (
                displayData.map((row) => (
                  <tr key={row[idKey as keyof T]} className="group border-b border-gray-200 hover:bg-gray-50">
                    {columns.map((column, columnIndex) => (
                      !column.hidden && (
                        <td 
                          key={columnIndex} 
                          className="py-2 md:py-4 px-2 md:px-6 text-xs md:text-sm"
                        >
                          {column.render ? column.render(row) : String(row[column.key as keyof T])}
                        </td>
                      )
                    ))}
                    {renderActions && (
                      <td className="py-2 md:py-4 px-2 md:px-6 text-xs md:text-sm relative">
                        {renderActions(row, toggleRowActions, activeRow)}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={columns.filter(col => !col.hidden).length + (renderActions ? 1 : 0)} 
                    className="py-6 text-center text-xs md:text-sm text-gray-500"
                  >
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Section */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </>
  );
}

export default DataTable;