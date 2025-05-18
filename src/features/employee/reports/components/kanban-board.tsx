import { useState } from "react";
import { AlertCircle, Calendar, Clock, Clipboard } from "lucide-react";

import { type KanbanCardProps } from "./kanban-card";
import { type KanbanColumnProps, KanbanColumn } from "./kanban-column";
import { ReportDialog } from "./report-dialog";
import { CreateReportForm } from "./create-report-form";

export const KanbanBoard = () => {
  const [selectedReport, setSelectedReport] = useState<KanbanCardProps | null>(
    null,
  );
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const handleCardClick = (card: KanbanCardProps) => {
    setSelectedReport(card);
    setIsReportDialogOpen(true);
  };

  // Sample data
  const inProgressItems: KanbanCardProps[] = [
    {
      id: "RPT-2023-1001",
      category: "HR",
      title: "Performance Review Template",
      description:
        "Creating a standardized template for quarterly performance reviews",
      date: "Jul 21, 2023",
      importance: "Medium",
      status: "In Progress",
      submittedBy: "John Doe",
    },
  ];

  const toReviewItems: KanbanCardProps[] = [
    {
      id: "RPT-2023-1002",
      category: "Payroll",
      title: "Salary Adjustment Report",
      description: "Annual salary adjustment report for the finance department",
      date: "Jul 15, 2023",
      importance: "High",
      status: "To Review",
      submittedBy: "Jane Smith",
      assignedTo: {
        name: "John Doe",
        image: "https://github.com/shadcn.png",
      },
    },
  ];

  const resolvedItems: KanbanCardProps[] = [
    {
      id: "RPT-2023-1003",
      category: "Compliance",
      title: "Work Safety Guidelines",
      description:
        "Updated safety guidelines for remote workers in line with new regulations",
      date: "Jul 10, 2023",
      importance: "High",
      status: "Resolved",
      submittedBy: "Peter Parker",
      assignedTo: {
        name: "Jane Smith",
        image: "https://github.com/shadcn.png",
      },
    },
  ];

  const rejectedItems: KanbanCardProps[] = [
    {
      id: "RPT-2023-1004",
      category: "Training",
      title: "Training Budget Request",
      description: "Department budget request for external training program",
      date: "Jul 5, 2023",
      importance: "Low",
      status: "Rejected",
      submittedBy: "Mary Jane",
      assignedTo: {
        name: "Peter Parker",
        image: "https://github.com/shadcn.png",
      },
    },
  ];

  const columns: KanbanColumnProps[] = [
    {
      title: "In Progress",
      items: inProgressItems,
      icon: <Clock className="size-4" />,
      onCardClick: handleCardClick,
    },
    {
      title: "To Review",
      items: toReviewItems,
      icon: <Clipboard className="size-4" />,
      onCardClick: handleCardClick,
    },
    {
      title: "Resolved",
      items: resolvedItems,
      icon: <Calendar className="size-4" />,
      onCardClick: handleCardClick,
    },
    {
      title: "Rejected",
      items: rejectedItems,
      icon: <AlertCircle className="size-4" />,
      onCardClick: handleCardClick,
    },
  ];

  return (
    <>
      <div className="flex h-full w-full gap-4 p-1">
        {columns.map((column) => (
          <KanbanColumn
            key={column.title}
            title={column.title}
            items={column.items}
            icon={column.icon}
            onCardClick={column.onCardClick}
          />
        ))}
      </div>

      {/* Report Detail Dialog */}
      <ReportDialog
        report={selectedReport}
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
      />

      {/* Create Report Form */}
      <CreateReportForm
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
      />
    </>
  );
};
