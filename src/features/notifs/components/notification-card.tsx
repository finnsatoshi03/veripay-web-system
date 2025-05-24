import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  FileText,
  Calendar,
  Check,
  MoreVertical,
  Trash2,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Notification } from "@/services/notification-service";

const notificationIcons = {
  report_status: FileText,
  leave_status: Calendar,
  new_report: FileText,
  new_leave: Calendar,
  report_assigned: UserCheck,
} as const;

const notificationColors = {
  report_status: "text-blue-600",
  leave_status: "text-green-600",
  new_report: "text-orange-600",
  new_leave: "text-purple-600",
  report_assigned: "text-indigo-600",
} as const;

const notificationLabels = {
  report_status: "Report Update",
  leave_status: "Leave Update",
  new_report: "New Report",
  new_leave: "New Leave Request",
  report_assigned: "Report Assignment",
} as const;

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (notificationId: number) => void;
  onDelete: (notificationId: number) => void;
  onClick?: (notification: Notification) => void;
}

export const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
}: NotificationCardProps) => {
  // handlers
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(notification);
    }
    // Auto mark as read when clicked
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const IconComponent = notificationIcons[notification.type];
  const iconColor = notificationColors[notification.type];
  const typeLabel = notificationLabels[notification.type];

  return (
    <div
      className={cn(
        "bg-card hover:bg-accent/50 group cursor-pointer rounded-lg border p-3 transition-all duration-200",
        !notification.is_read && "border-primary/30 bg-primary/5",
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Notification: ${notification.title}`}
    >
      <div className="space-y-2">
        {/* Notification Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {/* Icon */}
            <div className={cn("bg-muted rounded-md p-1.5", iconColor)}>
              <IconComponent className="size-3" />
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="h-4 text-xs">
                  {typeLabel}
                </Badge>
                {!notification.is_read && (
                  <div className="bg-primary size-1.5 rounded-full" />
                )}
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="hover:bg-accent cursor-pointer rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
                aria-label="Open notification menu"
              >
                <MoreVertical className="size-3" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-fit p-1">
              {!notification.is_read && (
                <button
                  onClick={handleMarkAsRead}
                  className="hover:bg-accent flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm"
                >
                  <Check className="size-4" />
                  Mark as read
                </button>
              )}
              <button
                onClick={handleDelete}
                className="text-destructive hover:bg-accent flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm"
              >
                <Trash2 className="size-4" />
                Delete
              </button>
            </PopoverContent>
          </Popover>
        </div>

        {/* Title */}
        <h4 className="line-clamp-2 text-sm leading-tight font-medium">
          {notification.title}
        </h4>

        {/* Message */}
        <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
          {notification.message}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs">
          <div className="text-muted-foreground flex items-center gap-1">
            <Bell className="size-2.5" />
            <span>
              {formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Reference info */}
          {notification.reference_type && notification.reference_id && (
            <div className="text-muted-foreground flex items-center gap-1">
              <span className="text-xs capitalize">
                {notification.reference_type.replace("_", " ")}
              </span>
              <span>#{notification.reference_id}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
