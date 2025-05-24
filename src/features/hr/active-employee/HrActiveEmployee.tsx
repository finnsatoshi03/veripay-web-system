import { today } from "@/features/employee/_lib/helpers";
import ActiveEmployeeBoard from "./components/active-employee-board";
import { Separator } from "@/components/ui/separator";
import { ActiveSummary } from "./components/active-summary";
import { ActiveEmployeeStats } from "./components/active-employee-stats";

export default function HrActiveEmployee() {
  const summaryItems = [
    { label: "Total Active", value: "139 emp." },
    { label: "Not Yet Logged In", value: "7 emp." },
    { label: "On Leave", value: "2 emp." },
  ];

  // Hardcoded percentages following the AttendanceStats pattern
  const activeEmployeePercentages = {
    present: 80,
    late: 20,
    onLeave: 0,
  };

  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Active Employee</h1>
            <p className="text-muted-foreground text-sm">{today}</p>
          </div>
          <Separator />
          <ActiveEmployeeStats
            percentages={activeEmployeePercentages}
          />
        </div>
        <ActiveSummary items={summaryItems} />
      </div>

      <div className="relative h-full min-h-0 flex-1 overflow-auto">
        <ActiveEmployeeBoard />
      </div>
    </div>
  );
}