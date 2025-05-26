import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActiveEmployee } from "../lib/helpers";
import { EmployeeDetailsDialog } from "./employee-details-dialog";

interface EmployeeActionsProps {
  employee: ActiveEmployee;
}

export const EmployeeActions = ({ employee }: EmployeeActionsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewClick = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          className="h-7 w-7 p-0"
          onClick={handleViewClick}
        >
          <Eye className="size-4" />
          <span className="sr-only">View Details</span>
        </Button>
      </div>

      <EmployeeDetailsDialog
        employee={employee}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};
