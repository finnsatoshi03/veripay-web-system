import { useQuery } from "@tanstack/react-query";
import { getAnnouncements } from "@/services/employee/dashboard-service";
import { queryKeys } from "@/lib/configs/query-keys";

export type Announcement = {
  id: number;
  title: string;
  body: string;
  target_role: string;
  created_by?: {
    user_profiles: {
      first_name: string;
      last_name: string;
    };
  };
  created_at: string;
  scope: string;
  roles: {
    name: string;
  };
};

export type AnnouncementsResult = {
  data: Announcement[];
  total: number;
  page: number;
  pageSize: number;
  error?: unknown;
};

/**
 * Custom hook to fetch announcements for a specific role
 */
export const useAnnouncements = (role: string, page = 0, pageSize = 10) => {
  return useQuery({
    queryKey: [queryKeys.ANNOUNCEMENTS, role, page, pageSize],
    queryFn: async (): Promise<AnnouncementsResult> => {
      const result = await getAnnouncements(role, page, pageSize);

      return {
        data: result.data || [],
        total: result.total || 0,
        page: result.page || page,
        pageSize: result.pageSize || pageSize,
        error: result.error,
      };
    },
    enabled: !!role,
  });
};
