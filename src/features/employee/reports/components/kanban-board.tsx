import { AlertCircle, Calendar, Clock, Clipboard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

import { formatInitials } from "@/lib/helpers/formatters";
import { cn } from "@/lib/utils";

// Types
interface KanbanCardProps {
  category: string;
  title: string;
  description: string;
  date: string;
  importance: "Low" | "Medium" | "High";
  assignedTo?: {
    name: string;
    image?: string;
  };
  icon?: React.ReactNode;
}

interface KanbanColumnProps {
  title: string;
  items: KanbanCardProps[];
  icon: React.ReactNode;
}

// Components
const KanbanCard = ({
  category,
  title,
  description,
  date,
  importance,
  assignedTo,
  icon,
}: KanbanCardProps) => {
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "High":
        return "text-red-500";
      case "Medium":
        return "text-yellow-500";
      case "Low":
        return "text-green-500";
      default:
        return "";
    }
  };

  return (
    <div className="bg-card mb-2 space-y-2 rounded-md p-3 shadow-sm">
      <div className="flex items-center gap-1">
        <Badge variant="outline" className="flex items-center gap-1">
          {icon}
          {category}
        </Badge>
      </div>

      <h3 className="font-medium">{title}</h3>
      <p className="text-muted-foreground line-clamp-2 text-sm">
        {description}
      </p>

      {assignedTo && (
        <div className="flex items-center gap-2">
          <Avatar className="size-6 rounded-md">
            <AvatarImage src={assignedTo.image} alt={assignedTo.name} />
            <AvatarFallback className="rounded-md">
              {formatInitials(assignedTo.name)}
            </AvatarFallback>
          </Avatar>
          <p className="text-muted-foreground text-xs">Assigned to</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Calendar className="size-3" /> {date}
        </div>
        <span
          className={cn("text-xs font-medium", getImportanceColor(importance))}
        >
          {importance}
        </span>
      </div>
    </div>
  );
};

const KanbanColumn = ({ title, items, icon }: KanbanColumnProps) => {
  return (
    <div className="bg-border/50 flex w-full flex-col rounded-md border">
      <div className="bg-border flex items-center gap-2 rounded-t-md border-b p-2 font-medium">
        {icon}
        {title}
        <span className="text-muted-foreground ml-1 text-xs">
          ({items.length})
        </span>
      </div>

      <div className="bg-background/80 p-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <KanbanCard key={index} {...item} icon={icon} />
          ))
        ) : (
          <div className="text-muted-foreground flex min-h-20 flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
            <p className="text-sm">No items</p>
            <p className="text-xs">Reports will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const KanbanBoard = () => {
  // Sample data
  const inProgressItems: KanbanCardProps[] = [];
  const toReviewItems: KanbanCardProps[] = [];
  const resolvedItems: KanbanCardProps[] = [];
  const rejectedItems: KanbanCardProps[] = [];

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
    <ScrollArea className="min-h-0 flex-1 overflow-auto">
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
    </ScrollArea>
  );
};
