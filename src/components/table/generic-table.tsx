import { useState, useEffect, useMemo, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Check, Filter } from "lucide-react";
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
import React from "react";
import { Search } from "../custom/search";

// Define generic interfaces
export interface Column<T> {
  key: Extract<keyof T, string>;
  header: string;
  hidden?: boolean;
  width?: string;
  renderCell?: (item: T) => React.ReactNode;
}

export interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchPlaceholder?: string;
  showActions?: boolean;
  actionsWidth?: string; // Added property for actions column width
  renderActions?: (item: T) => React.ReactNode;
  onSearch?: (query: string) => void;
  customFilters?: React.ReactNode;
  rowsPerPageOptions?: number[];
  initialRowsPerPage?: number;
}

export default function GenericTable<T extends { id?: string | number }>({
  data,
  columns: initialColumns,
  searchPlaceholder = "Search...",
  showActions = false,
  actionsWidth = "120px", // Default width for actions column
  renderActions,
  onSearch,
  customFilters,
  rowsPerPageOptions = [10, 25, 50, 100],
  initialRowsPerPage = 10,
}: GenericTableProps<T>) {
  // State management
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState(initialColumns.map(col => ({ ...col, hidden: col.hidden || false })));

  // Memoized columns
  const visibleColumns = useMemo(() =>
    columns.filter(col => !col.hidden),
    [columns]
  );

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (onSearch || !searchQuery) return data;

    return data.filter((item) => {
      return Object.entries(item).some(([_, value]) => {
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [data, searchQuery, onSearch]);

  // Memoized pagination calculations
  const { totalPages, startItem, endItem, useScrollableTable } = useMemo(() => {
    const total = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    const start = filteredData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(currentPage * rowsPerPage, filteredData.length);
    const useScroll = rowsPerPage >= 50;

    return {
      totalPages: total,
      startItem: start,
      endItem: end,
      useScrollableTable: useScroll
    };
  }, [filteredData.length, rowsPerPage, currentPage]);

  // Memoized display data
  const displayData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  // Reset to page 1 when search or rows per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, rowsPerPage]);

  // Ensure currentPage doesn't exceed totalPages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Search handler
  useEffect(() => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  }, [searchQuery, onSearch]);

  // Sync with initialColumns changes - memoized to prevent unnecessary updates
  useEffect(() => {
    const mappedColumns = initialColumns.map(col => ({ ...col, hidden: col.hidden || false }));
    setColumns(mappedColumns);
  }, [initialColumns]);

  // Memoized callbacks
  const goPrev = useCallback(() => setCurrentPage(p => Math.max(1, p - 1)), []);
  const goNext = useCallback(() => setCurrentPage(p => Math.min(totalPages, p + 1)), [totalPages]);

  // Get page numbers to display - memoized
  const pageNumbers = useMemo(() => {
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
  }, [totalPages, currentPage]);

  const handleRowsPerPageChange = useCallback((value: string) => {
    setRowsPerPage(parseInt(value));
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const toggleColumnVisibility = useCallback((key: string) => {
    setColumns(prev =>
      prev.map(col => (col.key === key ? { ...col, hidden: !col.hidden } : col))
    );
  }, []);

  // Memoized table header row to prevent re-rendering
  const tableHeaderRow = useMemo(() => (
    <TableRow className="border-b border-gray-300">
      {visibleColumns.map((column) => (
        <TableHead
          key={column.key}
          className="font-semibold text-gray-700 py-4 px-6 text-sm"
          style={{ width: column.width || "auto" }}
        >
          {column.header}
        </TableHead>
      ))}
      {showActions && (
        <TableHead
          className="font-semibold text-gray-700 py-4 px-6 text-sm text-center"
          style={{ width: actionsWidth }}
        >
          Actions
        </TableHead>
      )}
    </TableRow>
  ), [visibleColumns, showActions, actionsWidth]);

  // Custom trigger component to match the look of the original button
  const CustomSelectTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof SelectTrigger>>(
    ({ className, children, ...props }, ref) => (
      <SelectTrigger
        ref={ref}
        className={`px-3 py-1 border border-gray-300 rounded-md text-gray-700 flex items-center justify-between ${className}`}
        {...props}
      >
        <div className="flex items-center">
          <Filter className="w-4 h-4 mr-1" />
          View
        </div>
        {children}
      </SelectTrigger>
    )
  );
  CustomSelectTrigger.displayName = "CustomSelectTrigger";

  return (
    <div className="w-full">
      {/* Search and View Controls */}
      <div className="flex justify-between items-center my-4">
        <Search
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={handleSearchChange}
          size="default"
          className="w-80 text-sm"
        />

        <div className="flex items-center space-x-4">
          {customFilters}

          <span className="text-sm text-gray-500">
            Showing {filteredData.length > 0 ? startItem : 0}-{endItem} of {filteredData.length}
          </span>

          <div className="relative">
            <Select>
              <CustomSelectTrigger />
              <SelectContent className="min-w-40 mr-5 bg-gray-200 shadow-lg rounded-md border border-gray-300 z-20">
                <div className="py-2 px-3 border-b border-gray-300 font-medium text-sm">
                  Toggle columns
                </div>
                <div className="py-1">
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      onClick={() => toggleColumnVisibility(column.key)}
                      className="px-3 py-2 text-sm w-full text-left flex items-center justify-between hover:bg-gray-300 cursor-pointer"
                    >
                      <span>{column.header}</span>
                      <span className="flex items-center justify-center w-5 h-5">
                        {!column.hidden && <Check size={16} />}
                      </span>
                    </div>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border border-gray-300 rounded-md overflow-hidden">
        {useScrollableTable ? (
          <div className="w-full">
            {/* Table with fixed layout to ensure columns align properly */}
            <Table className="w-full table-fixed">
              <TableHeader>{tableHeaderRow}</TableHeader>
            </Table>

            {/* Scrollable body with matching column widths */}
            <ScrollArea className="w-full h-132">
              <Table className="w-full table-fixed">
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length + (showActions ? 1 : 0)}
                        className="py-6 text-center text-gray-500"
                      >
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : displayData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length + (showActions ? 1 : 0)}
                        className="py-6 text-center text-gray-500"
                      >
                        No matching records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayData.map((row) => (
                      <TableRow key={row.id || Math.random().toString()}>
                        {visibleColumns.map((column) => {
                          const key = column.key;
                          const width = column.width || "auto";
                          return column.renderCell ? (
                            <TableCell key={key} className="py-4 px-6" style={{ width }}>
                              {column.renderCell(row)}
                            </TableCell>
                          ) : (
                            <TableCell key={key} className="py-4 px-6 truncate" style={{ width }}>
                              {String(row[key] || "")}
                            </TableCell>
                          );
                        })}
                        {showActions && (
                          <TableCell className="py-4 px-6" style={{ width: actionsWidth }}>
                            <div className="flex justify-center space-x-4">
                              {renderActions ? renderActions(row) : (
                                <>
                                  <button className="hover:text-red-600"><X size={16} /></button>
                                  <button className="hover:text-green-600"><Check size={16} /></button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        ) : (
          /* Regular table for fewer rows */
          <Table className="w-full table-fixed">
            <TableHeader>{tableHeaderRow}</TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length + (showActions ? 1 : 0)}
                    className="py-6 text-center text-gray-500"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : displayData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length + (showActions ? 1 : 0)}
                    className="py-6 text-center text-gray-500"
                  >
                    No matching records found
                  </TableCell>
                </TableRow>
              ) : (
                displayData.map((row) => (
                  <TableRow key={row.id || Math.random().toString()}>
                    {visibleColumns.map((column) => {
                      const key = column.key;
                      const width = column.width || "auto";
                      return column.renderCell ? (
                        <TableCell key={key} className="py-4 px-6" style={{ width }}>
                          {column.renderCell(row)}
                        </TableCell>
                      ) : (
                        <TableCell key={key} className="py-4 px-6 truncate" style={{ width }}>
                          {String(row[key] || "")}
                        </TableCell>
                      );
                    })}
                    {showActions && (
                      <TableCell className="py-4 px-6" style={{ width: actionsWidth }}>
                        <div className="flex justify-center space-x-4">
                          {renderActions ? renderActions(row) : (
                            <>
                              <button className="hover:text-red-600"><X size={16} /></button>
                              <button className="hover:text-green-600"><Check size={16} /></button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination Section */}
      <div className="flex justify-between items-center mt-10 py-3 px-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">Rows per page:</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={handleRowsPerPageChange}
          >
            <SelectTrigger className="w-16 h-8">
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
              {pageNumbers.map((page) => (
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