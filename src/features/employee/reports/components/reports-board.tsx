import { AlertCircle, Calendar, Clock, Clipboard } from "lucide-react";

import { KanbanBoard } from "@/components/custom/kanban/board";
import type { KanbanItemProps } from "@/components/custom/kanban/column";
import { Skeleton } from "@/components/ui/skeleton";

import { ReportCard } from "./reports-card";
import type { ReportCardProps } from "./reports-card";
import { ReportDialog } from "./report-dialog";
import { useReportsByUser } from "@/features/employee/_mutations/useReportsByUser";
import { useUserStore } from "@/store/userStore";
import { format } from "date-fns";

type ReportItem = KanbanItemProps & Omit<ReportCardProps, "id">;

export const ReportsBoard = () => {
  const { id: userId } = useUserStore();
  const { data: reportsData, isLoading } = useReportsByUser(userId || 0);

  // Transform API data to match our KanbanBoard format
  const processReports = () => {
    if (!reportsData)
      return {
        inProgressItems: [],
        toReviewItems: [],
        resolvedItems: [],
        rejectedItems: [],
      };

    return reportsData.reduce(
      (acc, report) => {
        // Handle the type mismatch between "Normal" in the DB and "Medium" in the UI
        const importanceMapped =
          report.flag_level === "Normal" ? "Medium" : report.flag_level;

        const reportItem: ReportItem = {
          id: report.id.toString(),
          category: report.category,
          title: report.title,
          description: report.description,
          date: format(new Date(report.submitted_at), "MMM d, yyyy"),
          importance: importanceMapped as ReportCardProps["importance"],
          status: report.status,
          submittedBy: report.submitted_by?.user_profiles?.first_name
            ? `${report.submitted_by.user_profiles.first_name} ${report.submitted_by.user_profiles.last_name || ""}`
            : "Unknown",
          assignedTo: report.assigned_to?.user_profiles,
        };

        // Add to appropriate column based on status
        switch (report.status) {
          case "In Progress":
            acc.inProgressItems.push(reportItem);
            break;
          case "To Review":
            acc.toReviewItems.push(reportItem);
            break;
          case "Resolved":
            acc.resolvedItems.push(reportItem);
            break;
          case "Rejected":
            acc.rejectedItems.push(reportItem);
            break;
        }

        return acc;
      },
      {
        inProgressItems: [] as ReportItem[],
        toReviewItems: [] as ReportItem[],
        resolvedItems: [] as ReportItem[],
        rejectedItems: [] as ReportItem[],
      },
    );
  };

  const { inProgressItems, toReviewItems, resolvedItems, rejectedItems } =
    processReports();

  const columns = [
    {
      id: "in-progress",
      title: "In Progress",
      icon: <Clock className="size-4" />,
      items: inProgressItems,
    },
    {
      id: "to-review",
      title: "To Review",
      icon: <Clipboard className="size-4" />,
      items: toReviewItems,
    },
    {
      id: "resolved",
      title: "Resolved",
      icon: <Calendar className="size-4" />,
      items: resolvedItems,
    },
    {
      id: "rejected",
      title: "Rejected",
      icon: <AlertCircle className="size-4" />,
      items: rejectedItems,
    },
  ];

  if (isLoading) {
    return <BoardSkeleton />;
  }

  return (
    <KanbanBoard
      columns={columns}
      renderItem={(item, onClick) => {
        // Type safety: item has all the properties needed for ReportCard
        const reportItem = item as unknown as ReportCardProps;
        return (
          <ReportCard
            key={reportItem.id}
            {...reportItem}
            icon={columns.find((col) => col.items.includes(item))?.icon}
            onClick={onClick}
          />
        );
      }}
      renderDialog={(selectedItem, isOpen, onOpenChange) => {
        // Handle the case where selectedItem could be null
        if (!selectedItem) {
          return null;
        }

        // Type safety
        const reportItem = selectedItem as unknown as ReportCardProps;
        return (
          <ReportDialog
            report={reportItem}
            open={isOpen}
            onOpenChange={onOpenChange}
          />
        );
      }}
      emptyStateText="No reports"
      emptyStateSubText="Reports will appear here"
    />
  );
};

const BoardSkeleton = () => {
  return (
    <div className="flex h-full w-full gap-4">
      {[1, 2, 3, 4].map((column) => (
        <div
          key={column}
          className="bg-card w-72 flex-shrink-0 rounded-lg border p-4"
        >
          <div className="flex justify-between pb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          {[1, 2].map((item) => (
            <div key={item} className="mb-3 space-y-2 rounded-md border p-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-5 w-full" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
