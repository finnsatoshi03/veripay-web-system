import { Separator } from "@/components/ui/separator";

import { LeaveAllowanceSection } from "./components/leave-allowance-section";
import { LeaveRequestSection } from "./components/leave-request-section";

import { ReviewerDisplay } from "../_components/reviewer-display";
import { Error } from "@/features/error";

import { hrReviewers } from "../_lib/mock/mock-hrReviewers";
import { today } from "../_lib/helpers";
import { useLeaveOverview } from "./mutations/useLeaveOverview";
import { Loader } from "@/components/custom/loader";

export default function EmployeeLeaveOverview() {
  const { data: leaveData, isLoading, error } = useLeaveOverview();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Error
        title={`Error loading leave data: ${error instanceof Error ? error.message : "Unknown error"}`}
      />
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Leave Overview</h1>
            <p className="text-muted-foreground text-sm">{today}</p>
          </div>
          <Separator />
        </div>
        <div className="flex items-center gap-4">
          <ReviewerDisplay
            reviewers={hrReviewers}
            description="for incoming leave requests."
          />
        </div>
      </div>

      <div className="flex h-full min-h-0 w-full flex-1 flex-col gap-6">
        <LeaveAllowanceSection
          allowances={leaveData?.allowances || []}
          isLoading={isLoading}
        />
        <LeaveRequestSection
          leaveRequests={leaveData?.leaveRequests}
          allowances={leaveData?.allowances || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
