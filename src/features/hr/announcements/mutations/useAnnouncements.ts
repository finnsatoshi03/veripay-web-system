import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryKeys } from "@/lib/configs/query-keys";
import {
  getAllAnnouncementsForHr,
  getAnnouncementsByScope,
  createHrAnnouncement,
  updateHrAnnouncement,
  deleteHrAnnouncement,
  getRoles,
  type HrAnnouncement,
} from "@/services/hr/hr-announcement-service";

export type CreateAnnouncementData = {
  title: string;
  body: string;
  target_role?: number;
  scope: "global" | "by role";
  created_by?: number;
};

export type UpdateAnnouncementData = CreateAnnouncementData & {
  id: number;
};

// Query hook for fetching all announcements (HR view)
export const useHrAnnouncements = (
  scope: "global" | "by role" | "all" = "all",
  page = 0,
  pageSize = 20,
) => {
  return useQuery({
    queryKey: [queryKeys.HR.hrAnnouncements, scope, page, pageSize],
    queryFn: async () => {
      if (scope === "all") {
        return await getAllAnnouncementsForHr(page, pageSize);
      } else {
        return await getAnnouncementsByScope(scope, page, pageSize);
      }
    },
  });
};

// Query hook for fetching roles
export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
};

// Mutation for creating announcements
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAnnouncementData) => {
      const announcement: HrAnnouncement = {
        title: data.title,
        body: data.body,
        target_role: data.target_role,
        scope: data.scope,
        created_by: data.created_by,
      };

      return await createHrAnnouncement(announcement);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.HR.hrAnnouncements],
      });
      queryClient.invalidateQueries({ queryKey: [queryKeys.ANNOUNCEMENTS] });
      toast.success("Announcement created successfully");
    },
    onError: (error) => {
      console.error("Create announcement error:", error);
      toast.error("Failed to create announcement");
    },
  });
};

// Mutation for updating announcements
export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateAnnouncementData) => {
      const { id, ...updateData } = data;
      return await updateHrAnnouncement(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.HR.hrAnnouncements],
      });
      queryClient.invalidateQueries({ queryKey: [queryKeys.ANNOUNCEMENTS] });
      toast.success("Announcement updated successfully");
    },
    onError: (error) => {
      console.error("Update announcement error:", error);
      toast.error("Failed to update announcement");
    },
  });
};

// Mutation for deleting announcements
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await deleteHrAnnouncement(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.HR.hrAnnouncements],
      });
      queryClient.invalidateQueries({ queryKey: [queryKeys.ANNOUNCEMENTS] });
      toast.success("Announcement deleted successfully");
    },
    onError: (error) => {
      console.error("Delete announcement error:", error);
      toast.error("Failed to delete announcement");
    },
  });
};
