import { Loader2, Eye, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActiveEmployee } from "../lib/helpers";
// import { useProcessEmployeeAction } from "../mutations/employee-service";

interface EmployeeActionsProps {
  employee: ActiveEmployee;
}

export const EmployeeActions = ({ employee }: EmployeeActionsProps) => {
  // const { mutate, isPending, variables } = useProcessEmployeeAction();

  // Check if this specific employee action is being processed
  // const isLoadingAttach =
  //   isPending &&
  //   variables?.employeeId === employee.id &&
  //   variables?.action === "attach";

  // const isLoadingView =
  //   isPending &&
  //   variables?.employeeId === employee.id &&
  //   variables?.action === "view";

  // Temporary variables while employee-service is commented out
  const isPending = false;
  const isLoadingAttach = false;
  const isLoadingView = false;

  const handleAction = (action: "attach" | "view") => {
    // mutate({
    //   employeeId: employee.id,
    //   action,
    // });

    // Temporary placeholder while employee-service is commented out
    console.log(
      `Action ${action} for employee ${employee.id} - service commented out`,
    );
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
