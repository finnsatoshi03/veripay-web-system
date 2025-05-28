import { useState, useEffect, useMemo } from "react";
import { Search } from "@/components/custom/search";
import { ColumnToggle } from "@/components/custom/table/column-toggle";
import { Pagination } from "@/components/custom/table/pagination";

import {
  EmployeePayslipsTable,
  PAYSLIP_TABLE_COLUMNS,
} from "./employee-payslips-table";
import { StatusFilter, statusOptions } from "./status-filter";
import { PayslipDetailsDialog } from "./payslip-details-sheet";

import { usePayslips } from "../mutations/payslips-service";
import { useUser } from "@/store/userStore";
import { Error } from "@/features/error";

import type { PayslipData } from "@/services/employee/payslips";

export default function EmployeePayslipsBoard() {
  const { employeeId } = useUser();

  // Fetch payslips data
  const {
    data: payslipsResponse,
    isLoading,
    error,
  } = usePayslips({
    employeeId: employeeId || undefined,
    page: 1,
    limit: 100, // Get all payslips for client-side filtering
  });

  const [filteredPayslips, setFilteredPayslips] = useState<PayslipData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "period",
    "netPay",
    "status",
    "datePaid",
    "actions",
  ]);
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipData | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Memoize payslips data transformation
  const payslips = useMemo(() => {
    // Type assertion to handle the mismatch between interface and actual API response
    return (payslipsResponse?.data || []) as unknown as PayslipData[];
  }, [payslipsResponse]);

  // Initialize filtered payslips when data is loaded
  useEffect(() => {
    if (payslips.length > 0) {
      let filtered = [...payslips];

      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filtered = filtered.filter((payslip) => {
          // Handle the correct data structure - single objects, not arrays
          const payroll = payslip.payrolls;
          const employee = payslip.employees;

          // Improved period logic with better fallbacks
          let period = "";

          if (payroll?.period_start && payroll?.period_end) {
            period = `${payroll.period_start} - ${payroll.period_end}`;
          } else {
            // Fallback: try to derive period from issued_at date
            const issuedDate = new Date(payslip.issued_at);
            const year = issuedDate.getFullYear();
            const month = issuedDate.getMonth();
            const periodStart = new Date(year, month, 1);
            const periodEnd = new Date(year, month + 1, 0);
            period = `${periodStart.toISOString().split("T")[0]} - ${periodEnd.toISOString().split("T")[0]}`;
          }

          const employeeCode = employee?.employee_code || "";

          return (
            period.toLowerCase().includes(lowerQuery) ||
            employeeCode.toLowerCase().includes(lowerQuery)
          );
        });
      }

      if (selectedStatuses.length > 0) {
        filtered = filtered.filter((payslip) =>
          selectedStatuses.includes(payslip.status),
        );
      }

      setFilteredPayslips(filtered);
    } else {
      setFilteredPayslips([]);
    }
  }, [payslips, searchQuery, selectedStatuses]);

  // Update status counts
  useEffect(() => {
    const counts: Record<string, number> = {
      paid: 0,
      generated: 0,
      draft: 0,
    };

    payslips.forEach((payslip) => {
      const status = payslip.status.toLowerCase();
      if (status in counts) {
        counts[status]++;
      }
    });

    statusOptions.forEach((option) => {
      const status = option.value.toLowerCase();
      option.count = counts[status] || 0;
    });
  }, [payslips]);

  // Pagination calculations with memoization
  const paginatedData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredPayslips.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredPayslips, currentPage, itemsPerPage]);

  const handleStatusFilterChange = (statuses: string[]) => {
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

  const handlePayslipClick = (payslip: PayslipData) => {
    setSelectedPayslip(payslip);
    setIsSheetOpen(true);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setSelectedPayslip(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading payslips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <Error title="Error loading payslips" />;
  }

  return (
    <>
      <div className="flex h-full flex-col space-y-4">
        <div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-1 items-center gap-4">
              <Search
                size="sm"
                placeholder="Search payroll details"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <StatusFilter
                selectedStatuses={selectedStatuses}
                onChange={handleStatusFilterChange}
              />
            </div>
            <div>
              <ColumnToggle
                columns={PAYSLIP_TABLE_COLUMNS}
                visibleColumns={visibleColumns}
                onColumnToggle={handleColumnToggle}
                primaryColumnId="period"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-md border">
          <EmployeePayslipsTable
            payslips={paginatedData}
            visibleColumns={visibleColumns}
            onPayslipClick={handlePayslipClick}
          />
        </div>

        <Pagination
          totalItems={filteredPayslips.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      <PayslipDetailsDialog
        payslip={selectedPayslip}
        open={isSheetOpen}
        onOpenChange={handleSheetClose}
      />
    </>
  );
}
