import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/configs/query-keys";
import { getAnnouncements } from "@/services/employee/announcement-service";

export const useEmployeeAnnouncements = (
  role: string,
  page = 0,
  pageSize = 20,
) => {
  return useQuery({
    queryKey: [queryKeys.ANNOUNCEMENTS, "employee", role, page, pageSize],
    queryFn: async () => {
      return await getAnnouncements(role, page, pageSize);
    },
    enabled: !!role,
  });
};
