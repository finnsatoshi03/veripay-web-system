import {
  Calendar,
  ArrowRight,
  Sun,
  CheckCircle,
  Clock,
  XCircle,
  User,
  FileText,
  AlertTriangle,
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
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>Leave Requests</span>
              <span>/</span>
              <span className="text-foreground font-medium">{request.id}</span>
            </div>

            <div className="space-y-4">
              <h1 className="pr-8 text-2xl leading-tight font-bold">
                {request.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1.5 ${getStatusStyles(request.status)}`}
                >
                  {getStatusIcon(request.status)}
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </Badge>

                <Badge variant="outline" className="flex items-center gap-1.5">
                  <Sun className="size-3" />
                  {request.days} days
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Content */}
          <div className="space-y-6">
            {/* Leave Details */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold">
                <Calendar className="text-muted-foreground size-4" />
                Leave Details
              </h3>

              <div className="grid grid-cols-1 gap-4 pl-6 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm font-medium">
                    Date Requested
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="text-muted-foreground size-3" />
                    {formatNotionDate(request.dateRequested)}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm font-medium">
                    Leave Period
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="text-muted-foreground size-3" />
                    {formatNotionDate(request.startDate)}
                    <ArrowRight className="text-muted-foreground size-3" />
                    {formatNotionDate(request.endDate)}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Reason */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="text-muted-foreground size-4" />
                <h3 className="font-semibold">Reason</h3>
              </div>
              <div className="pl-6">
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {request.reason}
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* People */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 font-semibold">
                <User className="text-muted-foreground size-4" />
                People
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Requested by */}
                <div className="space-y-3">
                  <h4 className="text-muted-foreground text-sm font-medium">
                    Requested by
                  </h4>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9 flex-shrink-0">
                      <AvatarImage
                        src={request.requestedBy.image}
                        alt={request.requestedBy.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {formatInitials(request.requestedBy.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {request.requestedBy.name}
                      </p>
                      <p className="text-muted-foreground text-xs">Employee</p>
                    </div>
                  </div>
                </div>

                {/* Reviewed by */}
                <div className="space-y-3">
                  <h4 className="text-muted-foreground text-sm font-medium">
                    Reviewed by
                  </h4>
                  {request.status !== "pending" && request.reviewedBy ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9 flex-shrink-0">
                        <AvatarImage
                          src={request.reviewedBy.image}
                          alt={request.reviewedBy.name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {formatInitials(request.reviewedBy.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">
                          {request.reviewedBy.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs">
                          <div
                            className={`size-2 rounded-full ${request.status === "approved" ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          <span
                            className={`font-medium ${request.status === "approved" ? "text-green-600" : "text-red-600"}`}
                          >
                            {request.status === "approved"
                              ? "Approved"
                              : "Rejected"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="bg-muted flex size-9 flex-shrink-0 items-center justify-center rounded-full">
                        <User className="text-muted-foreground size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-muted-foreground text-sm font-medium">
                          Pending review
                        </p>
                        <div className="flex items-center gap-1.5 text-xs">
                          <div className="size-2 rounded-full bg-amber-500"></div>
                          <span className="font-medium text-amber-600">
                            Awaiting decision
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rejection Reason */}
            {request.status === "rejected" && request.rejectionReason && (
              <>
                <Separator className="my-6" />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-4 text-red-600" />
                    <h3 className="font-semibold text-red-900">
                      Reason for Rejection
                    </h3>
                  </div>
                  <div className="pl-6">
                    <div className="rounded-r-md border-l-4 border-red-200 bg-red-50 p-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-red-800">
                        {request.rejectionReason}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
