import { useState } from "react";
import { CheckCircle, Clock, XCircle, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Search } from "@/components/custom/search";

import { LeaveRequestCard } from "./leave-request-card";
import { LeaveRequestDialog } from "./leave-request-dialog";
import { CreateLeaveRequestForm } from "./create-leave-request-form";

import { KanbanBoard } from "../../_components/kanban";
import { leaveRequests } from "../../_lib/mock/mock-leaveRequests";

export const LeaveRequestSection = () => {
  const columns = [
    {
      title: "Pending",
      icon: <Clock className="size-4" />,
      items: leaveRequests.pending,
    },
    {
      title: "Approved",
      icon: <CheckCircle className="size-4" />,
      items: leaveRequests.approved,
    },
    {
      title: "Rejected",
      icon: <XCircle className="size-4" />,
      items: leaveRequests.rejected,
    },
  ];

  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);

  // Mock data for leave allowance
  const leaveAllowance = {
    vacation: 15,
    sick: 10,
    emergency: 5,
    bereavement: 3,
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Leave Requests</h2>
        <div className="flex justify-between">
          <Search size="sm" />
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
        allowance={leaveAllowance}
      />
    </div>
  );
};
