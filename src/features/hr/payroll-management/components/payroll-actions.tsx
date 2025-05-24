import { Loader2, Eye, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PayrollPeriod } from "../lib/data";
// import { useProcessPayrollAction } from "../mutations/payroll-service";

interface PayrollActionsProps {
  payroll: PayrollPeriod;
}

export const PayrollActions = ({ payroll }: PayrollActionsProps) => {
  // const { mutate, isPending, variables } = useProcessPayrollAction();

  // Check if this specific payroll action is being processed
  // const isLoadingAttach =
  //   isPending &&
  //   variables?.payrollId === payroll.id &&
  //   variables?.action === "attach";
    
  // const isLoadingView =
  //   isPending &&
  //   variables?.payrollId === payroll.id &&
  //   variables?.action === "view";

  // Temporary variables while payroll-service is commented out
  const isPending = false;
  const isLoadingAttach = false;
  const isLoadingView = false;

  const handleAction = (action: "attach" | "view") => {
    // mutate({
    //   payrollId: payroll.id,
    //   action,
    // });
    
    // Temporary placeholder while payroll-service is commented out
    console.log(`Action ${action} for payroll ${payroll.id} - service commented out`);
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