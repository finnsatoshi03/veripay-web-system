import { supabase } from "./supabase";

export type NotificationType =
  | "report_status"
  | "leave_status"
  | "new_report"
  | "new_leave"
  | "report_assigned";

export type NotificationReferenceType = "report" | "leave_request";

export type Notification = {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  reference_id?: number;
  reference_type?: NotificationReferenceType;
  is_read: boolean;
  created_at: string;
};

export type NotificationStats = {
  total: number;
  unread: number;
  byType: {
    report_status: number;
    leave_status: number;
    new_report: number;
    new_leave: number;
    report_assigned: number;
  };
};

// Get notifications for a specific user
export const getUserNotifications = async (
  userId: number,
  type?: NotificationType,
  isRead?: boolean,
  limit = 50,
): Promise<Notification[]> => {
  try {
    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (type) {
      query = query.eq("type", type);
    }

    if (typeof isRead === "boolean") {
      query = query.eq("is_read", isRead);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Get notification statistics
export const getNotificationStats = async (
  userId: number,
): Promise<NotificationStats> => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("type, is_read")
      .eq("user_id", userId);

    if (error) throw error;

    const notifications = data || [];
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.is_read).length;

    const byType = {
      report_status: notifications.filter((n) => n.type === "report_status")
        .length,
      leave_status: notifications.filter((n) => n.type === "leave_status")
        .length,
      new_report: notifications.filter((n) => n.type === "new_report").length,
      new_leave: notifications.filter((n) => n.type === "new_leave").length,
      report_assigned: notifications.filter((n) => n.type === "report_assigned")
        .length,
    };

    return { total, unread, byType };
  } catch (error) {
    console.error("Error fetching notification stats:", error);
    throw error;
  }
};

// Mark a single notification as read
export const markNotificationAsRead = async (
  notificationId: number,
  userId: number,
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", userId);

    if (error) throw error;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Mark multiple notifications as read
export const markNotificationsAsRead = async (
  notificationIds: number[],
  userId: number,
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", notificationIds)
      .eq("user_id", userId);

    if (error) throw error;
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    throw error;
  }
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (
  userId: number,
  type?: NotificationType,
): Promise<void> => {
  try {
    let query = supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (type) {
      query = query.eq("type", type);
    }

    const { error } = await query;
    if (error) throw error;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (
  notificationId: number,
  userId: number,
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)
      .eq("user_id", userId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Delete multiple notifications
export const deleteNotifications = async (
  notificationIds: number[],
  userId: number,
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .in("id", notificationIds)
      .eq("user_id", userId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting notifications:", error);
    throw error;
  }
};
