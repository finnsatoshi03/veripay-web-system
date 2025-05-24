import { useState, useEffect } from "react";
import { Search } from "@/components/custom/search";
import { ColumnToggle } from "@/components/custom/table/column-toggle";
import { Pagination } from "@/components/custom/table/pagination";

import { ActiveEmployeeTable, EMPLOYEE_TABLE_COLUMNS } from "./active-employee-table";
import { StatusFilter, statusOptions } from "./status-filter";

import type { ActiveEmployee, EmployeeStatus } from "../lib/data";
// import { useActiveEmployees } from "../mutations/employee-service"; 
import { mockActiveEmployees } from "../lib/data"; // New import
import { Error } from "@/features/error";

export default function ActiveEmployeeBoard() {
    // React Query hooks
    // const { data: employees = [], isLoading, error } = useActiveEmployees();
    const employees = mockActiveEmployees;
    const isLoading = false;
    const error = null;

    const [filteredEmployees, setFilteredEmployees] = useState<ActiveEmployee[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatuses, setSelectedStatuses] = useState<EmployeeStatus[]>([]);
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

    // Initialize filtered employees when data is loaded
    useEffect(() => {
        if (employees) {
            let filtered = [...employees];

            if (searchQuery) {
                const lowerQuery = searchQuery.toLowerCase();
                filtered = filtered.filter((employee) =>
                    employee.name.toLowerCase().includes(lowerQuery) ||
                    employee.department.toLowerCase().includes(lowerQuery)
                );
            }

            if (selectedStatuses.length > 0) {
                filtered = filtered.filter((employee) =>
                    selectedStatuses.includes(employee.status)
                );
            }

            setFilteredEmployees(filtered);
        }
    }, [employees, searchQuery, selectedStatuses]);

    // Update status counts
    useEffect(() => {
        const counts: Record<EmployeeStatus, number> = {
            "On time": 0,
            "Late": 0,
            "On leave": 0,
        };

        employees.forEach((employee) => {
            if (employee.status in counts) {
                counts[employee.status as keyof typeof counts]++;
            }
        });

        statusOptions.forEach((option) => {
            const status = option.value as EmployeeStatus;
            option.count = counts[status] || 0;
        });
    }, [employees]);

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEmployees.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

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
                : [...prev, columnId]
        );
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                Loading active employees...
            </div>
        );
    }

    if (error) {
        return (
            <Error
                // title={`Error loading active employees: ${error instanceof Error ? error.message : "Unknown error"}`}
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
                    employees={currentItems}
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