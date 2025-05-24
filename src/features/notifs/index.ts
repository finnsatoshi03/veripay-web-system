// Components
export { NotificationCard } from "./components/notification-card";
export { NotificationsPopover } from "./components/notifications-popover";

// Mutations & Hooks
export {
  useUserNotifications,
  useNotificationStats,
  useMarkNotificationAsRead,
  useMarkNotificationsAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useDeleteNotifications,
  useRealtimeNotifications,
} from "./mutations/useNotifications";

// Custom Hooks
export { useNotificationSound } from "./hooks/useNotificationSound";

// Types (re-exported from service)
export type {
  Notification,
  NotificationType,
  NotificationReferenceType,
  NotificationStats,
} from "@/services/notification-service";
