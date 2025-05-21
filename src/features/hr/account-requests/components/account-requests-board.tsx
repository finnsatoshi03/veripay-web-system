import { useState, useEffect } from "react";

import { Search } from "@/components/custom/search";
import { ColumnToggle } from "@/components/custom/table/column-toggle";
import { Pagination } from "@/components/custom/table/pagination";

import {
  ACCOUNT_TABLE_COLUMNS,
  AccountRequestsTable,
} from "./account-requests-table";
import { StatusFilter, statusOptions } from "./status-filter";

import { mockAccountRequests } from "../lib/data";
import type { AccountRequest, RequestStatus } from "../lib/data";

export const AccountRequestsBoard = () => {
  const [requests, setRequests] =
    useState<AccountRequest[]>(mockAccountRequests);
  const [filteredRequests, setFilteredRequests] =
    useState<AccountRequest[]>(mockAccountRequests);
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

  // Update status counts
  useEffect(() => {
    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    requests.forEach((request) => {
      counts[request.status]++;
    });

    statusOptions.forEach((option) => {
      option.count = counts[option.value as RequestStatus];
    });
  }, [requests]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleStatusChange = (requestId: string, newStatus: RequestStatus) => {
    const updatedRequests = requests.map((request) =>
      request.id === requestId ? { ...request, status: newStatus } : request,
    );
    setRequests(updatedRequests);
    applyFilters(updatedRequests, searchQuery, selectedStatuses);
  };

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
          onStatusChange={handleStatusChange}
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
