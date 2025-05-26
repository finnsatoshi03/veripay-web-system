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

import { formatInitials } from "@/lib/helpers/formatters";
import { useAssignReport } from "../mutations/useAssignReport";
import { getHrEmployees } from "@/services/employee/hr-employees";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

interface AssignmentDialogProps {
  reportId: number | null;
  reportTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AssignmentDialog = ({
  reportId,
  reportTitle,
  open,
  onOpenChange,
}: AssignmentDialogProps) => {
  const [selectedHrId, setSelectedHrId] = useState<string>("");

  const { data: hrEmployees, isLoading: isLoadingHr } = useQuery({
    queryKey: ["hrEmployees"],
    queryFn: getHrEmployees,
    enabled: open,
  });

  const assignReportMutation = useAssignReport();

  const handleAssign = () => {
    if (!reportId || !selectedHrId) return;

    assignReportMutation.mutate(
      {
        reportId,
        assignedToId: parseInt(selectedHrId),
        status: "To Review",
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedHrId("");
        },
      },
    );
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedHrId("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Report</DialogTitle>
          <DialogDescription>
            Assign "{reportTitle}" to an HR reviewer for processing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select HR Reviewer</label>
            {isLoadingHr ? (
              <div className="flex items-center justify-center py-8">
                <LoaderIcon className="size-6 animate-spin" />
              </div>
            ) : (
              <Select value={selectedHrId} onValueChange={setSelectedHrId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an HR reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {hrEmployees?.map((employee) => {
                    const name = `${employee.user_id.user_profiles.first_name} ${employee.user_id.user_profiles.last_name}`;
                    return (
                      <SelectItem
                        key={employee.id}
                        value={employee.user_id.id.toString()}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarImage
                              src={employee.user_id.user_profiles.profile_image}
                              alt={name}
                            />
                            <AvatarFallback>
                              {formatInitials(name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedHrId || assignReportMutation.isPending}
          >
            {assignReportMutation.isPending && (
              <LoaderIcon className="mr-2 size-4 animate-spin" />
            )}
            Assign Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
