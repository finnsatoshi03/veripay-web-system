import { useState } from "react";
import { Separator } from "@/components/ui/separator";

import { DepartmentStats } from "./components/department-stats";
import { DepartmentSummary } from "./components/department-summary";
import { AllEmployees } from "./components/all-employees";
import { DepartmentsGrid } from "./components/departments-grid";
import { UpdateAssignmentDialog } from "./components/update-assignment-dialog";

import { today } from "@/features/employee/_lib/helpers";
import { useEmployees } from "../_mutations/useEmployees";
import {
  useDepartments,
  usePositions,
} from "../_mutations/useDeptAndPositions";
import { useAssignDepartment } from "./mutations/useAssignDepartment";
import { Error } from "@/features/error";
import { Loader } from "@/components/custom/loader";
import type { Employee } from "../_lib/types";

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

  // state
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedEmployeeForUpdate, setSelectedEmployeeForUpdate] =
    useState<Employee | null>(null);

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

  const handleUpdateEmployee = (
    employeeId: number,
    departmentId: number,
    positionId: number,
  ) => {
    assignDepartmentMutation.mutate(
      {
        employeeId,
        departmentId,
        positionId,
      },
      {
        onSuccess: () => {
          setUpdateDialogOpen(false);
          setSelectedEmployeeForUpdate(null);
        },
      },
    );
  };

  // handlers
  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployeeForUpdate(employee);
    setUpdateDialogOpen(true);
  };

  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
    setSelectedEmployeeForUpdate(null);
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
    return <Loader />;
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
          <AllEmployees
            employees={employees as unknown as Employee[]}
            onEmployeeClick={handleEmployeeClick}
          />
        </div>
        <div className="min-h-0 flex-1 overflow-auto lg:col-span-3">
          <DepartmentsGrid
            departments={departments}
            employees={employees as unknown as Employee[]}
            positions={positions}
            onAssignEmployee={handleAssignEmployee}
          />
        </div>
      </div>

      {/* Update Assignment Dialog */}
      <UpdateAssignmentDialog
        open={updateDialogOpen}
        onOpenChange={handleUpdateDialogClose}
        employee={selectedEmployeeForUpdate}
        departments={departments}
        positions={positions}
        onUpdate={handleUpdateEmployee}
        isLoading={assignDepartmentMutation.isPending}
      />
    </div>
  );
}
