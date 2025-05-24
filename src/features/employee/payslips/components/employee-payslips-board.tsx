import { useState, useEffect } from "react";
import { Search } from "@/components/custom/search";
import { ColumnToggle } from "@/components/custom/table/column-toggle";
import { Pagination } from "@/components/custom/table/pagination";

import {
  EmployeePayslipsTable,
  PAYSLIP_TABLE_COLUMNS,
} from "./employee-payslips-table";
import { StatusFilter, statusOptions } from "./status-filter";

import type { EmployeePayslip, PayslipStatus } from "../lib/data";
import { mockEmployeePayslips } from "../lib/data";
import { Error } from "@/features/error";

export default function EmployeePayslipsBoard() {
  const payslips = mockEmployeePayslips;
  const isLoading = false;
  const error = null;

  const [filteredPayslips, setFilteredPayslips] = useState<EmployeePayslip[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<PayslipStatus[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "period",
    "netPay",
    "status",
    "datePaid",
    "actions",
  ]);

  // Initialize filtered payslips when data is loaded
  useEffect(() => {
    if (payslips) {
      let filtered = [...payslips];

      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filtered = filtered.filter((payslip) =>
          payslip.period.toLowerCase().includes(lowerQuery)
        );
      }

      if (selectedStatuses.length > 0) {
        filtered = filtered.filter((payslip) =>
          selectedStatuses.includes(payslip.status)
        );
      }

      setFilteredPayslips(filtered);
    }
  }, [payslips, searchQuery, selectedStatuses]);

  // Update status counts
  useEffect(() => {
    const counts: Record<PayslipStatus, number> = {
      "Paid": 0,
      "Generated": 0,
      "Voided": 0,
    };

    payslips.forEach((payslip) => {
      if (payslip.status in counts) {
        counts[payslip.status as keyof typeof counts]++;
      }
    });

    statusOptions.forEach((option) => {
      const status = option.value as PayslipStatus;
      option.count = counts[status] || 0;
    });
  }, [payslips]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayslips.slice(indexOfFirstItem, indexOfLastItem);

  const handleStatusFilterChange = (statuses: PayslipStatus[]) => {
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
        : [...prev, columnId]
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading payslips...
      </div>
    );
  }

  if (error) {
    return <Error />;
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
          payslips={currentItems}
          visibleColumns={visibleColumns}
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
  );
}