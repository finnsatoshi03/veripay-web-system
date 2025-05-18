import { AlertCircle, Calendar, Clock, Clipboard } from "lucide-react";

import type { KanbanCardProps } from "./kanban-card";
import { KanbanColumn, type KanbanColumnProps } from "./kanban-column";

export const KanbanBoard = () => {
  const inProgressItems: KanbanCardProps[] = [
    {
      category: "HR",
      title: "Performance Review Template",
      description:
        "Creating a standardized template for quarterly performance reviews",
      date: "Jul 21, 2023",
      importance: "Medium",
    },
  ];

  const toReviewItems: KanbanCardProps[] = [
    {
      category: "Payroll",
      title: "Salary Adjustment Report",
      description: "Annual salary adjustment report for the finance department",
      date: "Jul 15, 2023",
      importance: "High",
      assignedTo: {
        name: "John Doe",
        image: "https://github.com/shadcn.png",
      },
    },
  ];

  const resolvedItems: KanbanCardProps[] = [
    {
      category: "Compliance",
      title: "Work Safety Guidelines",
      description:
        "Updated safety guidelines for remote workers in line with new regulations",
      date: "Jul 10, 2023",
      importance: "High",
      assignedTo: {
        name: "Jane Smith",
        image: "https://github.com/shadcn.png",
      },
    },
    {
      category: "Compliance",
      title: "Work Safety Guidelines",
      description:
        "Updated safety guidelines for remote workers in line with new regulations",
      date: "Jul 10, 2023",
      importance: "High",
      assignedTo: {
        name: "Jane Smith",
        image: "https://github.com/shadcn.png",
      },
    },
    {
      category: "Compliance",
      title: "Work Safety Guidelines",
      description:
        "Updated safety guidelines for remote workers in line with new regulations",
      date: "Jul 10, 2023",
      importance: "High",
      assignedTo: {
        name: "Jane Smith",
        image: "https://github.com/shadcn.png",
      },
    },
  ];

  const rejectedItems: KanbanCardProps[] = [
    {
      category: "Training",
      title: "Training Budget Request",
      description: "Department budget request for external training program",
      date: "Jul 5, 2023",
      importance: "Low",
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
    },
    {
      title: "To Review",
      items: toReviewItems,
      icon: <Clipboard className="size-4" />,
    },
    {
      title: "Resolved",
      items: resolvedItems,
      icon: <Calendar className="size-4" />,
    },
    {
      title: "Rejected",
      items: rejectedItems,
      icon: <AlertCircle className="size-4" />,
    },
  ];

  return (
    <div className="flex h-full w-full gap-4 p-1">
      {columns.map((column) => (
        <KanbanColumn
          key={column.title}
          title={column.title}
          items={column.items}
          icon={column.icon}
        />
      ))}
    </div>
  );
};
