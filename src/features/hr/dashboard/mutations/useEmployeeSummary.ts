import { useQuery } from "@tanstack/react-query";
import {
  getEmployeeSummary,
  type EmployeeSummaryData,
} from "@/services/hr/dashboard-service";
import { queryKeys } from "@/lib/configs/query-keys";

/**
 * Custom hook to fetch employee summary data including total counts,
 * gender breakdown, pending requests, and month-over-month comparisons
 *
 * This hook uses the updated dashboard-service.ts which provides
 * more detailed employee analytics with proper month-over-month comparisons
 */
export const useEmployeeSummary = () => {
  return useQuery({
    queryKey: [queryKeys.SUMMARY.employeeSummary],
    queryFn: getEmployeeSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export type { EmployeeSummaryData };
