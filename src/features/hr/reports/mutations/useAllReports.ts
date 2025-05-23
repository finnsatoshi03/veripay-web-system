import { useQuery } from "@tanstack/react-query";
import { getAllReports } from "@/services/employee/reports-service";
import { queryKeys } from "@/lib/configs/query-keys";

export const useAllReports = () => {
  return useQuery({
    queryKey: [queryKeys.REPORTS, "allReports"],
    queryFn: () => getAllReports(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
