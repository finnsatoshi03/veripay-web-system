import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { DepartmentStats } from "./components/department-stats";
import { DepartmentSummary } from "./components/department-summary";
import { UnassignedEmployees } from "./components/unassigned-employees";
import { DepartmentsGrid } from "./components/departments-grid";

import { today } from "@/features/employee/_lib/helpers";
import { useEmployees } from "../_mutations/useEmployees";
import {
  useDepartments,
  usePositions,
} from "../_mutations/useDeptAndPositions";
import { useAssignDepartment } from "./mutations/useAssignDepartment";
import { Error } from "@/features/error";

export default function HrDeptAssignment() {
  const {
    data: employees = [],
    isLoading: loadingEmployees,
    error: employeesError,
  } = useEmployees();
  const {
    data: departments = [],
    isLoading: loadingDepartments,
    error: departmentsError,
  } = useDepartments();
  const {
    data: positions = [],
    isLoading: loadingPositions,
    error: positionsError,
  } = usePositions();
  const assignDepartmentMutation = useAssignDepartment();

  const isLoading = loadingEmployees || loadingDepartments || loadingPositions;
  const hasError = employeesError || departmentsError || positionsError;

  const handleAssignEmployee = (
    employeeId: number,
    departmentId: number,
    positionId: number,
  ) => {
    assignDepartmentMutation.mutate({
      employeeId,
      departmentId,
      positionId,
    });
  };

  // Calculate stats
  const totalEmployees = employees.length;
  const unassignedEmployees = employees.filter(
    (employee) => !employee.department_id || !employee.position_id,
  ).length;
  const withDepartment = totalEmployees - unassignedEmployees;

  const departmentStats = {
    with_department:
      totalEmployees > 0
        ? Math.round((withDepartment / totalEmployees) * 100)
        : 0,
    no_department:
      totalEmployees > 0
        ? Math.round((unassignedEmployees / totalEmployees) * 100)
        : 0,
  };

  const departmentSummaryItems = [
    { label: "Total Departments", value: departments.length.toString() },
    { label: "Unassigned Employees", value: unassignedEmployees.toString() },
    { label: "Total Employees", value: totalEmployees.toString() },
    { label: "Available Positions", value: positions.length.toString() },
  ];

  if (hasError) {
    return (
      <Error title={`Failed to load data. Please try refreshing the page.`} />
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold">Department Management</h1>
              <p className="text-muted-foreground text-sm">{today}</p>
            </div>
            <Separator />
            <Skeleton className="h-12 w-80" />
          </div>
          <Skeleton className="h-20 w-64" />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Skeleton className="h-[600px] w-full" />
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
      <div className="flex justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Department Management</h1>
            <p className="text-muted-foreground text-sm">{today}</p>
          </div>
          <Separator />
          <DepartmentStats percentages={departmentStats} />
        </div>
        <DepartmentSummary items={departmentSummaryItems} />
      </div>

      <div className="mt-6 grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-4">
        <div className="min-h-0 flex-1 lg:col-span-1">
          <UnassignedEmployees employees={employees} />
        </div>
        <div className="min-h-0 flex-1 overflow-auto lg:col-span-3">
          <DepartmentsGrid
            departments={departments}
            employees={employees}
            positions={positions}
            onAssignEmployee={handleAssignEmployee}
          />
        </div>
      </div>
    </div>
  );
}
