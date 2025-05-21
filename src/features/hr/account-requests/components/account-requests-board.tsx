import { useState, useEffect } from "react";

import { Search } from "@/components/custom/search";
import { ColumnToggle } from "@/components/custom/table/column-toggle";
import { Pagination } from "@/components/custom/table/pagination";

import {
  ACCOUNT_TABLE_COLUMNS,
  AccountRequestsTable,
} from "./account-requests-table";
import { StatusFilter, statusOptions } from "./status-filter";

import type { AccountRequest, RequestStatus } from "../lib/data";
import { useAccountRequests } from "../mutations/account-req-service";
import { Error } from "@/features/error";

export const AccountRequestsBoard = () => {
  // React Query hooks
  const { data: requests = [], isLoading, error } = useAccountRequests();

  const [filteredRequests, setFilteredRequests] = useState<AccountRequest[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<RequestStatus[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "name",
    "email",
    "requestDate",
    "status",
    "actions",
  ]);

  // Initialize filtered requests when data is loaded
  useEffect(() => {
    if (requests) {
      setFilteredRequests(requests);
      applyFilters(requests, searchQuery, selectedStatuses);
    }
  }, [requests, searchQuery, selectedStatuses]);

  // Update status counts
  useEffect(() => {
    const counts: Record<RequestStatus, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    requests.forEach((request) => {
      if (request.status in counts) {
        counts[request.status as keyof typeof counts]++;
      }
    });

    statusOptions.forEach((option) => {
      const status = option.value as RequestStatus;
      option.count = counts[status];
    });
  }, [requests]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleStatusFilterChange = (statuses: RequestStatus[]) => {
    setSelectedStatuses(statuses);
    setCurrentPage(1);
    applyFilters(requests, searchQuery, statuses);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    applyFilters(requests, query, selectedStatuses);
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

  const applyFilters = (
    allRequests: AccountRequest[],
    query: string,
    statuses: RequestStatus[],
  ) => {
    let filtered = [...allRequests];

    // Apply status filter
    if (statuses.length > 0) {
      filtered = filtered.filter((request) =>
        statuses.includes(request.status),
      );
    }

    // Apply search filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.name.toLowerCase().includes(lowerQuery) ||
          request.email.toLowerCase().includes(lowerQuery),
      );
    }

    setFilteredRequests(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading account requests...
      </div>
    );
  }

  if (error) {
    return (
      <Error
        title={`Error loading account requests: ${error instanceof Error ? error.message : "Unknown error"}`}
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
              placeholder="Search by name or email"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <StatusFilter
              selectedStatuses={selectedStatuses}
              onChange={handleStatusFilterChange}
            />
          </div>
          <div>
            <ColumnToggle
              columns={ACCOUNT_TABLE_COLUMNS}
              visibleColumns={visibleColumns}
              onColumnToggle={handleColumnToggle}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-md border">
        <AccountRequestsTable
          requests={currentItems}
          visibleColumns={visibleColumns}
        />
      </div>

      <Pagination
        totalItems={filteredRequests.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};
