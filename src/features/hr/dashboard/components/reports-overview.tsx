import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Calendar } from "lucide-react";
import {
  useReportsToReview,
  type Report,
} from "../mutations/useReportsToReview";
import Error from "@/features/error/Error";
import { ReportDialog } from "@/features/employee/reports/components/report-dialog";
import type { ReportCardProps } from "@/features/employee/reports/components/reports-card";

// Define types for our data - updated to match service response
type ReportStatus = "To Review" | "In Progress" | "Resolved" | "Rejected";

// Transform Report data to ReportCardProps format
const transformReportForDialog = (report: Report): ReportCardProps => {
  return {
    id: report.id,
    category: report.category,
    title: report.title,
    description: report.description,
    date: report.submitted_at || report.created_at,
    importance: report.flag_level === "Normal" ? "Medium" : report.flag_level,
    status: report.status,
    submittedBy: report.submitted_by
      ? `${report.submitted_by.user_profiles.first_name} ${report.submitted_by.user_profiles.last_name}`
      : undefined,
    assignedTo: report.assigned_to
      ? {
          first_name: report.assigned_to.user_profiles.first_name,
          last_name: report.assigned_to.user_profiles.last_name,
          image: report.assigned_to.user_profiles.profile_image,
        }
      : undefined,
  };
};

// Get status badge color - updated to match new status values
const getStatusBadgeProps = (status: ReportStatus) => {
  switch (status) {
    case "To Review":
      return { className: "bg-yellow-500/10 text-yellow-600" };
    case "In Progress":
      return { className: "bg-blue-500/10 text-blue-600" };
    case "Resolved":
      return { className: "bg-green-500/10 text-green-600" };
    case "Rejected":
      return { className: "bg-red-500/10 text-red-600" };
    default:
      return { className: "" };
  }
};

// Header component
const SummaryHeader = () => (
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold">Reports to Review</h2>
    <Link to="/hr/reports">
      <Button variant="outline" size="sm">
        Review Reports
      </Button>
    </Link>
  </div>
);

// Loading skeleton component
const ReportSkeleton = () => (
  <div className="space-y-1">
    <div className="flex justify-between">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-4 w-16" />
    </div>
    <Skeleton className="h-6 w-3/4" />
    <div className="flex justify-between">
      <div className="flex items-center gap-1">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-12" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

// Report Item component - updated to work with new data structure and dialog
const ReportItem = ({
  report,
  onViewDetails,
}: {
  report: Report;
  onViewDetails: (report: Report) => void;
}) => {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  // Get tags from category and flag_level
  const tags = [report.category, report.flag_level].filter(Boolean);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onViewDetails(report);
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <Badge {...getStatusBadgeProps(report.status)}>{report.status}</Badge>
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Calendar className="size-3.5" />
          <p>{formatDate(report.submitted_at || report.created_at)}</p>
        </div>
      </div>
      <h3 className="text-xl font-semibold">{report.title}</h3>
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          {tags.map((tag) => (
            <Badge key={tag} className="bg-muted-foreground/40 text-white">
              {tag}
            </Badge>
          ))}
        </div>
        <Button
          variant="link"
          className="!m-0 !h-fit !w-fit !p-0"
          onClick={() => onViewDetails(report)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label={`View details for ${report.title}`}
        >
          View details <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};

// Main component
export const ReportsOverview = () => {
  const { data: reports, isLoading, error, refetch } = useReportsToReview();
  const [selectedReport, setSelectedReport] = useState<ReportCardProps | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (report: Report) => {
    const transformedReport = transformReportForDialog(report);
    setSelectedReport(transformedReport);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedReport(null);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full space-y-2 rounded-lg border p-2">
        <SummaryHeader />
        <div className="bg-border -mx-2 h-px px-2" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <ReportSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full space-y-2 rounded-lg border p-2">
        <SummaryHeader />
        <div className="bg-border -mx-2 h-px px-2" />
        <Error
          title="Failed to load reports"
          message="Unable to fetch reports to review. Please try again."
          action={{
            label: "Retry",
            onClick: () => refetch(),
          }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-2 rounded-lg border p-2">
        <SummaryHeader />
        <div className="bg-border -mx-2 h-px px-2" />

        <div className="space-y-4">
          {reports && reports.length > 0 ? (
            reports.map((report) => (
              <ReportItem
                key={report.id}
                report={report}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <div className="py-4 text-center">
              <p className="text-muted-foreground">No reports to review</p>
            </div>
          )}
        </div>
      </div>

      {/* Report Dialog */}
      <ReportDialog
        report={selectedReport}
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
      />
    </>
  );
};
