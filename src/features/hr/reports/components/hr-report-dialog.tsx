import { useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Clipboard,
  AlertCircle,
  XCircle,
  User,
  Tag,
  FileText,
  Shield,
  AlertTriangle,
} from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { formatInitials, formatNotionDate } from "@/lib/helpers/formatters";
import { useUpdateReportStatus } from "../mutations/useUpdateReportStatus";
import { RejectionDialog } from "./rejection-dialog";

import type { ReportCardProps } from "@/features/employee/reports/components/reports-card";

interface HrReportDialogProps {
  report: ReportCardProps | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HrReportDialog = ({
  report,
  open,
  onOpenChange,
}: HrReportDialogProps) => {
  const [rejectionDialog, setRejectionDialog] = useState<{
    isOpen: boolean;
    reportId: number | null;
    reportTitle: string;
  }>({
    isOpen: false,
    reportId: null,
    reportTitle: "",
  });

  const updateStatusMutation = useUpdateReportStatus();

  if (!report) return null;

  const reportId =
    report.id ||
    `RPT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Progress":
        return <Clock className="size-4" />;
      case "To Review":
        return <Clipboard className="size-4" />;
      case "Resolved":
        return <CheckCircle className="size-4" />;
      case "Rejected":
        return <AlertCircle className="size-4" />;
      default:
        return <Clock className="size-4" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "To Review":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Resolved":
        return "bg-green-100 text-green-700 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getImportanceBadgeStyles = (importance: string) => {
    switch (importance) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
      case "Normal":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleResolve = () => {
    if (!report.id) return;

    updateStatusMutation.mutate(
      {
        reportId: parseInt(report.id),
        status: "Resolved",
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const handleRejectClick = () => {
    if (!report.id) return;

    setRejectionDialog({
      isOpen: true,
      reportId: parseInt(report.id),
      reportTitle: report.title,
    });
  };

  const status = report.status || "To Review";
  const assignedToName = report.assignedTo
    ? `${report.assignedTo.first_name} ${report.assignedTo.last_name}`.trim()
    : "";

  const submittedByName =
    typeof report.submittedBy === "object" && report.submittedBy
      ? `${report.submittedBy.first_name} ${report.submittedBy.last_name}`.trim()
      : report.submittedBy || "Unknown";

  const canTakeAction = status === "To Review";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[650px]">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <span>HR Portal</span>
                  <span>/</span>
                  <span>Reports</span>
                  <span>/</span>
                  <span className="text-foreground font-medium">
                    {reportId}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 border-blue-200 bg-blue-50 text-blue-700"
                >
                  <Shield className="size-3" />
                  HR Review
                </Badge>
              </div>

              <div className="space-y-4">
                <h1 className="pr-8 text-2xl leading-tight font-bold">
                  {report.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1.5 ${getStatusStyles(status)}`}
                  >
                    {getStatusIcon(status)}
                    {status}
                  </Badge>

                  <Badge
                    variant="outline"
                    className="flex items-center gap-1.5"
                  >
                    <Tag className="size-3" />
                    {report.category}
                  </Badge>

                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1.5 ${getImportanceBadgeStyles(report.importance)}`}
                  >
                    {report.importance} Priority
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Content */}
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="text-muted-foreground size-4" />
                  <h3 className="font-semibold">Report Details</h3>
                </div>
                <div className="pl-6">
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                    {report.description}
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* People & Timeline */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <User className="text-muted-foreground size-4" />
                  People & Timeline
                </h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Submitted by */}
                  <div className="space-y-3">
                    <h4 className="text-muted-foreground text-sm font-medium">
                      Submitted by
                    </h4>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9 flex-shrink-0">
                        <AvatarImage
                          src={
                            typeof report.submittedBy === "object"
                              ? report.submittedBy?.profile_image
                              : undefined
                          }
                          alt={submittedByName}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {formatInitials(submittedByName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{submittedByName}</p>
                        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <Calendar className="size-3" />
                          {formatNotionDate(report.date)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assigned to */}
                  <div className="space-y-3">
                    <h4 className="text-muted-foreground text-sm font-medium">
                      Assigned to
                    </h4>
                    {report.assignedTo && assignedToName ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 flex-shrink-0">
                          <AvatarImage
                            src={report.assignedTo.profile_image}
                            alt={assignedToName}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {formatInitials(assignedToName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">
                            {assignedToName}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs">
                            <div className="size-2 rounded-full bg-green-500"></div>
                            <span className="font-medium text-green-600">
                              Assigned
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
                            Not assigned
                          </p>
                          <div className="flex items-center gap-1.5 text-xs">
                            <div className="size-2 rounded-full bg-amber-500"></div>
                            <span className="font-medium text-amber-600">
                              Pending
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rejection Reason */}
              {status === "Rejected" && report.rejectionReason && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="size-4 text-red-600" />
                      <h3 className="font-semibold text-red-900">
                        Rejection Reason
                      </h3>
                    </div>
                    <div className="pl-6">
                      <div className="rounded-r-md border-l-4 border-red-200 bg-red-50 p-4">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-red-800">
                          {report.rejectionReason}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* HR Actions */}
            {canTakeAction && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Shield className="text-muted-foreground size-4" />
                    <span>HR Actions</span>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50"
                      onClick={handleRejectClick}
                      disabled={updateStatusMutation.isPending}
                    >
                      <XCircle className="mr-2 size-4" />
                      Reject Report
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={handleResolve}
                      disabled={updateStatusMutation.isPending}
                    >
                      <CheckCircle className="mr-2 size-4" />
                      Resolve Report
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <RejectionDialog
        reportId={rejectionDialog.reportId}
        reportTitle={rejectionDialog.reportTitle}
        open={rejectionDialog.isOpen}
        onOpenChange={(open) =>
          setRejectionDialog((prev) => ({ ...prev, isOpen: open }))
        }
      />
    </>
  );
};
