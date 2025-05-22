import { useState } from "react";
import { Calendar1, Plus } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useReportsByUser } from "../mutations/useReportsByUser";
import { useUserStore } from "@/store/userStore";
import { CreateReportForm } from "../../reports/components/create-report-form";
import { cn } from "@/lib/utils";

// types
type Report = {
  id: number;
  category: "Attendance" | "Payroll";
  status: "In Progress" | "To Review" | "Resolved" | "Rejected";
  assigned_to: number | null;
  submitted_by: number;
  submitted_at: string;
  description: string;
  flag_level: "Low" | "Normal" | "High";
  created_at: string;
};

interface ReportCardProps {
  report: Report;
}

// components
const ReportCard = ({ report }: ReportCardProps) => {
  const { status, description, category, flag_level, submitted_at } = report;

  const formattedDate = submitted_at
    ? format(new Date(submitted_at), "MMMM d")
    : "Date not available";

  const categoryColor = (status: string) => {
    if (status === "In Progress") return "bg-primary";
    if (status === "To Review") return "bg-secondary";
    if (status === "Resolved") return "bg-green-500";
    if (status === "Rejected") return "bg-red-500";
  };

  return (
    <div>
      <Badge className={cn(categoryColor(status), "text-white")}>
        {status}
      </Badge>
      <h1 className="text-xl font-semibold">{description}</h1>
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <Badge variant="outline">{category}</Badge>
          <Badge variant="outline">{flag_level}</Badge>
        </div>
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          <Calendar1 className="size-4" />
          {formattedDate}
        </div>
      </div>
    </div>
  );
};

const ReportsSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-6 w-20" />
    <Skeleton className="h-7 w-3/4" />
    <div className="flex justify-between">
      <div className="flex gap-1">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-5 w-24" />
    </div>
  </div>
);

// main component
export const ReportsStatus = () => {
  const { id } = useUserStore();
  const { data: reportsData, isLoading: isLoadingReports } = useReportsByUser(
    id || 0,
  );

  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);

  const handleOpenRequestForm = () => setIsRequestFormOpen(true);

  return (
    <div className="w-full space-y-2 rounded-lg border p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Reports</h2>
        <Button variant="outline" size="sm" onClick={handleOpenRequestForm}>
          <Plus className="size-4" />
          New Report
        </Button>
      </div>
      <div className="bg-border -mx-2 h-px px-2" />

      {isLoadingReports ? (
        <ReportsSkeleton />
      ) : reportsData && reportsData.length > 0 ? (
        <div className="space-y-4">
          {reportsData.slice(0, 3).map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground py-2 text-center">
          No reports found
        </p>
      )}

      {/* form */}
      <CreateReportForm
        open={isRequestFormOpen}
        onOpenChange={setIsRequestFormOpen}
      />
    </div>
  );
};
