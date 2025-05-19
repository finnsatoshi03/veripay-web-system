import {
  Calendar,
  ArrowRight,
  Sun,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatInitials, formatNotionDate } from "@/lib/helpers/formatters";
import type { LeaveRequestCardProps } from "./leave-request-card";

interface LeaveRequestDialogProps {
  request: LeaveRequestCardProps | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LeaveRequestDialog = ({
  request,
  open,
  onOpenChange,
}: LeaveRequestDialogProps) => {
  if (!request) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="size-4" />;
      case "approved":
        return <CheckCircle className="size-4" />;
      case "rejected":
        return <XCircle className="size-4" />;
      default:
        return <Clock className="size-4" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span>Leave Requests</span>
            <span>/</span>
            <span className="text-muted-foreground text-sm">{request.id}</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold">{request.title}</h2>
          <Separator />

          {/* Grid layout for details */}
          <div className="grid grid-cols-[200px_1fr] gap-y-6">
            {/* Date Requested */}
            <div className="text-muted-foreground text-sm">Date Requested</div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="size-4" />
              {formatNotionDate(request.dateRequested)}
            </div>

            {/* Start & End Date */}
            <div className="text-muted-foreground text-sm">
              Start & End Date
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="size-4" />
              {formatNotionDate(request.startDate)}
              <ArrowRight className="size-4" />
              <Calendar className="size-4" />
              {formatNotionDate(request.endDate)}
            </div>

            {/* Leave Span */}
            <div className="text-muted-foreground text-sm">Leave Span</div>
            <div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Sun className="size-3.5" />
                {request.days} days
              </Badge>
            </div>

            {/* Status */}
            <div className="text-muted-foreground text-sm">Status</div>
            <div>
              <Badge
                className={`flex items-center gap-1 ${getStatusStyles(request.status)}`}
              >
                {getStatusIcon(request.status)}
                {request.status.charAt(0).toUpperCase() +
                  request.status.slice(1)}
              </Badge>
            </div>

            {/* Reviewed By - Only if not pending */}
            {request.status !== "pending" && request.reviewedBy && (
              <>
                <div className="text-muted-foreground text-sm">Reviewed by</div>
                <div className="flex items-center gap-2">
                  <Avatar className="size-6 rounded-md">
                    <AvatarImage
                      src={request.reviewedBy.image}
                      alt={request.reviewedBy.name}
                    />
                    <AvatarFallback className="rounded-md">
                      {formatInitials(request.reviewedBy.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{request.reviewedBy.name}</span>
                </div>
              </>
            )}

            {/* Requested By */}
            <div className="text-muted-foreground text-sm">Requested by</div>
            <div className="flex items-center gap-2">
              <Avatar className="size-6 rounded-md">
                <AvatarImage
                  src={request.requestedBy.image}
                  alt={request.requestedBy.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary rounded-md">
                  {formatInitials(request.requestedBy.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{request.requestedBy.name}</span>
            </div>

            {/* Reason */}
            <div className="text-muted-foreground text-sm">Reason</div>
            <div className="text-sm whitespace-pre-wrap">{request.reason}</div>

            {/* Rejection Reason - Only if rejected */}
            {request.status === "rejected" && request.rejectionReason && (
              <>
                <div className="text-muted-foreground text-sm">
                  Reason for Rejection
                </div>
                <div className="text-sm whitespace-pre-wrap">
                  {request.rejectionReason}
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
