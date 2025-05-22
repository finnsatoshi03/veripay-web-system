import { Loader2, Play, Eye, Edit, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PayrollPeriod } from "../lib/data";
import { useProcessPayrollAction } from "../mutations/payroll-service";

interface PayrollActionsProps {
  payroll: PayrollPeriod;
}

export const PayrollActions = ({ payroll }: PayrollActionsProps) => {
  const { mutate, isPending, variables } = useProcessPayrollAction();

  // Check if this specific payroll action is being processed
  const isLoadingProcess =
    isPending &&
    variables?.payrollId === payroll.id &&
    variables?.action === "process";

  const handleAction = (action: "process" | "view" | "edit") => {
    mutate({
      payrollId: payroll.id,
      action,
    });
  };

  // Show different actions based on status
  if (payroll.status === "processed") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0"
            disabled={isPending}
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleAction("view")}>
            <Eye className="size-4 mr-2" />
            View Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (payroll.status === "processing") {
    return (
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          className="h-7 w-7 p-0"
          disabled
        >
          <Loader2 className="size-4 animate-spin" />
          <span className="sr-only">Processing</span>
        </Button>
      </div>
    );
  }

  // Scheduled status - show process and edit options
  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="outline"
        className="h-7 w-7 p-0 text-blue-600"
        disabled={isPending}
        onClick={() => handleAction("process")}
      >
        {isLoadingProcess ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Play className="size-4" />
        )}
        <span className="sr-only">Process</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0"
            disabled={isPending}
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleAction("edit")}>
            <Edit className="size-4 mr-2" />
            Edit Period
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("view")}>
            <Eye className="size-4 mr-2" />
            View Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};