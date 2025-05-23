import { useEffect, useRef } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatInitials } from "@/lib/helpers/formatters";
import { cn } from "@/lib/utils";

import type { ReportCardProps } from "@/features/employee/reports/components/reports-card";

interface DraggableReportCardProps extends ReportCardProps {
  columnId: string;
}

export const DraggableReportCard = ({
  id,
  category,
  title,
  description,
  date,
  importance,
  assignedTo,
  icon,
  onClick,
  columnId,
}: DraggableReportCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = cardRef.current;
    if (!element || !id) return;

    return draggable({
      element,
      getInitialData: () => ({ itemId: id, columnId }),
    });
  }, [id, columnId]);

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "High":
        return "text-red-500";
      case "Medium":
      case "Normal": // Handle both Medium and Normal
        return "text-yellow-500";
      case "Low":
        return "text-green-500";
      default:
        return "";
    }
  };

  const assignedToName = assignedTo
    ? `${assignedTo.first_name} ${assignedTo.last_name}`
    : "";

  return (
    <div
      ref={cardRef}
      className="bg-card hover:bg-muted/90 mb-2 cursor-grab space-y-2 rounded-md p-3 shadow-sm transition-colors active:cursor-grabbing"
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      aria-label={`View details for ${title}`}
    >
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
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">Assigned to</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="size-6 rounded-md">
                <AvatarImage src={assignedTo.image} alt={assignedToName} />
                <AvatarFallback className="rounded-md">
                  {formatInitials(assignedToName)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{assignedToName}</TooltipContent>
          </Tooltip>
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
