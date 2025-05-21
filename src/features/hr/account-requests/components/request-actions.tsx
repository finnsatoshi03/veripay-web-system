import { Check, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { AccountRequest, RequestStatus } from "../lib/data";

interface RequestActionsProps {
  request: AccountRequest;
  onStatusChange: (requestId: string, newStatus: RequestStatus) => void;
}

export const RequestActions = ({
  request,
  onStatusChange,
}: RequestActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = (status: RequestStatus) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onStatusChange(request.id, status);
      setIsLoading(false);
    }, 500);
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
        disabled={isLoading}
        onClick={() => handleAction("approved")}
      >
        <Check className="size-4" />
        <span className="sr-only">Approve</span>
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-7 w-7 p-0 text-red-600"
        disabled={isLoading}
        onClick={() => handleAction("rejected")}
      >
        <X className="size-4" />
        <span className="sr-only">Reject</span>
      </Button>
    </div>
  );
};
