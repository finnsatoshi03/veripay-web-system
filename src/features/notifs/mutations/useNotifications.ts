import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryKeys } from "@/lib/configs/query-keys";
import {
  getUserNotifications,
  getNotificationStats,
  markNotificationAsRead,
  markNotificationsAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteNotifications,
  type NotificationType,
} from "@/services/notification-service";

// Query hook for fetching user notifications
export const useUserNotifications = (
  userId: number,
  type?: NotificationType,
  isRead?: boolean,
  limit = 50,
) => {
  return useQuery({
    queryKey: [
      queryKeys.NOTIFICATIONS.userNotifications,
      userId,
      type,
      isRead,
      limit,
    ],
    queryFn: () => getUserNotifications(userId, type, isRead, limit),
    enabled: !!userId,
  });
};

// Query hook for fetching notification statistics
export const useNotificationStats = (userId: number) => {
  return useQuery({
    queryKey: [queryKeys.NOTIFICATIONS.notificationStats, userId],
    queryFn: () => getNotificationStats(userId),
    enabled: !!userId,
  });
};

// Mutation for marking a single notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      notificationId,
      userId,
    }: {
      notificationId: number;
      userId: number;
    }) => {
      return await markNotificationAsRead(notificationId, userId);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.userNotifications, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.notificationStats, userId],
      });
    },
    onError: (error) => {
      console.error("Mark notification as read error:", error);
      toast.error("Failed to mark notification as read");
    },
  });
};

// Mutation for marking multiple notifications as read
export const useMarkNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      notificationIds,
      userId,
    }: {
      notificationIds: number[];
      userId: number;
    }) => {
      return await markNotificationsAsRead(notificationIds, userId);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.userNotifications, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.notificationStats, userId],
      });
      toast.success("Notifications marked as read");
    },
    onError: (error) => {
      console.error("Mark notifications as read error:", error);
      toast.error("Failed to mark notifications as read");
    },
  });
};

// Mutation for marking all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      type,
    }: {
      userId: number;
      type?: NotificationType;
    }) => {
      return await markAllNotificationsAsRead(userId, type);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.userNotifications, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.notificationStats, userId],
      });
      toast.success("All notifications marked as read");
    },
    onError: (error) => {
      console.error("Mark all notifications as read error:", error);
      toast.error("Failed to mark all notifications as read");
    },
  });
};

// Mutation for deleting a single notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      notificationId,
      userId,
    }: {
      notificationId: number;
      userId: number;
    }) => {
      return await deleteNotification(notificationId, userId);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.userNotifications, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.notificationStats, userId],
      });
      toast.success("Notification deleted");
    },
    onError: (error) => {
      console.error("Delete notification error:", error);
      toast.error("Failed to delete notification");
    },
  });
};

// Mutation for deleting multiple notifications
export const useDeleteNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      notificationIds,
      userId,
    }: {
      notificationIds: number[];
      userId: number;
    }) => {
      return await deleteNotifications(notificationIds, userId);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.userNotifications, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.notificationStats, userId],
      });
      toast.success("Notifications deleted");
    },
    onError: (error) => {
      console.error("Delete notifications error:", error);
      toast.error("Failed to delete notifications");
    },
  });
};
