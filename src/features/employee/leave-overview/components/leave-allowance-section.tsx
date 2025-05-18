import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { leaveAllowances } from "../../_lib/mock/mock-leaveAllowance";
import { LeaveAllowanceItem } from "./leave-allowance-item";

export const LeaveAllowanceSection = () => {
  const [showAllDialog, setShowAllDialog] = useState(false);

  const handleOpenDialog = () => setShowAllDialog(true);
  const handleCloseDialog = () => setShowAllDialog(false);

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium">Leave Allowance</h2>
        <Button size="sm" variant="outline" onClick={handleOpenDialog}>
          View All
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {leaveAllowances.slice(0, 3).map((leave, index) => (
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
            {leaveAllowances.map((leave, index) => (
              <LeaveAllowanceItem key={index} leave={leave} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
