import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp } from "lucide-react";
import type { Employee, Department, Position } from "../../_lib/types";
import { formatPlaceValue, formatRole } from "@/lib/helpers/formatters";

interface PositionSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  department: Department | null;
  positions: Position[];
  onPositionSelect: (positionId: number) => void;
}

export const PositionSelectionDialog = ({
  open,
  onOpenChange,
  employee,
  department,
  positions,
  onPositionSelect,
}: PositionSelectionDialogProps) => {
  if (!employee || !department) return null;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Assign Position in {department.name}
          </DialogTitle>
          <DialogDescription>
            Select a position for{" "}
            <span className="font-medium">
              {employee.user_id.user_profiles.first_name}{" "}
              {employee.user_id.user_profiles.last_name}
            </span>{" "}
            in the {department.name} department.
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
            <div>
              <p className="font-medium">
                {employee.user_id.user_profiles.first_name}{" "}
                {employee.user_id.user_profiles.last_name}
              </p>
              <p className="text-muted-foreground text-sm">
                Current Role:{" "}
                {formatRole(employee.user_id.user_roles?.[0].role_id.name) ||
                  "N/A"}
              </p>
            </div>
          </div>

          {/* Available Positions */}
          <div className="space-y-3">
            <h3 className="font-medium">Available Positions</h3>
            {positions.length === 0 ? (
              <div className="text-muted-foreground py-6 text-center">
                <p>No positions available in this department.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {positions.map((position) => (
                  <div
                    key={position.id}
                    className="hover:bg-accent/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h4 className="font-medium">{position.title}</h4>
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <TrendingUp className="size-3" />
                          Level {position.level}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1 text-sm">
                        {formatPlaceValue(position.base_salary)}
                      </div>
                    </div>
                    <Button
                      onClick={() => onPositionSelect(position.id)}
                      className="ml-4"
                    >
                      Assign
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
