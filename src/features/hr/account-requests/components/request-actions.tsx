import { Check, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AccountRequest, RequestStatus } from "../lib/data";
import { useProcessAccountRequest } from "../mutations/account-req-service";

interface RequestActionsProps {
  request: AccountRequest;
}

export const RequestActions = ({ request }: RequestActionsProps) => {
  const { mutate, isPending, variables } = useProcessAccountRequest();

  // Check if this specific request is being processed
  const isLoadingApprove =
    isPending &&
    variables?.requestId === request.id &&
    variables?.status === "approved";
  const isLoadingReject =
    isPending &&
    variables?.requestId === request.id &&
    variables?.status === "rejected";

  const handleAction = (status: RequestStatus) => {
    mutate({
      requestId: request.id,
      status,
    });
  };

  if (request.status !== "pending") {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium capitalize">{request.status}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="outline"
        className="h-7 w-7 p-0 text-green-600"
        disabled={isPending}
        onClick={() => handleAction("approved")}
      >
        {isLoadingApprove ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Check className="size-4" />
        )}
        <span className="sr-only">Approve</span>
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-7 w-7 p-0 text-red-600"
        disabled={isPending}
        onClick={() => handleAction("rejected")}
      >
        {isLoadingReject ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <X className="size-4" />
        )}
        <span className="sr-only">Reject</span>
      </Button>
    </div>
  );
};
