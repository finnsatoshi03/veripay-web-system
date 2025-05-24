import { useState } from "react";
import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ColumnToggle, type ColumnDef } from "./column-toggle";
import { Pagination } from "./pagination";

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef[];
  keyField: keyof T;
  renderRow: (item: T, visibleColumns: string[]) => ReactNode;
  renderEmptyState?: (colSpan: number) => ReactNode;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  initialVisibleColumns?: string[];
  onVisibleColumnsChange?: (columns: string[]) => void;
  headerClassName?: string;
  primaryColumnId?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyField,
  renderRow,
  renderEmptyState,
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  initialVisibleColumns,
  onVisibleColumnsChange,
  headerClassName = "sticky top-0 bg-zinc-200 dark:bg-zinc-800",
  primaryColumnId = "name",
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialPageSize);

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    initialVisibleColumns || columns.map((col) => col.id),
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  };

  const handleColumnToggle = (columnId: string) => {
    const updatedColumns = visibleColumns.includes(columnId)
      ? visibleColumns.filter((id) => id !== columnId)
      : [...visibleColumns, columnId];

    setVisibleColumns(updatedColumns);

    if (onVisibleColumnsChange) {
      onVisibleColumnsChange(updatedColumns);
    }
  };

  // Filter columns by visibility
  const filteredColumns = columns.filter((col) =>
    visibleColumns.includes(col.id),
  );

  const getColSpan = () => filteredColumns.length || 1;

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex justify-end">
        <ColumnToggle
          columns={columns}
          visibleColumns={visibleColumns}
          onColumnToggle={handleColumnToggle}
          primaryColumnId={primaryColumnId}
        />
      </div>

      <div className="flex-1 overflow-auto rounded-md border">
        <Table>
          <TableHeader className={headerClassName}>
            <TableRow>
              {filteredColumns.map((column) => (
                <TableHead
                  key={column.id}
                  className={column.id === "actions" ? "w-[100px]" : ""}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={getColSpan()} className="h-24 text-center">
                  {renderEmptyState
                    ? renderEmptyState(getColSpan())
                    : "No data found."}
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((item) => (
                <TableRow
                  key={String(item[keyField])}
                  className="hover:bg-border/50"
                >
                  {renderRow(item, visibleColumns)}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
}
