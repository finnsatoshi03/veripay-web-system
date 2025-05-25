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

export default function ActiveEmployeeBoard() {
  // React Query hook
  const { data, isLoading, error } = useActiveEmployees();

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
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-1 items-center gap-4">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-9 w-32" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="flex-1 overflow-auto rounded-md border">
          <div className="p-8">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
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
