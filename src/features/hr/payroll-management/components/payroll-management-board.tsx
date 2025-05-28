import { useState, useEffect, useMemo } from "react";

import { Search } from "@/components/custom/search";
import { ColumnToggle } from "@/components/custom/table/column-toggle";
import { Pagination } from "@/components/custom/table/pagination";

import {
  PAYROLL_TABLE_COLUMNS,
  PayrollPeriodsTable,
} from "./payroll-periods-table";
import { PayrollStatusFilter } from "./payroll-status-filter";

import type { PayrollPeriod, PayrollStatus } from "../lib/data";
import { usePayrollSummary } from "../mutations/payroll-service";
import { Error } from "@/features/error";

export const PayrollManagementBoard = () => {
  // React Query hooks
  const { data: payrollData, isLoading, error } = usePayrollSummary();

  // Transform service data to table format using useMemo for performance
  const payrolls = useMemo((): PayrollPeriod[] => {
    if (!payrollData?.data) return [];

    return payrollData.data.map((payroll) => {
      let uiStatus: PayrollStatus;

      if (payroll.status === "approved") {
        uiStatus = "processed";
      } else if (payroll.status === "scheduled") {
        uiStatus = "scheduled";
      } else {
        uiStatus = "processing";
      }

      return {
        id: payroll.id.toString(),
        period: payroll.period_formatted,
        status: uiStatus,
        employeeCount: payroll.total_employees || payroll.payslips.length,
        totalGross: payroll.total_gross_pay || 0,
        totalDeductions: payroll.total_deductions || 0,
        totalNet: payroll.total_net_pay || 0,
        startDate: payroll.period_start,
        endDate: payroll.period_end,
        // Add raw data for dialog
        rawData: payroll,
      };
    });
  }, [payrollData]);

  // Calculate status counts using useMemo
  const statusCounts = useMemo(() => {
    const counts: Record<PayrollStatus, number> = {
      processed: 0,
      processing: 0,
      scheduled: 0,
    };

    payrolls.forEach((payroll) => {
      if (payroll.status in counts) {
        counts[payroll.status]++;
      }
    });

    return counts;
  }, [payrolls]);

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

  // Apply filters using useMemo for performance
  const filteredData = useMemo(() => {
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

    return filtered;
  }, [payrolls, searchQuery, selectedStatuses]);

  // Update filtered payrolls when filters change
  useEffect(() => {
    setFilteredPayrolls(filteredData);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredData]);

  // Pagination calculations using useMemo
  const paginatedData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredPayrolls.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredPayrolls, currentPage, itemsPerPage]);

  const handleStatusFilterChange = (statuses: PayrollStatus[]) => {
    setSelectedStatuses(statuses);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
        <div className="text-center">
          <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading payroll periods...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Error
        title={`Error loading payroll periods: ${error instanceof Error ? error.message : "Unknown error"}`}
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
              statusCounts={statusCounts}
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
          payrolls={paginatedData}
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
