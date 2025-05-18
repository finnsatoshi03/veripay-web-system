import { Calendar, Flag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { formatInitials } from "@/lib/helpers/formatters";
import { cn } from "@/lib/utils";

export interface KanbanCardProps {
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

export const KanbanCard = ({
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

      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground line-clamp-2 text-sm">
        {description}
      </p>

      {assignedTo && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs">Assigned to</p>
          <Avatar className="size-6 rounded-md">
            <AvatarImage src={assignedTo.image} alt={assignedTo.name} />
            <AvatarFallback className="rounded-md">
              {formatInitials(assignedTo.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Calendar className="size-3" /> {date}
        </div>
        <div
          className={cn(
            "flex items-center gap-0.5 text-xs font-medium",
            getImportanceColor(importance),
          )}
        >
          <Flag className="size-2.5 fill-current" />
          {importance}
        </div>
      </div>
    </div>
  );
};
