import { AlertCircle, Calendar, Clock, Clipboard } from "lucide-react";

import { KanbanBoard } from "../../_components/kanban";
import type { KanbanItemProps } from "../../_components/kanban/column";

import { ReportCard } from "./reports-card";
import { ReportDialog } from "./report-dialog";

type ReportItem = KanbanItemProps & {
  category: string;
  title: string;
  description: string;
  date: string;
  importance: "Low" | "Medium" | "High";
  status?: string;
  submittedBy?: string;
  assignedTo?: {
    name: string;
    image?: string;
  };
  icon?: React.ReactNode;
  onClick?: () => void;
};

export const ReportsBoard = () => {
  const inProgressItems: ReportItem[] = [
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

  const toReviewItems: ReportItem[] = [
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

  const resolvedItems: ReportItem[] = [
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

  const rejectedItems: ReportItem[] = [
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

  const columns = [
    {
      title: "In Progress",
      icon: <Clock className="size-4" />,
      items: inProgressItems,
    },
    {
      title: "To Review",
      icon: <Clipboard className="size-4" />,
      items: toReviewItems,
    },
    {
      title: "Resolved",
      icon: <Calendar className="size-4" />,
      items: resolvedItems,
    },
    {
      title: "Rejected",
      icon: <AlertCircle className="size-4" />,
      items: rejectedItems,
    },
  ];

  return (
    <KanbanBoard
      columns={columns}
      renderItem={(item, onClick) => (
        <ReportCard
          key={item.id}
          {...item}
          icon={columns.find((col) => col.items.includes(item))?.icon}
          onClick={onClick}
        />
      )}
      renderDialog={(selectedItem, isOpen, onOpenChange) => (
        <ReportDialog
          report={selectedItem}
          open={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
      emptyStateText="No reports"
      emptyStateSubText="Reports will appear here"
    />
  );
};
