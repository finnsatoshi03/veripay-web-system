import ActiveEmployeeBoard from "./components/active-employee-board";
import { ActiveEmployeeStats } from "./components/active-employee-stats";
import { ActiveSummary } from "./components/active-summary";

import { Separator } from "@/components/ui/separator";

import { useActiveEmployees } from "./mutations/useActiveEmployees";

import { today } from "@/features/employee/_lib/helpers";

export default function HrActiveEmployee() {
  const { data, isLoading } = useActiveEmployees();

  // Create summary items from real data
  const summaryItems = [
    { label: "Total Active", value: data?.summary.total.toString() || "0" },
    { label: "Logged In", value: data?.summary.loggedIn.toString() || "0" },
    {
      label: "Not Yet Logged In",
      value: data?.summary.notLoggedIn.toString() || "0",
    },
    { label: "On Leave", value: data?.summary.onLeave.toString() || "0" },
    { label: "Absent", value: data?.summary.absent.toString() || "0" },
  ];

  // Calculate percentages for the stats component
  const activeEmployeePercentages = {
    present: data?.summary.percentages.loggedIn || 0,
    late: 0, // You can add late logic later
    onLeave: data?.summary.percentages.onLeave || 0,
    absent: data?.summary.percentages.absent || 0,
  };

  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
      <div className="flex justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Active Employee</h1>
            <p className="text-muted-foreground text-sm">{today}</p>
          </div>
          <Separator />
          <ActiveEmployeeStats
            percentages={activeEmployeePercentages}
            isLoading={isLoading}
          />
        </div>
        <ActiveSummary items={summaryItems} isLoading={isLoading} />
      </div>

      <div className="relative h-full min-h-0 flex-1 overflow-auto">
        <ActiveEmployeeBoard isLoading={isLoading} />
      </div>
    </div>
  );
}
