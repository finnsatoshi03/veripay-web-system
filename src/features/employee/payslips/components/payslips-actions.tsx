import { Loader2, Eye, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EmployeePayslip } from "../lib/data";

interface PayslipActionsProps {
  payslip: EmployeePayslip;
}

export const PayslipActions = ({ payslip }: PayslipActionsProps) => {
  const isPending = false;
  const isLoadingAttach = false;
  const isLoadingView = false;

  const handleAction = (action: "attach" | "view") => {
    console.log(`Action ${action} for payslip ${payslip.id}`);
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="outline"
        className="h-7 w-7 p-0"
        disabled={isPending}
        onClick={() => handleAction("attach")}
      >
        {isLoadingAttach ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Paperclip className="size-4" />
        )}
        <span className="sr-only">Attach</span>
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-7 w-7 p-0"
        disabled={isPending}
        onClick={() => handleAction("view")}
      >
        {isLoadingView ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Eye className="size-4" />
        )}
        <span className="sr-only">View</span>
      </Button>
    </div>
  );
};
