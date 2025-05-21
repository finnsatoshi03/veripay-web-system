import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar } from "lucide-react";

// Define types for our data
type ReportStatus = "in-queue" | "in-progress" | "resolved" | "rejected";

type Report = {
  id: string;
  title: string;
  status: ReportStatus;
  date: string;
  tags: string[];
  detailsLink: string;
};

// Mock data
const mockReports: Report[] = [
  {
    id: "r1",
    title: "Incorrect Payroll Deductions",
    status: "in-queue",
    date: "July 16",
    tags: ["Payroll", "HR"],
    detailsLink: "/hr/reports/payroll-deductions",
  },
  {
    id: "r2",
    title: "Unpaid Overtime Hours",
    status: "in-queue",
    date: "July 15",
    tags: ["Payroll", "Compliance"],
    detailsLink: "/hr/reports/overtime-hours",
  },
  {
    id: "r3",
    title: "Missing Attendance Records",
    status: "in-progress",
    date: "July 14",
    tags: ["Attendance", "HR"],
    detailsLink: "/hr/reports/attendance-records",
  },
];

// Get status badge color
const getStatusBadgeProps = (status: ReportStatus) => {
  switch (status) {
    case "in-queue":
      return { className: "bg-yellow-500/10 text-yellow-600" };
    case "in-progress":
      return { className: "bg-blue-500/10 text-blue-600" };
    case "resolved":
      return { className: "bg-green-500/10 text-green-600" };
    case "rejected":
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

// Report Item component
const ReportItem = ({ report }: { report: Report }) => (
  <div className="space-y-1">
    <div className="flex justify-between">
      <Badge {...getStatusBadgeProps(report.status)}>
        {report.status
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </Badge>
      <div className="text-muted-foreground flex items-center gap-1 text-xs">
        <Calendar className="size-3.5" />
        <p>{report.date}</p>
      </div>
    </div>
    <h3 className="text-xl font-semibold">{report.title}</h3>
    <div className="flex justify-between">
      <div className="flex items-center gap-1">
        {report.tags.map((tag) => (
          <Badge key={tag} className="bg-muted-foreground/40 text-white">
            {tag}
          </Badge>
        ))}
      </div>
      <Link to={report.detailsLink}>
        <Button variant="link" className="!m-0 !h-fit !w-fit !p-0">
          View details <ArrowRight className="size-4" />
        </Button>
      </Link>
    </div>
  </div>
);

// Main component
export const ReportsOverview = () => {
  const reports = mockReports.slice(0, 2); // Show only two most recent reports

  return (
    <div className="w-full space-y-2 rounded-lg border p-2">
      <SummaryHeader />
      <div className="bg-border -mx-2 h-px px-2" />

      <div className="space-y-4">
        {reports.map((report) => (
          <ReportItem key={report.id} report={report} />
        ))}

        {reports.length === 0 && (
          <div className="py-4 text-center">
            <p className="text-muted-foreground">No reports to review</p>
          </div>
        )}
      </div>
    </div>
  );
};
