import { useState } from "react";
import { AlertCircle, Clock, Clipboard, CheckCircle } from "lucide-react";

import { KanbanBoard } from "@/components/custom/kanban/board";
import type { KanbanItemProps } from "@/components/custom/kanban/column";
import { Skeleton } from "@/components/ui/skeleton";

import { DraggableReportCard } from "./draggable-report-card";
import { HrReportDialog } from "./hr-report-dialog";
import { AssignmentDialog } from "./assignment-dialog";
import { useAllReports } from "../mutations/useAllReports";

import type { ReportCardProps } from "@/features/employee/reports/components/reports-card";
import { format } from "date-fns";

type ReportItem = KanbanItemProps &
  Omit<ReportCardProps, "id"> & { id: string };

export const ReportsBoard = () => {
  const [assignmentDialog, setAssignmentDialog] = useState<{
    reportId: number | null;
    reportTitle: string;
    isOpen: boolean;
  }>({
    reportId: null,
    reportTitle: "",
    isOpen: false,
  });

  const { data: reportsData, isLoading } = useAllReports();

  console.log(reportsData);

  // Transform API data to match our KanbanBoard format
  const processReports = () => {
    if (!reportsData)
      return {
        toReviewItems: [],
        inProgressItems: [],
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
            ? {
                first_name: report.submitted_by.user_profiles.first_name,
                last_name: report.submitted_by.user_profiles.last_name || "",
                profile_image: report.submitted_by.user_profiles.profile_image,
              }
            : undefined,
          assignedTo: report.assigned_to?.user_profiles
            ? {
                first_name: report.assigned_to.user_profiles.first_name,
                last_name: report.assigned_to.user_profiles.last_name,
                profile_image: report.assigned_to.user_profiles.profile_image,
              }
            : undefined,
          rejectionReason: report.rejection_reason,
        };

        // Add to appropriate column based on status
        switch (report.status) {
          case "To Review":
            acc.toReviewItems.push(reportItem);
            break;
          case "In Progress":
            acc.inProgressItems.push(reportItem);
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
        toReviewItems: [] as ReportItem[],
        inProgressItems: [] as ReportItem[],
        resolvedItems: [] as ReportItem[],
        rejectedItems: [] as ReportItem[],
      },
    );
  };

  const { toReviewItems, inProgressItems, resolvedItems, rejectedItems } =
    processReports();

  const columns = [
    {
      id: "toReview",
      title: "To Assigned",
      icon: <Clipboard className="size-4" />,
      items: inProgressItems,
      allowDrop: false,
    },
    {
      id: "inProgress",
      title: "Assigned",
      icon: <Clock className="size-4" />,
      items: toReviewItems,
      allowDrop: true,
    },
    {
      id: "resolved",
      title: "Resolved",
      icon: <CheckCircle className="size-4" />,
      items: resolvedItems,
      allowDrop: false,
    },
    {
      id: "rejected",
      title: "Rejected",
      icon: <AlertCircle className="size-4" />,
      items: rejectedItems,
      allowDrop: false,
    },
  ];

  const handleItemDrop = (
    itemId: string,
    fromColumn: string,
    toColumn: string,
  ) => {
    // Only allow drop from "To Assigned" to "Assigned"
    if (fromColumn === "toReview" && toColumn === "inProgress") {
      const draggedReport = inProgressItems.find((item) => item.id === itemId);
      if (draggedReport) {
        setAssignmentDialog({
          reportId: parseInt(itemId),
          reportTitle: draggedReport.title,
          isOpen: true,
        });
      }
    }
  };

  if (isLoading) {
    return <BoardSkeleton />;
  }

  return (
    <>
      <KanbanBoard
        columns={columns}
        onItemDrop={handleItemDrop}
        renderItem={(item, onClick) => {
          const column = columns.find((col) => col.items.includes(item));
          const reportItem = item as ReportItem;

          return (
            <DraggableReportCard
              key={reportItem.id}
              id={reportItem.id}
              category={reportItem.category}
              title={reportItem.title}
              description={reportItem.description}
              date={reportItem.date}
              importance={reportItem.importance}
              status={reportItem.status}
              submittedBy={reportItem.submittedBy}
              assignedTo={reportItem.assignedTo}
              icon={column?.icon}
              onClick={onClick}
              columnId={column?.id || ""}
            />
          );
        }}
        renderDialog={(selectedItem, isOpen, onOpenChange) => {
          if (!selectedItem) return null;

          const reportItem = selectedItem as ReportItem;
          return (
            <HrReportDialog
              report={reportItem}
              open={isOpen}
              onOpenChange={onOpenChange}
            />
          );
        }}
        emptyStateText="No reports"
        emptyStateSubText="Reports will appear here"
      />

      <AssignmentDialog
        reportId={assignmentDialog.reportId}
        reportTitle={assignmentDialog.reportTitle}
        open={assignmentDialog.isOpen}
        onOpenChange={(open) =>
          setAssignmentDialog((prev) => ({ ...prev, isOpen: open }))
        }
      />
    </>
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
