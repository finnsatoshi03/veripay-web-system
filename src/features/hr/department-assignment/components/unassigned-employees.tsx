import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import type { Employee } from "../../_lib/types";

interface UnassignedEmployeesProps {
  employees: Employee[];
}

export const UnassignedEmployees = ({
  employees,
}: UnassignedEmployeesProps) => {
  const unassignedEmployees = employees.filter(
    (employee) => !employee.department_id || !employee.position_id,
  );

  const handleDragStart = (event: React.DragEvent, employee: Employee) => {
    event.dataTransfer.setData("application/json", JSON.stringify(employee));
    event.dataTransfer.effectAllowed = "move";
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="size-5" />
          Unassigned Employees
          <Badge variant="secondary" className="ml-auto">
            {unassignedEmployees.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full min-h-0">
          <div className="space-y-3">
            {unassignedEmployees.map((employee) => (
              <div
                key={employee.id}
                draggable
                onDragStart={(e) => handleDragStart(e, employee)}
                className="hover:bg-accent flex cursor-move gap-3 rounded-lg border p-3 transition-colors"
              >
                <Avatar className="size-10">
                  <AvatarImage
                    src={employee.user_id.user_profiles.profile_image}
                  />
                  <AvatarFallback>
                    {getInitials(
                      employee.user_id.user_profiles.first_name,
                      employee.user_id.user_profiles.last_name,
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {employee.user_id.user_profiles.first_name}{" "}
                    {employee.user_id.user_profiles.last_name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {employee.role?.role?.name || "N/A"}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {!employee.department_id && (
                      <Badge variant="destructive" className="text-xs">
                        No Department
                      </Badge>
                    )}
                    {!employee.position_id && (
                      <Badge variant="destructive" className="text-xs">
                        No Position
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {unassignedEmployees.length === 0 && (
              <div className="text-muted-foreground py-8 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>All employees are assigned!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
