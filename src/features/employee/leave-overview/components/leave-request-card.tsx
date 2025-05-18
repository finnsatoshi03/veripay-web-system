import { Calendar, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatInitials, formatNotionDate } from "@/lib/helpers/formatters";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type LeaveRequestCardProps = {
  id: string;
  title: string;
  reason: string;
  startDate: string;
  endDate: string;
  days: number;
  status: "pending" | "approved" | "rejected";
  requestedBy: {
    name: string;
    image?: string;
  };
  reviewedBy?: {
    name: string;
    image?: string;
  };
  dateRequested: string;
  rejectionReason?: string;
  onClick?: (card: LeaveRequestCardProps) => void;
};

export const LeaveRequestCard = ({
  title,
  reason,
  days,
  status,
  reviewedBy,
  dateRequested,
  onClick,
  ...props
}: LeaveRequestCardProps) => {
  const handleClick = () => onClick && onClick(props as LeaveRequestCardProps);

  return (
    <div
      className="bg-card cursor-pointer space-y-3 rounded-md border p-4 shadow-sm transition-shadow hover:shadow-md"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <div className="space-y-1">
        <h3 className="truncate font-medium">{title}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">{reason}</p>
      </div>

      <div className="space-y-1">
        {status !== "pending" && reviewedBy && (
          <div className="flex items-center justify-between">
            <span className="text-sm">Reviewed by</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="size-6">
                  <AvatarImage src={reviewedBy.image} alt={reviewedBy.name} />
                  <AvatarFallback>
                    {formatInitials(reviewedBy.name)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>{reviewedBy.name}</TooltipContent>
            </Tooltip>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm">Leave Span</span>
          <Badge variant="outline" className="flex items-center gap-1">
            <Sun className="size-3.5" />
            {days} days
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Date Requested</span>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <Calendar className="size-3.5" />
            {formatNotionDate(dateRequested)}
          </div>
        </div>
      </div>
    </div>
  );
};
