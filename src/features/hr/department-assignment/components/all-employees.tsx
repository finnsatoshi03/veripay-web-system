import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Users, Edit3 } from "lucide-react";
import type { Employee } from "../../_lib/types";

interface AllEmployeesProps {
  employees: Employee[];
  onEmployeeClick?: (employee: Employee) => void;
}

export const AllEmployees = ({
  employees,
  onEmployeeClick,
}: AllEmployeesProps) => {
  const unassignedEmployees = employees.filter(
    (employee) => !employee.department_id || !employee.position_id,
  );
  const assignedEmployees = employees.filter(
    (employee) => employee.department_id && employee.position_id,
  );

  const handleDragStart = (event: React.DragEvent, employee: Employee) => {
    event.dataTransfer.setData("application/json", JSON.stringify(employee));
    event.dataTransfer.effectAllowed = "move";
  };

  const handleEmployeeClick = (employee: Employee) => {
    // Only allow click for assigned employees (for updates)
    if (employee.department_id && employee.position_id && onEmployeeClick) {
      onEmployeeClick(employee);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const EmployeeCard = ({
    employee,
    isAssigned,
  }: {
    employee: Employee;
    isAssigned: boolean;
  }) => (
    <div
      key={employee.id}
      draggable={!isAssigned}
      onDragStart={
        !isAssigned ? (e) => handleDragStart(e, employee) : undefined
      }
      onClick={isAssigned ? () => handleEmployeeClick(employee) : undefined}
      className={`flex gap-3 rounded-lg border p-3 transition-colors ${
        !isAssigned
          ? "hover:bg-accent cursor-move"
          : "hover:bg-accent cursor-pointer"
      }`}
    >
      <Avatar className="size-10">
        <AvatarImage src={employee.user_id.user_profiles.profile_image} />
        <AvatarFallback>
          {getInitials(
            employee.user_id.user_profiles.first_name,
            employee.user_id.user_profiles.last_name,
          )}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate text-sm font-medium">
            {employee.user_id.user_profiles.first_name}{" "}
            {employee.user_id.user_profiles.last_name}
          </p>
          {isAssigned && <Edit3 className="text-muted-foreground size-3" />}
        </div>
        <p className="text-muted-foreground text-xs">
          {employee.role?.role?.name || "N/A"}
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {!employee.department_id && (
            <Badge variant="destructive" className="truncate text-xs">
              No Department
            </Badge>
          )}
          {!employee.position_id && (
            <Badge variant="destructive" className="text-xs">
              No Position
            </Badge>
          )}
          {employee.department_id && (
            <Badge variant="secondary" className="text-xs">
              {employee.department_id.name}
            </Badge>
          )}
          {employee.position_id && (
            <Badge variant="outline" className="text-xs">
              {employee.position_id.title}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="size-5" />
          All Employees
          <Badge variant="secondary" className="ml-auto">
            {employees.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full min-h-0">
          <div className="space-y-4">
            {/* Unassigned Employees Section */}
            {unassignedEmployees.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-muted-foreground text-xs font-medium uppercase">
                  Unassigned ({unassignedEmployees.length})
                </h3>
                <div className="space-y-3">
                  {unassignedEmployees.map((employee) => (
                    <EmployeeCard
                      key={employee.id}
                      employee={employee}
                      isAssigned={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Assigned Employees Section */}
            {assignedEmployees.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-muted-foreground text-xs font-medium uppercase">
                  Assigned ({assignedEmployees.length}) - Click to Update
                </h3>
                <div className="space-y-3">
                  {assignedEmployees.map((employee) => (
                    <EmployeeCard
                      key={employee.id}
                      employee={employee}
                      isAssigned={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {employees.length === 0 && (
              <div className="text-muted-foreground py-8 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>No employees found!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
