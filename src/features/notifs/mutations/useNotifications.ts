import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { queryKeys } from "@/lib/configs/query-keys";
import { supabase } from "@/services/supabase";
import {
  getUserNotifications,
  getNotificationStats,
  markNotificationAsRead,
  markNotificationsAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteNotifications,
  type NotificationType,
  type Notification,
} from "@/services/notification-service";

// Real-time notifications hook
export const useRealtimeNotifications = (userId: number) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    console.log("Setting up real-time subscription for user:", userId);

    // Subscribe to notifications table changes for this user
    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Real-time notification change:", payload);

          // Handle different types of changes
          switch (payload.eventType) {
            case "INSERT":
              handleNotificationInsert(payload.new as Notification);
              break;
            case "UPDATE":
              handleNotificationUpdate(payload.new as Notification);
              break;
            case "DELETE":
              handleNotificationDelete(payload.old as Notification);
              break;
          }
        },
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    // Handlers for real-time events
    const handleNotificationInsert = (newNotification: Notification) => {
      // Update all relevant queries
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.userNotifications, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.notificationStats, userId],
      });

      // Show toast for new notifications (optional)
      if (!newNotification.is_read) {
        toast(`📧 ${newNotification.title}`, {
          duration: 4000,
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
        });
      }
    };

    const handleNotificationUpdate = (newNotification: Notification) => {
      // Update cache optimistically
      queryClient.setQueryData(
        [queryKeys.NOTIFICATIONS.userNotifications, userId],
        (oldData: Notification[] | undefined) => {
          if (!oldData) return oldData;

          return oldData.map((notification) =>
            notification.id === newNotification.id
              ? newNotification
              : notification,
          );
        },
      );

      // Update stats cache
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.notificationStats, userId],
      });
    };

    const handleNotificationDelete = (deletedNotification: Notification) => {
      // Remove from cache optimistically
      queryClient.setQueryData(
        [queryKeys.NOTIFICATIONS.userNotifications, userId],
        (oldData: Notification[] | undefined) => {
          if (!oldData) return oldData;

          return oldData.filter(
            (notification) => notification.id !== deletedNotification.id,
          );
        },
      );

      // Update stats cache
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.notificationStats, userId],
      });
    };

    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
};

// Query hook for fetching user notifications with real-time
export const useUserNotifications = (
  userId: number,
  type?: NotificationType,
  isRead?: boolean,
  limit = 50,
) => {
  // Set up real-time subscription
  useRealtimeNotifications(userId);

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
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false, // Rely on real-time updates instead
  });
};

// Query hook for fetching notification statistics
export const useNotificationStats = (userId: number) => {
  return useQuery({
    queryKey: [queryKeys.NOTIFICATIONS.notificationStats, userId],
    queryFn: () => getNotificationStats(userId),
    enabled: !!userId,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false, // Rely on real-time updates instead
  });
};

// Optimistic update helper
const optimisticUpdate = (
  queryClient: ReturnType<typeof useQueryClient>,
  userId: number,
  notificationId: number,
  updates: Partial<Notification>,
) => {
  queryClient.setQueryData(
    [queryKeys.NOTIFICATIONS.userNotifications, userId],
    (oldData: Notification[] | undefined) => {
      if (!oldData) return oldData;

      return oldData.map((notification) =>
        notification.id === notificationId
          ? { ...notification, ...updates }
          : notification,
      );
    },
  );
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
    onMutate: async ({ notificationId, userId }) => {
      // Optimistic update
      optimisticUpdate(queryClient, userId, notificationId, { is_read: true });
    },
    onSuccess: (_, { userId }) => {
      // Real-time will handle the update, but refresh stats to be sure
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.notificationStats, userId],
      });
    },
    onError: (error, { userId, notificationId }) => {
      console.error("Mark notification as read error:", error);
      toast.error("Failed to mark notification as read");

      // Revert optimistic update
      optimisticUpdate(queryClient, userId, notificationId, { is_read: false });
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
    onMutate: async ({ notificationIds, userId }) => {
      // Optimistic update for multiple notifications
      queryClient.setQueryData(
        [queryKeys.NOTIFICATIONS.userNotifications, userId],
        (oldData: Notification[] | undefined) => {
          if (!oldData) return oldData;

          return oldData.map((notification) =>
            notificationIds.includes(notification.id)
              ? { ...notification, is_read: true }
              : notification,
          );
        },
      );
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.notificationStats, userId],
      });
      toast.success("Notifications marked as read");
    },
    onError: (error, { userId, notificationIds }) => {
      console.error("Mark notifications as read error:", error);
      toast.error("Failed to mark notifications as read");

      // Revert optimistic update
      queryClient.setQueryData(
        [queryKeys.NOTIFICATIONS.userNotifications, userId],
        (oldData: Notification[] | undefined) => {
          if (!oldData) return oldData;

          return oldData.map((notification) =>
            notificationIds.includes(notification.id)
              ? { ...notification, is_read: false }
              : notification,
          );
        },
      );
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
      // Let real-time handle individual updates, just refresh everything
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
    onMutate: async ({ notificationId, userId }) => {
      // Optimistic delete
      queryClient.setQueryData(
        [queryKeys.NOTIFICATIONS.userNotifications, userId],
        (oldData: Notification[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter(
            (notification) => notification.id !== notificationId,
          );
        },
      );
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.notificationStats, userId],
      });
      toast.success("Notification deleted");
    },
    onError: (error, { userId }) => {
      console.error("Delete notification error:", error);
      toast.error("Failed to delete notification");

      // Refresh data to revert optimistic update
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.userNotifications, userId],
      });
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
    onMutate: async ({ notificationIds, userId }) => {
      // Optimistic delete for multiple notifications
      queryClient.setQueryData(
        [queryKeys.NOTIFICATIONS.userNotifications, userId],
        (oldData: Notification[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter(
            (notification) => !notificationIds.includes(notification.id),
          );
        },
      );
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.notificationStats, userId],
      });
      toast.success("Notifications deleted");
    },
    onError: (error, { userId }) => {
      console.error("Delete notifications error:", error);
      toast.error("Failed to delete notifications");

      // Refresh data to revert optimistic update
      queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATIONS.userNotifications, userId],
      });
    },
  });
};
