import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { LeaveAllowanceItem } from "./leave-allowance-item";
import type { LeaveAllowance } from "../../_lib/mock/mock-leaveAllowance";

interface LeaveAllowanceSectionProps {
  allowances?: LeaveAllowance[];
  isLoading?: boolean;
}

export const LeaveAllowanceSection = ({
  allowances = [],
  isLoading = false,
}: LeaveAllowanceSectionProps) => {
  const [showAllDialog, setShowAllDialog] = useState(false);

  const handleOpenDialog = () => setShowAllDialog(true);
  const handleCloseDialog = () => setShowAllDialog(false);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between">
          <h2 className="text-lg font-medium">Leave Allowance</h2>
          <Button size="sm" variant="outline" disabled>
            View All
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-muted/50 h-32 animate-pulse rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (allowances.length === 0) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between">
          <h2 className="text-lg font-medium">Leave Allowance</h2>
          <Button size="sm" variant="outline" disabled>
            View All
          </Button>
        </div>
        <div className="text-muted-foreground flex h-32 items-center justify-center rounded border border-dashed">
          No leave allowances available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium">Leave Allowance</h2>
        <Button size="sm" variant="outline" onClick={handleOpenDialog}>
          View All
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {allowances.slice(0, 3).map((leave, index) => (
          <LeaveAllowanceItem key={index} leave={leave} />
        ))}
      </div>

      <Dialog open={showAllDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Leave Allowance
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6">
            {allowances.map((leave, index) => (
              <LeaveAllowanceItem key={index} leave={leave} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
