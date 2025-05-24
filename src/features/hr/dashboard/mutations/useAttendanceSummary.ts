import { useQuery } from "@tanstack/react-query";
import {
  getAttendanceSummary,
  type AttendanceSummaryData,
} from "@/services/hr/dashboard-service";
import { queryKeys } from "@/lib/configs/query-keys";

/**
 * Custom hook to fetch attendance summary data including today's attendance,
 * employee details by status, and monthly comparisons
 *
 * This hook provides comprehensive attendance analytics for the HR dashboard
 */
export const useAttendanceSummary = () => {
  return useQuery({
    queryKey: [queryKeys.SUMMARY.attendanceSummary],
    queryFn: getAttendanceSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes for real-time updates
  });
};

export type { AttendanceSummaryData };
