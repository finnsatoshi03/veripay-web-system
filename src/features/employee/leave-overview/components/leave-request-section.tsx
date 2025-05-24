import { useState } from "react";
import { CheckCircle, Clock, XCircle, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Search } from "@/components/custom/search";

import { LeaveRequestCard } from "./leave-request-card";
import { LeaveRequestDialog } from "./leave-request-dialog";
import { CreateLeaveRequestForm } from "./create-leave-request-form";

import { KanbanBoard } from "@/components/custom/kanban/board";
import type { LeaveRequestCardProps } from "./leave-request-card";
import type { LeaveAllowance } from "../../_lib/mock/mock-leaveAllowance";

interface LeaveRequestSectionProps {
  leaveRequests?: {
    pending: LeaveRequestCardProps[];
    approved: LeaveRequestCardProps[];
    rejected: LeaveRequestCardProps[];
  };
  allowances?: LeaveAllowance[];
  isLoading?: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export const LeaveRequestSection = ({
  leaveRequests,
  allowances = [],
  isLoading = false,
  searchQuery = "",
  onSearchChange,
}: LeaveRequestSectionProps) => {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);

  // Filter leave requests based on search query
  const filterLeaveRequests = (
    requests: LeaveRequestCardProps[],
  ): LeaveRequestCardProps[] => {
    if (!searchQuery.trim()) return requests;

    const query = searchQuery.toLowerCase().trim();
    return requests.filter((request) => {
      return (
        request.title.toLowerCase().includes(query) ||
        request.reason.toLowerCase().includes(query) ||
        request.requestedBy.name.toLowerCase().includes(query) ||
        (request.reviewedBy &&
          request.reviewedBy.name.toLowerCase().includes(query))
      );
    });
  };

  // handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  const allowanceObject = allowances.reduce(
    (acc, allowance) => {
      const key = allowance.type
        .toLowerCase()
        .replace(" leave", "")
        .replace(" ", "");
      if (key === "vacation") acc.vacation = allowance.remaining;
      else if (key === "sick") acc.sick = allowance.remaining;
      else if (key === "emergency") acc.emergency = allowance.remaining;
      else if (key === "bereavement") acc.bereavement = allowance.remaining;
      return acc;
    },
    { vacation: 0, sick: 0, emergency: 0, bereavement: 0 },
  );

  if (isLoading) {
    return (
      <div className="flex h-full min-h-0 flex-1 flex-col gap-4">
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Leave Requests</h2>
          <div className="flex justify-between">
            <Search size="sm" disabled />
            <Button size="sm" disabled className="flex items-center gap-1">
              <Plus className="size-4" />
              Request leave
            </Button>
          </div>
        </div>
        <div className="bg-muted/50 h-64 animate-pulse rounded"></div>
      </div>
    );
  }

  const columns = [
    {
      id: "pending",
      title: "Pending",
      icon: <Clock className="size-4" />,
      items: filterLeaveRequests(leaveRequests?.pending || []),
    },
    {
      id: "approved",
      title: "Approved",
      icon: <CheckCircle className="size-4" />,
      items: filterLeaveRequests(leaveRequests?.approved || []),
    },
    {
      id: "rejected",
      title: "Rejected",
      icon: <XCircle className="size-4" />,
      items: filterLeaveRequests(leaveRequests?.rejected || []),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Leave Requests</h2>
        <div className="flex justify-between">
          <Search
            size="sm"
            placeholder="Search by title, reason, requester..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsRequestFormOpen(true)}
              className="flex items-center gap-1"
            >
              <Plus className="size-4" />
              Request leave
            </Button>
          </div>
        </div>
      </div>
      <KanbanBoard
        columns={columns}
        renderItem={(item, onClick) => (
          <LeaveRequestCard key={item.id} {...item} onClick={onClick} />
        )}
        renderDialog={(selectedItem, isOpen, onOpenChange) => (
          <LeaveRequestDialog
            request={selectedItem}
            open={isOpen}
            onOpenChange={onOpenChange}
          />
        )}
        emptyStateText="No leave requests"
      />

      <CreateLeaveRequestForm
        open={isRequestFormOpen}
        onOpenChange={setIsRequestFormOpen}
        allowance={allowanceObject}
      />
    </div>
  );
};
