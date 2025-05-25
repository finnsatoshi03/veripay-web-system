import { useState, useEffect, useMemo } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

import { Search } from "@/components/custom/search";
import { ColumnToggle } from "@/components/custom/table/column-toggle";
import { Pagination } from "@/components/custom/table/pagination";
import { Skeleton } from "@/components/ui/skeleton";

import {
  ACCOUNT_TABLE_COLUMNS,
  AccountRequestsTable,
} from "./account-requests-table";
import { StatusFilter } from "./status-filter";

import type { AccountRequest, RequestStatus } from "../lib/data";
import { useAccountRequests } from "../mutations/account-req-service";
import { Error } from "@/features/error";

const baseStatusOptions = [
  {
    label: "Pending",
    value: "pending",
    icon: Clock,
    count: 0,
  },
  {
    label: "Approved",
    value: "approved",
    icon: CheckCircle2,
    count: 0,
  },
  {
    label: "Rejected",
    value: "rejected",
    icon: XCircle,
    count: 0,
  },
];

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

  const stableRequests = useMemo(() => {
    if (isLoading) return [];
    return Array.isArray(requests) ? requests : [];
  }, [requests, isLoading]);

  const statusOptionsWithCounts = useMemo(() => {
    const counts: Record<RequestStatus, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    stableRequests.forEach((request) => {
      if (request.status in counts) {
        counts[request.status as keyof typeof counts]++;
      }
    });

    return baseStatusOptions.map((option) => ({
      ...option,
      count: counts[option.value as RequestStatus] || 0,
    }));
  }, [stableRequests]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    let filtered = stableRequests.slice(); // Create a copy

    // Apply status filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((request) =>
        selectedStatuses.includes(request.status),
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (request) =>
          request.name.toLowerCase().includes(lowerQuery) ||
          request.email.toLowerCase().includes(lowerQuery),
      );
    }

    setFilteredRequests(filtered);
  }, [stableRequests, searchQuery, selectedStatuses, isLoading]);

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
                placeholder="Search by name or email"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <StatusFilter
                selectedStatuses={selectedStatuses}
                onChange={handleStatusFilterChange}
                statusOptions={statusOptionsWithCounts}
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
          <div className="w-full">
            <div className="sticky top-0 bg-zinc-200 dark:bg-zinc-800">
              <div className="flex border-b">
                {ACCOUNT_TABLE_COLUMNS.filter((col) =>
                  visibleColumns.includes(col.id),
                ).map((column) => (
                  <div
                    key={column.id}
                    className={`px-2 py-2.5 text-left text-sm font-medium ${
                      column.id === "actions" ? "w-[100px]" : "flex-1"
                    }`}
                  >
                    {column.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="divide-y">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="hover:bg-border/50 flex items-center">
                  {visibleColumns.includes("name") && (
                    <div className="flex-1 px-2 py-1">
                      <Skeleton className="h-4 w-32" />
                    </div>
                  )}
                  {visibleColumns.includes("email") && (
                    <div className="flex-1 px-2 py-1">
                      <Skeleton className="h-4 w-40" />
                    </div>
                  )}
                  {visibleColumns.includes("requestDate") && (
                    <div className="flex-1 px-2 py-1">
                      <Skeleton className="h-4 w-24" />
                    </div>
                  )}
                  {visibleColumns.includes("status") && (
                    <div className="flex-1 px-2 py-1">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  )}
                  {visibleColumns.includes("actions") && (
                    <div className="w-[100px] px-2 py-1">
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
              statusOptions={statusOptionsWithCounts}
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
