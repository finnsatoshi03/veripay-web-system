import { useState } from "react";
import { XCircle, LoaderIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateReportStatus } from "../mutations/useUpdateReportStatus";

interface RejectionDialogProps {
  reportId: number | null;
  reportTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RejectionDialog = ({
  reportId,
  reportTitle,
  open,
  onOpenChange,
}: RejectionDialogProps) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const updateStatusMutation = useUpdateReportStatus();

  const handleReject = () => {
    if (!reportId || !rejectionReason.trim()) return;

    updateStatusMutation.mutate(
      {
        reportId,
        status: "Rejected",
        rejectionReason: rejectionReason.trim(),
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setRejectionReason("");
        },
      },
    );
  };

  const handleCancel = () => {
    onOpenChange(false);
    setRejectionReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="size-5 text-red-500" />
            Reject Report
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting "{reportTitle}". This will
            help the submitter understand the decision.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rejection Reason</label>
            <Textarea
              placeholder="Explain why this report is being rejected..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={!rejectionReason.trim() || updateStatusMutation.isPending}
          >
            {updateStatusMutation.isPending && (
              <LoaderIcon className="mr-2 size-4 animate-spin" />
            )}
            Reject Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
