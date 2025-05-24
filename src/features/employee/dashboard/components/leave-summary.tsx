import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateLeaveRequestForm } from "@/features/employee/leave-overview/components/create-leave-request-form";

import { useLeaveOverview } from "@/features/employee/leave-overview/mutations/useLeaveOverview";
import { Error } from "@/features/error";

// types
interface LeaveTypeProps {
  days: number;
  totalDays: number;
  percentage: number;
  label: string;
  onRequestLeave: (leaveType: string) => void;
}

// components
export const LeaveTypeCard = ({
  days,
  totalDays,
  percentage,
  label,
  onRequestLeave,
}: LeaveTypeProps) => {
  return (
    <div className="space-y-2">
      <div>
        <div className="flex items-end gap-1">
          <h1 className="text-3xl font-semibold">{days} Days</h1>
          <p className="text-muted-foreground mb-0.5 text-sm">
            ({percentage}% of {totalDays} days)
          </p>
        </div>
        <p className="text-muted-foreground text-sm">{label} Leave Remaining</p>
      </div>
      <button
        onClick={() => onRequestLeave(label)}
        className="text-primary flex cursor-pointer items-center gap-2 text-sm font-medium"
        tabIndex={0}
        aria-label={`Request ${label} Leave`}
      >
        Request Leave <ArrowRight className="size-4" />
      </button>
    </div>
  );
};

// main component
export const LeaveSummary = () => {
  const { data: leaveData, isLoading, error } = useLeaveOverview();

  // states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<string | null>(
    null,
  );

  // Transform allowances data to match component format
  const leaveTypes =
    leaveData?.allowances?.map((allowance) => ({
      days: allowance.remaining,
      totalDays: allowance.total,
      percentage: allowance.percentRemaining,
      label: allowance.type.replace(" Leave", ""), // Remove "Leave" from the end for cleaner display
    })) || [];

  // Transform allowances to the format expected by CreateLeaveRequestForm
  const allowanceObject = leaveData?.allowances?.reduce(
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
  ) || { vacation: 0, sick: 0, emergency: 0, bereavement: 0 };

  // handlers
  const handleRequestLeave = (leaveType: string) => {
    setSelectedLeaveType(leaveType);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-2 rounded-lg border p-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="bg-border -mx-2 h-px px-2" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="space-y-1">
                <div className="flex items-end gap-1">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="mb-1 h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <Error title="Error loading leave data" />;
  }

  if (leaveTypes.length === 0) {
    return (
      <div className="w-full space-y-2 rounded-lg border p-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Leave Summary</h2>
          <Link to="/employee/leave-overview">
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
        <div className="bg-border -mx-2 h-px px-2" />
        <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
          No leave allowances available
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2 rounded-lg border p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Leave Summary</h2>
        <Link to="/employee/leave-overview">
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      </div>
      <div className="bg-border -mx-2 h-px px-2" />

      <div className="space-y-4">
        {leaveTypes.map((leaveType, index) => (
          <LeaveTypeCard
            key={index}
            days={leaveType.days}
            totalDays={leaveType.totalDays}
            percentage={leaveType.percentage}
            label={leaveType.label}
            onRequestLeave={handleRequestLeave}
          />
        ))}
      </div>

      {/* Create Leave Request Form */}
      {selectedLeaveType && (
        <CreateLeaveRequestForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          allowance={allowanceObject}
          preselectedLeaveType={selectedLeaveType}
          disableLeaveTypeSelection={true}
        />
      )}
    </div>
  );
};
