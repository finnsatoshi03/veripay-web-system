import { useState, useEffect } from "react";

import { Search } from "@/components/custom/search";
import { ColumnToggle } from "@/components/custom/table/column-toggle";
import { Pagination } from "@/components/custom/table/pagination";

import {
  PAYROLL_TABLE_COLUMNS,
  PayrollPeriodsTable,
} from "./payroll-periods-table";
import { PayrollStatusFilter, payrollStatusOptions } from "./payroll-status-filter";

import type { PayrollPeriod, PayrollStatus } from "../lib/data";
// import { usePayrollPeriods } from "../mutations/payroll-service"; 
import { mockPayrollPeriods } from "../lib/data"; // New import
import { Error } from "@/features/error";

export const PayrollManagementBoard = () => {
  // React Query hooks
  // const { data: payrolls = [], isLoading, error } = usePayrollPeriods();
  const payrolls = mockPayrollPeriods;
  const isLoading = false;
  const error = null;

  const [filteredPayrolls, setFilteredPayrolls] = useState<PayrollPeriod[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<PayrollStatus[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "period",
    "status",
    "employeeCount",
    "totalGross",
    "totalDeductions",
    "totalNet",
    "actions",
  ]);

  // Initialize filtered payrolls when data is loaded
  useEffect(() => {
    if (payrolls) {
      // Apply current filters to the data
      let filtered = [...payrolls];

      // Apply status filter
      if (selectedStatuses.length > 0) {
        filtered = filtered.filter((payroll) =>
          selectedStatuses.includes(payroll.status),
        );
      }

      // Apply search filter
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filtered = filtered.filter((payroll) =>
          payroll.period.toLowerCase().includes(lowerQuery),
        );
      }

      setFilteredPayrolls(filtered);
    }
  }, [payrolls, searchQuery, selectedStatuses]);

  // Update status counts
  useEffect(() => {
    const counts: Record<PayrollStatus, number> = {
      processed: 0,
      processing: 0,
      scheduled: 0,
    };

    payrolls.forEach((payroll) => {
      if (payroll.status in counts) {
        counts[payroll.status as keyof typeof counts]++;
      }
    });

    payrollStatusOptions.forEach((option) => {
      const status = option.value as PayrollStatus;
      option.count = counts[status];
    });
  }, [payrolls]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayrolls.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleStatusFilterChange = (statuses: PayrollStatus[]) => {
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
      <div className="flex h-full items-center justify-center">
        Loading payroll periods...
      </div>
    );
  }

  if (error) {
    return (
      <Error
        // title={`Error loading payroll periods: ${error instanceof Error ? error.message : "Unknown error"}`}
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
              placeholder="Search payroll details"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <PayrollStatusFilter
              selectedStatuses={selectedStatuses}
              onChange={handleStatusFilterChange}
            />
          </div>
          <div>
            <ColumnToggle
              columns={PAYROLL_TABLE_COLUMNS}
              visibleColumns={visibleColumns}
              onColumnToggle={handleColumnToggle}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-md border">
        <PayrollPeriodsTable
          payrolls={currentItems}
          visibleColumns={visibleColumns}
        />
      </div>

      <Pagination
        totalItems={filteredPayrolls.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};