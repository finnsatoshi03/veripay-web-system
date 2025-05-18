import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// types
interface LeaveTypeProps {
  days: number;
  totalDays: number;
  percentage: number;
  label: string;
}

// components
export const LeaveTypeCard = ({
  days,
  totalDays,
  percentage,
  label,
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
      <Link
        to="#"
        className="text-primary flex items-center gap-2 text-sm font-medium"
      >
        Request Leave <ArrowRight className="size-4" />
      </Link>
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
      label: "Annual",
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
      label: "Vacation",
    },
  ];

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
          />
        ))}
      </div>
    </div>
  );
};
