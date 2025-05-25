import { useState, useEffect, useMemo } from "react";
import { Search } from "@/components/custom/search";
import { ColumnToggle } from "@/components/custom/table/column-toggle";
import { Pagination } from "@/components/custom/table/pagination";

import {
  ActiveEmployeeTable,
  EMPLOYEE_TABLE_COLUMNS,
} from "./active-employee-table";
import { StatusFilter, statusOptions } from "./status-filter";

import type { EmployeeStatus } from "../lib/helpers";
import { transformToActiveEmployee } from "../lib/helpers";
import { useActiveEmployees } from "../mutations/useActiveEmployees";
import { Error } from "@/features/error";
import { Skeleton } from "@/components/ui/skeleton";

interface ActiveEmployeeBoardProps {
  isLoading?: boolean;
}

export default function ActiveEmployeeBoard({
  isLoading: externalLoading,
}: ActiveEmployeeBoardProps) {
  // React Query hook
  const { data, isLoading: queryLoading, error } = useActiveEmployees();

  // Use external loading prop if provided, otherwise use query loading
  const isLoading = externalLoading ?? queryLoading;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<EmployeeStatus[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "name",
    "department",
    "timeIn",
    "timeOut",
    "status",
    "actions",
  ]);

  // Transform service employees to UI employees with memoization
  const employees = useMemo(() => {
    if (!data?.employees) return [];
    return data.employees.map(transformToActiveEmployee);
  }, [data?.employees]);

  // Filter employees with memoization for performance
  const filteredEmployees = useMemo(() => {
    let filtered = [...employees];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (employee) =>
          employee.name.toLowerCase().includes(lowerQuery) ||
          employee.department.toLowerCase().includes(lowerQuery) ||
          employee.employeeCode.toLowerCase().includes(lowerQuery),
      );
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((employee) =>
        selectedStatuses.includes(employee.status),
      );
    }

    return filtered;
  }, [employees, searchQuery, selectedStatuses]);

  // Update status counts with memoization
  const statusCounts = useMemo(() => {
    const counts: Record<EmployeeStatus, number> = {
      "On time": 0,
      Late: 0,
      "On leave": 0,
      Absent: 0,
    };

    employees.forEach((employee) => {
      if (employee.status in counts) {
        counts[employee.status as keyof typeof counts]++;
      }
    });

    return counts;
  }, [employees]);

  // Update status options with counts
  useEffect(() => {
    statusOptions.forEach((option) => {
      const status = option.value as EmployeeStatus;
      option.count = statusCounts[status] || 0;
    });
  }, [statusCounts]);

  // Pagination calculations with memoization
  const paginatedEmployees = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredEmployees, currentPage, itemsPerPage]);

  // handlers
  const handleStatusFilterChange = (statuses: EmployeeStatus[]) => {
    setSelectedStatuses(statuses);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  };

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId],
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col space-y-4">
        <div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-1 items-center gap-4">
              <Search
                size="sm"
                placeholder="Search active employee"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <StatusFilter
                selectedStatuses={selectedStatuses}
                onChange={handleStatusFilterChange}
              />
            </div>
            <div>
              <ColumnToggle
                columns={EMPLOYEE_TABLE_COLUMNS}
                visibleColumns={visibleColumns}
                onColumnToggle={handleColumnToggle}
                primaryColumnId="name"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-md border">
          <div className="w-full">
            <div className="sticky top-0 z-20 bg-zinc-200 dark:bg-zinc-800">
              <div className="flex border-b">
                {EMPLOYEE_TABLE_COLUMNS.filter((col) =>
                  visibleColumns.includes(col.id),
                ).map((column) => (
                  <div
                    key={column.id}
                    className={`px-4 py-3 text-left text-sm font-medium ${
                      column.id === "actions"
                        ? "w-[100px]"
                        : column.id === "name"
                          ? "min-w-[350px]"
                          : "flex-1"
                    }`}
                  >
                    {column.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="divide-y">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="hover:bg-muted/50 flex items-center">
                  {visibleColumns.includes("name") && (
                    <div className="min-w-[350px] flex-1 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  )}
                  {visibleColumns.includes("department") && (
                    <div className="flex-1 px-4 py-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  )}
                  {visibleColumns.includes("timeIn") && (
                    <div className="flex-1 px-4 py-2">
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  )}
                  {visibleColumns.includes("timeOut") && (
                    <div className="flex-1 px-4 py-2">
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  )}
                  {visibleColumns.includes("status") && (
                    <div className="flex-1 px-4 py-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  )}
                  {visibleColumns.includes("actions") && (
                    <div className="w-[100px] px-4 py-2">
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Error
        title="Error loading active employees"
        message={
          error instanceof Error ? error.message : "Unknown error occurred"
        }
      />
    );
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      <div>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-1 items-center gap-4">
            <Search
              size="sm"
              placeholder="Search active employee"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <StatusFilter
              selectedStatuses={selectedStatuses}
              onChange={handleStatusFilterChange}
            />
          </div>
          <div>
            <ColumnToggle
              columns={EMPLOYEE_TABLE_COLUMNS}
              visibleColumns={visibleColumns}
              onColumnToggle={handleColumnToggle}
              primaryColumnId="name"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-md border">
        <ActiveEmployeeTable
          employees={paginatedEmployees}
          visibleColumns={visibleColumns}
        />
      </div>

      <Pagination
        totalItems={filteredEmployees.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}
