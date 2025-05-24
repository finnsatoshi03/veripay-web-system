import { Search } from "@/components/custom/search";

import { ReportsBoard } from "./components/reports-board";

import { today } from "@/features/employee/_lib/helpers";

export default function HrReports() {
  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
      <div className="space-y-2">
        <div>
          <h1 className="text-3xl font-bold">Reports History</h1>
          <p className="text-muted-foreground text-sm">{today}</p>
        </div>
      </div>

      <Search placeholder="Search reports details" />
      <div className="relative h-full min-h-0 flex-1 overflow-auto">
        <ReportsBoard />
      </div>
    </div>
  );
}
