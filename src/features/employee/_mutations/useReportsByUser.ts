import { useQuery } from "@tanstack/react-query";
import { getReportByUser } from "@/services/employee/reports-service";
import { queryKeys } from "@/lib/configs/query-keys";

export const useReportsByUser = (userId: number) => {
  return useQuery({
    queryKey: [queryKeys.REPORTS, userId],
    queryFn: () => getReportByUser(userId),
    enabled: !!userId,
  });
};
