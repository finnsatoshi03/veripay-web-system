import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CreateLeaveRequestForm } from "@/features/employee/leave-overview/components/create-leave-request-form";
import { leaveAllowance } from "../../_lib/mock/mock-leaveAllowance";

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
  // data
  const leaveTypes = [
    {
      days: 6,
      totalDays: 15,
      percentage: 40,
      label: "Vacation",
    },
    {
      days: 7,
      totalDays: 10,
      percentage: 70,
      label: "Sick",
    },
    {
      days: 3,
      totalDays: 5,
      percentage: 60,
      label: "Emergency",
    },
  ];

  // states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<string | null>(
    null,
  );

  // handlers
  const handleRequestLeave = (leaveType: string) => {
    setSelectedLeaveType(leaveType);
    setIsFormOpen(true);
  };

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
          allowance={leaveAllowance}
          preselectedLeaveType={selectedLeaveType}
          disableLeaveTypeSelection={true}
        />
      )}
    </div>
  );
};
