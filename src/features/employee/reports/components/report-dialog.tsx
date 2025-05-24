import {
  Calendar,
  CheckCircle,
  Clock,
  Clipboard,
  AlertCircle,
} from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { formatInitials, formatNotionDate } from "@/lib/helpers/formatters";

import type { ReportCardProps } from "./reports-card";

interface ReportDialogProps {
  report: ReportCardProps | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReportDialog = ({
  report,
  open,
  onOpenChange,
}: ReportDialogProps) => {
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
        return "bg-blue-100 text-blue-700";
      case "To Review":
        return "bg-yellow-100 text-yellow-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const status = report.status || "In Progress";
  const assignedToName = `${report.assignedTo?.first_name} ${report.assignedTo?.last_name}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span>Reports</span>
            <span>/</span>
            <span className="text-muted-foreground text-sm">{reportId}</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold">{report.title}</h2>
          <Separator />

          {/* Grid layout for details - Notion style with labels on left */}
          <div className="grid grid-cols-[200px_1fr] gap-y-6">
            {/* Category */}
            <div className="text-muted-foreground text-sm">Category</div>
            <div>
              <Badge variant="outline" className="flex items-center gap-1">
                {report.icon}
                {report.category}
              </Badge>
            </div>

            {/* Status */}
            <div className="text-muted-foreground text-sm">Status</div>
            <div>
              <Badge
                className={`flex items-center gap-1 ${getStatusStyles(status)}`}
              >
                {getStatusIcon(status)}
                {status}
              </Badge>
            </div>

            {/* Assigned To */}
            <div className="text-muted-foreground text-sm">Assigned to</div>
            <div>
              {report.assignedTo ? (
                <div className="flex items-center gap-2">
                  <Avatar className="size-6 rounded-md">
                    <AvatarImage
                      src={report.assignedTo.profile_image}
                      alt={assignedToName}
                    />
                    <AvatarFallback>
                      {formatInitials(assignedToName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{assignedToName}</span>
                </div>
              ) : (
                <span className="text-sm">Not assigned</span>
              )}
            </div>

            {/* Submitted At */}
            <div className="text-muted-foreground text-sm">Submitted at</div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="size-4 text-sm" />
              {formatNotionDate(report.date)}
            </div>

            {/* Submitted By */}
            <div className="text-muted-foreground text-muted-foreground text-sm">
              Submitted by
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="size-6 rounded-md">
                <AvatarImage
                  src={report.submittedBy?.profile_image}
                  alt={`${report.submittedBy?.first_name} ${report.submittedBy?.last_name}`}
                />
                <AvatarFallback className="bg-primary/10 text-primary rounded-md">
                  {formatInitials(report.submittedBy?.first_name || "You")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">
                {report.submittedBy?.first_name && report.submittedBy?.last_name
                  ? `${report.submittedBy?.first_name} ${report.submittedBy?.last_name}`
                  : "You"}
              </span>
            </div>

            {/* Importance */}
            <div className="text-muted-foreground text-sm">Importance</div>
            <div>
              <Badge
                className={` ${
                  report.importance === "High"
                    ? "bg-red-100 text-red-700"
                    : report.importance === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                } `}
              >
                {report.importance}
              </Badge>
            </div>

            {/* Description */}
            <div className="text-muted-foreground text-sm">Description</div>
            <div className="text-sm whitespace-pre-wrap">
              {report.description}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
