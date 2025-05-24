import { useState } from "react";
import { format, parseISO, differenceInDays } from "date-fns";
import { Calendar, Check, X, Clock } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { LeaveRequest } from "@/features/hr/_lib/types";

type LeaveApprovalDialogProps = {
  leave: LeaveRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (leaveId: number) => void;
  onReject: (leaveId: number, rejectionReason: string) => void;
  isLoading?: boolean;
};

export const LeaveApprovalDialog = ({
  leave,
  open,
  onOpenChange,
  onApprove,
  onReject,
  isLoading = false,
}: LeaveApprovalDialogProps) => {
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = () => {
    if (leave) {
      onApprove(leave.id);
      onOpenChange(false);
    }
  };

  const handleRejectClick = () => {
    setShowRejectionDialog(true);
    setRejectionReason("");
  };

  const handleRejectConfirm = () => {
    if (leave && rejectionReason.trim()) {
      onReject(leave.id, rejectionReason.trim());
      setShowRejectionDialog(false);
      setRejectionReason("");
      onOpenChange(false);
    }
  };

  const handleRejectCancel = () => {
    setShowRejectionDialog(false);
    setRejectionReason("");
  };

  if (!leave) return null;

  const employee = leave.employee_id.user_id;
  const userProfile = employee.user_profiles;
  const startDate = parseISO(leave.start_date);
  const endDate = parseISO(leave.end_date);
  const days = differenceInDays(endDate, startDate) + 1;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getLeaveColor = (leaveType: string) => {
    switch (leaveType.toLowerCase()) {
      case "vacation leave":
      case "vacation":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "sick leave":
      case "sick":
        return "bg-red-100 border-red-300 text-red-800";
      case "emergency leave":
      case "emergency":
        return "bg-orange-100 border-orange-300 text-orange-800";
      case "bereavement leave":
      case "bereavement":
        return "bg-purple-100 border-purple-300 text-purple-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  return (
    <>
      <Dialog open={open && !showRejectionDialog} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Leave Request</DialogTitle>
            <DialogDescription>
              Review and approve or reject this leave request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Employee Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={userProfile.profile_image || ""}
                  alt={`${userProfile.first_name} ${userProfile.last_name}`}
                />
                <AvatarFallback>
                  {getInitials(userProfile.first_name, userProfile.last_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {userProfile.first_name} {userProfile.last_name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {leave.employee_id.position_id?.positions?.title ||
                    "No position"}
                </p>
              </div>
            </div>

            {/* Leave Details */}
            <div className="space-y-3">
              <div>
                <Label className="text-muted-foreground text-xs">
                  Leave Type
                </Label>
                <Badge
                  variant="secondary"
                  className={`mt-1 ${getLeaveColor(leave.leave_type_id.name)}`}
                >
                  {leave.leave_type_id.name}
                </Badge>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs">
                  Duration
                </Label>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  {days === 1 ? (
                    <span>{format(startDate, "MMMM d, yyyy")}</span>
                  ) : (
                    <span>
                      {format(startDate, "MMM d")} -{" "}
                      {format(endDate, "MMM d, yyyy")} ({days} days)
                    </span>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs">
                  Requested
                </Label>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  {format(
                    parseISO(leave.requested_at),
                    "MMM d, yyyy 'at' h:mm a",
                  )}
                </div>
              </div>

              {leave.reason && (
                <div>
                  <Label className="text-muted-foreground text-xs">
                    Reason
                  </Label>
                  <p className="bg-border mt-1 rounded-md p-2 text-sm">
                    {leave.reason}
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectClick}
              disabled={isLoading}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isLoading}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <AlertDialog
        open={showRejectionDialog}
        onOpenChange={setShowRejectionDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Leave Request</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this leave request. This
              will be sent to the employee.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Rejection Reason</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleRejectCancel}
              disabled={isLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectConfirm}
              disabled={isLoading || !rejectionReason.trim()}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Reject Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
