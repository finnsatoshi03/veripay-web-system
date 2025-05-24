import { useState } from "react";
import { Bell, CheckCheck, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { NotificationCard } from "./notification-card";
import {
  useUserNotifications,
  useNotificationStats,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "../mutations/useNotifications";
import type {
  NotificationType,
  Notification,
} from "@/services/notification-service";

interface NotificationsPopoverProps {
  userId: number;
  trigger: React.ReactNode;
}

const tabFilters = [
  { value: "all", label: "All", type: undefined },
  {
    value: "report_status",
    label: "Reports",
    type: "report_status" as NotificationType,
  },
  {
    value: "leave_status",
    label: "Leave",
    type: "leave_status" as NotificationType,
  },
  {
    value: "new_report",
    label: "New Reports",
    type: "new_report" as NotificationType,
  },
  {
    value: "new_leave",
    label: "New Leave",
    type: "new_leave" as NotificationType,
  },
] as const;

export const NotificationsPopover = ({
  userId,
  trigger,
}: NotificationsPopoverProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const currentFilter = tabFilters.find((tab) => tab.value === activeTab);

  // Get all notifications for badge counts (not filtered)
  const { data: allNotifications = [] } = useUserNotifications(
    userId,
    undefined,
    undefined,
    100,
  );

  // Get filtered notifications for display
  const { data: notifications = [], isLoading } = useUserNotifications(
    userId,
    currentFilter?.type,
    showUnreadOnly ? false : undefined,
    50,
  );

  const { data: stats } = useNotificationStats(userId);

  // mutations
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  // handlers
  const handleMarkAsRead = (notificationId: number) => {
    markAsReadMutation.mutate({ notificationId, userId });
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate({
      userId,
      type: currentFilter?.type,
    });
  };

  const handleDelete = (notificationId: number) => {
    deleteNotificationMutation.mutate({ notificationId, userId });
  };

  const handleNotificationClick = (notification: Notification) => {
    // Close popover when notification is clicked
    setIsOpen(false);
    // You can implement navigation logic here based on notification type
    console.log("Notification clicked:", notification);
  };

  const filteredNotifications = showUnreadOnly
    ? notifications.filter((n) => !n.is_read)
    : notifications;

  // Fix: Use allNotifications for accurate badge counts
  const getTabBadgeCount = (tabValue: string) => {
    if (!allNotifications.length) return 0;

    switch (tabValue) {
      case "all":
        return allNotifications.filter((n) => !n.is_read).length;
      case "report_status":
        return allNotifications.filter(
          (n) => n.type === "report_status" && !n.is_read,
        ).length;
      case "leave_status":
        return allNotifications.filter(
          (n) => n.type === "leave_status" && !n.is_read,
        ).length;
      case "new_report":
        return allNotifications.filter(
          (n) => n.type === "new_report" && !n.is_read,
        ).length;
      case "new_leave":
        return allNotifications.filter(
          (n) => n.type === "new_leave" && !n.is_read,
        ).length;
      default:
        return 0;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={15}
        className="w-96 p-0"
        side="bottom"
      >
        <div className="flex max-h-[600px] flex-col">
          {/* Header */}
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="size-5" />
                <h3 className="font-semibold">Notifications</h3>
                {stats && stats.unread > 0 && (
                  <Badge variant="destructive" className="h-5 text-xs">
                    {stats.unread}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {/* Filter Toggle */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-48">
                    <div className="space-y-2">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={showUnreadOnly}
                          onChange={(e) => setShowUnreadOnly(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Show unread only</span>
                      </label>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Mark All Read */}
                {filteredNotifications.some((n) => !n.is_read) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    disabled={markAllAsReadMutation.isPending}
                    title="Mark all as read"
                  >
                    <CheckCheck className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-1 flex-col"
          >
            <div className="border-b px-2">
              <TabsList className="h-auto w-full bg-transparent p-0">
                {tabFilters.map((tab) => {
                  const badgeCount = getTabBadgeCount(tab.value);
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={cn(
                        "flex-1 rounded-none border-t-0 border-r-0 border-b-2 border-l-0 border-transparent bg-transparent px-2 py-2 !shadow-none",
                        "data-[state=active]:border-primary data-[state=active]:bg-transparent",
                        "hover:bg-accent/50",
                      )}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{tab.label}</span>
                        {badgeCount > 0 && (
                          <Badge variant="destructive" className="h-4 text-xs">
                            {badgeCount > 99 ? "99+" : badgeCount}
                          </Badge>
                        )}
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {tabFilters.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="mt-0 h-full"
                >
                  <ScrollArea className="h-full">
                    <div className="space-y-2 p-3">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-muted-foreground text-sm">
                            Loading notifications...
                          </div>
                        </div>
                      ) : filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <Bell className="text-muted-foreground mb-2 size-8" />
                          <div className="text-muted-foreground text-center text-sm">
                            {showUnreadOnly
                              ? "No unread notifications"
                              : "No notifications yet"}
                          </div>
                        </div>
                      ) : (
                        filteredNotifications.map((notification) => (
                          <NotificationCard
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={handleMarkAsRead}
                            onDelete={handleDelete}
                            onClick={handleNotificationClick}
                          />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
};
