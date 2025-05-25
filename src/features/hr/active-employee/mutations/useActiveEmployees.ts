import { useQuery } from "@tanstack/react-query";
import {
  getActiveEmployees,
  type ActiveEmployeesResponse,
} from "@/services/employee-service";
import { queryKeys } from "@/lib/configs/query-keys";

const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const useActiveEmployees = () => {
  const today = getTodayDate();

  return useQuery<ActiveEmployeesResponse | null, Error>({
    queryKey: [queryKeys.HR.activeEmployees, today],
    queryFn: () => getActiveEmployees(today),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
