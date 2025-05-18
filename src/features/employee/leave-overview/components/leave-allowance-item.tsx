import { cn } from "@/lib/utils";
import type { LeaveAllowance } from "../../_lib/mock/mock-leaveAllowance";

type LeaveAllowanceItemProps = {
  leave: LeaveAllowance;
};

export const LeaveAllowanceItem = ({ leave }: LeaveAllowanceItemProps) => {
  return (
    <div className="space-y-1">
      <div>
        <p className="text-muted-foreground text-sm">{leave.type} Remaining</p>
        <p className="flex items-end gap-2 text-2xl font-medium">
          {leave.remaining} days{" "}
          <span className="text-muted-foreground mb-1 text-base font-normal">
            ({leave.percentRemaining}% of {leave.total} days)
          </span>
        </p>
      </div>

      <div
        className={cn(
          "flex w-full items-center",
          leave.percentRemaining === 100 || leave.percentUsed === 100
            ? ""
            : "gap-1",
        )}
      >
        <div
          className={`${leave.colorClass} h-5 rounded`}
          style={{ width: `${leave.percentUsed}%` }}
        ></div>
        <div
          className="bg-muted-foreground/20 h-5 rounded"
          style={{ width: `${leave.percentRemaining}%` }}
        ></div>
      </div>

      <div>
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <div className={`${leave.colorClass} size-3.5 rounded`}></div>
            <p className="text-muted-foreground text-sm">Used</p>
          </div>
          <p className="flex gap-1 text-sm">
            {leave.used} days{" "}
            <span className="text-muted-foreground">
              ({leave.percentUsed}%)
            </span>
          </p>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <div className="bg-muted-foreground/20 size-3.5 rounded"></div>
            <p className="text-muted-foreground text-sm">Remaining</p>
          </div>
          <p className="flex gap-1 text-sm">
            {leave.remaining} days{" "}
            <span className="text-muted-foreground">
              ({leave.percentRemaining}%)
            </span>
          </p>
        </div>

        <div className="flex justify-between">
          <p className="text-muted-foreground text-sm">Total</p>
          <p className="text-sm font-medium">{leave.total} days</p>
        </div>
      </div>
    </div>
  );
};
