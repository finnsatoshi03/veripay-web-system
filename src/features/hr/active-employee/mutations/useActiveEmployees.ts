import { useQuery } from "@tanstack/react-query";
import {
  getActiveEmployees,
  type ActiveEmployeesResponse,
} from "@/services/employee-service";
import { queryKeys } from "@/lib/configs/query-keys";
import { useSingleDateStore } from "@/store/singleDateStore";

const formatDateForAPI = (date: Date): string => {
  // Use local date to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useActiveEmployees = () => {
  const { selectedDate } = useSingleDateStore();

  // Use selected date from store, fallback to today if none selected
  const queryDate = selectedDate || new Date();
  const formattedDate = formatDateForAPI(queryDate);

  return useQuery<ActiveEmployeesResponse | null, Error>({
    queryKey: [queryKeys.HR.activeEmployees, formattedDate],
    queryFn: () => getActiveEmployees(formattedDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
