import { useQuery } from "@tanstack/react-query";
import { getUpcomingBirthdays } from "@/services/employee/dashboard-service";
import { format } from "date-fns";

export type UserProfile = {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
};

export type BirthdaysResult = {
  data: UserProfile[];
  total: number;
  page: number;
  pageSize: number;
  error?: unknown;
};

/**
 * Custom hook to fetch upcoming birthdays
 */
export const useUpcomingBirthdays = (page = 0, pageSize = 10) => {
  return useQuery({
    queryKey: ["upcomingBirthdays", page, pageSize],
    queryFn: async (): Promise<BirthdaysResult> => {
      const result = await getUpcomingBirthdays(page, pageSize);

      return {
        data: result.data || [],
        total: result.total || 0,
        page: result.page || page,
        pageSize: result.pageSize || pageSize,
        error: result.error,
      };
    },
  });
};

/**
 * Format a birth date to a displayable format
 */
export const formatBirthDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, "MMMM d");
  } catch {
    return "Unknown date";
  }
};
