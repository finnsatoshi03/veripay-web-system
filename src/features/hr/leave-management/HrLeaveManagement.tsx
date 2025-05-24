import { useState } from "react";

import { Search } from "@/components/custom/search";
import { ScrollArea } from "@/components/ui/scroll-area";
import { today } from "@/features/employee/_lib/helpers";
import {
  useLeaveRequests,
  useUpdateLeaveStatus,
} from "@/features/hr/_mutations/useLeaveRequests";
import { LeaveCalendar } from "./components/leave-calendar";
import { PendingLeavesList } from "./components/pending-leaves-list";
import { LeaveApprovalDialog } from "./components/leave-approval-dialog";
import type { LeaveRequest } from "@/features/hr/_lib/types";
import { Error } from "@/features/error";
import { useUserStore } from "@/store/userStore";

export default function HrLeaveManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { id: userId } = useUserStore();
  const { data: leaveRequests = [], isLoading, error } = useLeaveRequests();
  const updateLeaveStatus = useUpdateLeaveStatus();

  const handleLeaveClick = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setDialogOpen(true);
  };

  const handleApprove = async (leaveId: number) => {
    await updateLeaveStatus.mutateAsync({
      id: leaveId,
      status: "approved",
      reviewedBy: userId!,
    });
  };

  const handleReject = async (leaveId: number, rejectionReason: string) => {
    await updateLeaveStatus.mutateAsync({
      id: leaveId,
      status: "rejected",
      rejectionReason,
      reviewedBy: userId!,
    });
  };

  // Filter leave requests based on search query
  const filteredLeaveRequests = leaveRequests.filter((leave) => {
    if (!searchQuery.trim()) return true;

    const employee = leave.employee_id;
    const userProfile = employee.user_id.user_profiles;
    const fullName =
      `${userProfile.first_name} ${userProfile.last_name}`.toLowerCase();
    const leaveType = leave.leave_type_id.name.toLowerCase();

    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      leaveType.includes(searchQuery.toLowerCase())
    );
  });

  if (error) {
    return <Error title="Error loading leave requests" />;
  }

  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
      <div className="space-y-2">
        <div>
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <p className="text-muted-foreground text-sm">{today}</p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_0.4fr] gap-4">
        <ScrollArea className="h-full min-h-0 flex-1 overflow-auto">
          <LeaveCalendar leaveRequests={filteredLeaveRequests} />
        </ScrollArea>

        <ScrollArea className="h-full min-h-0 flex-1 overflow-auto">
          <div className="space-y-4">
            <Search
              placeholder="Search leave requests"
              size="sm"
              className="!w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <PendingLeavesList
              leaveRequests={filteredLeaveRequests}
              onLeaveClick={handleLeaveClick}
              isLoading={isLoading}
            />
          </div>
        </ScrollArea>
      </div>

      <LeaveApprovalDialog
        leave={selectedLeave}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onApprove={handleApprove}
        onReject={handleReject}
        isLoading={updateLeaveStatus.isPending}
      />
    </div>
  );
}
