import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Briefcase, ArrowRight } from "lucide-react";
import type { Employee, Department, Position } from "../../_lib/types";
import { formatPlaceValue } from "@/lib/helpers/formatters";

interface UpdateAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  departments: Department[];
  positions: Position[];
  onUpdate: (
    employeeId: number,
    departmentId: number,
    positionId: number,
  ) => void;
  isLoading?: boolean;
}

export const UpdateAssignmentDialog = ({
  open,
  onOpenChange,
  employee,
  departments,
  positions,
  onUpdate,
  isLoading = false,
}: UpdateAssignmentDialogProps) => {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [selectedPositionId, setSelectedPositionId] = useState<string>("");

  // Reset state when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open && employee) {
      setSelectedDepartmentId(employee.department_id?.id.toString() || "");
      setSelectedPositionId(employee.position_id?.id.toString() || "");
    } else {
      setSelectedDepartmentId("");
      setSelectedPositionId("");
    }
    onOpenChange(open);
  };

  const handleUpdate = () => {
    if (!employee || !selectedDepartmentId || !selectedPositionId) return;

    onUpdate(
      employee.id,
      parseInt(selectedDepartmentId),
      parseInt(selectedPositionId),
    );
  };

  const handleCancel = () => {
    handleOpenChange(false);
  };

  if (!employee) return null;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Filter positions based on selected department
  const availablePositions = selectedDepartmentId
    ? positions.filter(
        (pos) => pos.department_id === parseInt(selectedDepartmentId),
      )
    : [];

  const selectedDepartment = departments.find(
    (dept) => dept.id === parseInt(selectedDepartmentId),
  );
  const selectedPosition = availablePositions.find(
    (pos) => pos.id === parseInt(selectedPositionId),
  );

  const hasChanges =
    selectedDepartmentId !== (employee.department_id?.id.toString() || "") ||
    selectedPositionId !== (employee.position_id?.id.toString() || "");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Update Assignment
          </DialogTitle>
          <DialogDescription>
            Update department and position assignment for{" "}
            <span className="font-medium">
              {employee.user_id.user_profiles.first_name}{" "}
              {employee.user_id.user_profiles.last_name}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Info */}
          <div className="bg-border/50 flex items-center gap-3 rounded-lg p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={employee.user_id.user_profiles.profile_image} />
              <AvatarFallback>
                {getInitials(
                  employee.user_id.user_profiles.first_name,
                  employee.user_id.user_profiles.last_name,
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">
                {employee.user_id.user_profiles.first_name}{" "}
                {employee.user_id.user_profiles.last_name}
              </p>
              <p className="text-muted-foreground text-sm">
                Current Role: {employee.role?.role?.name || "N/A"}
              </p>
            </div>
          </div>

          {/* Current Assignment */}
          <div className="space-y-3">
            <h3 className="font-medium">Current Assignment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Department</p>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Building2 className="size-3" />
                  {employee.department_id?.name || "Not assigned"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Position</p>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Briefcase className="size-3" />
                  {employee.position_id?.title || "Not assigned"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* New Assignment */}
          <div className="space-y-4">
            <h3 className="font-medium">New Assignment</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Department Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select
                  value={selectedDepartmentId}
                  onValueChange={setSelectedDepartmentId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem
                        key={department.id}
                        value={department.id.toString()}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="size-4" />
                          {department.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Position Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Select
                  value={selectedPositionId}
                  onValueChange={setSelectedPositionId}
                  disabled={!selectedDepartmentId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePositions.map((position) => (
                      <SelectItem
                        key={position.id}
                        value={position.id.toString()}
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Briefcase className="size-4" />
                            {position.title}
                          </div>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Level {position.level}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignment Preview */}
            {selectedDepartment && selectedPosition && (
              <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ArrowRight className="size-4" />
                  <span className="font-medium">Preview New Assignment</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Department</p>
                    <p className="font-medium">{selectedDepartment.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {selectedDepartment.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Position</p>
                    <p className="font-medium">{selectedPosition.title}</p>
                    <p className="text-muted-foreground text-xs">
                      Level {selectedPosition.level} •{" "}
                      {formatPlaceValue(selectedPosition.base_salary)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={
              !selectedDepartmentId ||
              !selectedPositionId ||
              !hasChanges ||
              isLoading
            }
          >
            {isLoading ? "Updating..." : "Update Assignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
