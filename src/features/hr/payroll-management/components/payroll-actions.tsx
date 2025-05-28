import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PayrollPeriod } from "../lib/data";
import { PayrollDialog } from "./payroll-dialog";

interface PayrollActionsProps {
  payroll: PayrollPeriod;
}

export const PayrollActions = ({ payroll }: PayrollActionsProps) => {
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
          title="View payroll details"
        >
          <Eye className="size-4" />
          <span className="sr-only">View</span>
        </Button>
      </div>

      <PayrollDialog
        payroll={payroll}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};
