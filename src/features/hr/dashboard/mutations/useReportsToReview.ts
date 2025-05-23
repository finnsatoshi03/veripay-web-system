import { useQuery } from "@tanstack/react-query";
import {
  getReportsToReview,
  type Report,
} from "@/services/hr/dashboard-service";
import { queryKeys } from "@/lib/configs/query-keys";

/**
 * Custom hook to fetch reports that need to be reviewed
 *
 * This hook fetches reports with status "To Review" or "In Progress"
 * from the database and includes employee details for assigned_to and submitted_by
 */
export const useReportsToReview = () => {
  return useQuery({
    queryKey: [queryKeys.HR.reportsToReview],
    queryFn: getReportsToReview,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export type { Report };
