import { useState } from "react";
import { Building2, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PositionSelectionDialog } from "./position-selection-dialog";
import type { Department, Employee, Position } from "../../_lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DepartmentsGridProps {
  departments: Department[];
  employees: Employee[];
  positions: Position[];
  onAssignEmployee: (
    employeeId: number,
    departmentId: number,
    positionId: number,
  ) => void;
}

export const DepartmentsGrid = ({
  departments,
  employees,
  positions,
  onAssignEmployee,
}: DepartmentsGridProps) => {
  const [draggedOver, setDraggedOver] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const handleDragOver = (event: React.DragEvent, departmentId: number) => {
    event.preventDefault();
    setDraggedOver(departmentId);
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = (event: React.DragEvent, department: Department) => {
    event.preventDefault();
    setDraggedOver(null);

    try {
      const employeeData = JSON.parse(
        event.dataTransfer.getData("application/json"),
      ) as Employee;
      setSelectedEmployee(employeeData);
      setSelectedDepartment(department);
      setDialogOpen(true);
    } catch (error) {
      console.error("Failed to parse dropped data:", error);
    }
  };

  const handlePositionSelect = (positionId: number) => {
    if (selectedEmployee && selectedDepartment) {
      onAssignEmployee(selectedEmployee.id, selectedDepartment.id, positionId);
      setDialogOpen(false);
      setSelectedEmployee(null);
      setSelectedDepartment(null);
    }
  };

  const getEmployeeCountByDepartment = (departmentId: number) => {
    return employees.filter((emp) => emp.department_id?.id === departmentId)
      .length;
  };

  const getDepartmentPositions = (departmentId: number) => {
    return positions.filter((pos) => pos.department_id === departmentId);
  };

  return (
    <>
      <ScrollArea className="h-full min-h-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => {
            const employeeCount = getEmployeeCountByDepartment(department.id);
            const departmentPositions = getDepartmentPositions(department.id);
            const isDraggedOver = draggedOver === department.id;

            return (
              <Card
                key={department.id}
                className={`transition-all duration-200 hover:shadow-md ${
                  isDraggedOver
                    ? "border-primary bg-primary/5 border-2"
                    : "border-border"
                }`}
                onDragOver={(e) => handleDragOver(e, department.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, department)}
              >
                <CardHeader>
                  <CardTitle className="grid grid-cols-[1fr_auto] items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <Building2 className="size-5" />
                      <span className="truncate">{department.name}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Users className="size-3" />
                      {employeeCount}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                    {department.description}
                  </p>

                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs font-medium">
                      Available Positions ({departmentPositions.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {departmentPositions.slice(0, 3).map((position) => (
                        <Badge
                          key={position.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {position.title}
                        </Badge>
                      ))}
                      {departmentPositions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{departmentPositions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {isDraggedOver && (
                    <div className="border-primary mt-4 rounded-lg border-2 border-dashed p-2 text-center">
                      <p className="text-primary text-sm font-medium">
                        Drop here to assign employee
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      <PositionSelectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={selectedEmployee}
        department={selectedDepartment}
        positions={
          selectedDepartment
            ? getDepartmentPositions(selectedDepartment.id)
            : []
        }
        onPositionSelect={handlePositionSelect}
      />
    </>
  );
};
