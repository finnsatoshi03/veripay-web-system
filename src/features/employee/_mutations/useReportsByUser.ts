import { useQuery } from "@tanstack/react-query";
import { getReportByUser } from "@/services/employee/reports-service";

export const useReportsByUser = (userId: number) => {
  return useQuery({
    queryKey: ["reports", userId],
    queryFn: () => getReportByUser(userId),
    enabled: !!userId,
  });
};
