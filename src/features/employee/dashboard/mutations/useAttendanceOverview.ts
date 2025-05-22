import { useQuery } from "@tanstack/react-query";
import { getAttendanceOverview } from "@/services/employee/dashboard-service";
import type { Attendance_record } from "@/lib/types";
import { format } from "date-fns";
import {
  calculateAverageCheckIn,
  findMostLateCheckIn,
  calculateAttendanceStreak,
} from "../lib/helpers/attendance";

// Define the type for the data returned from the API
type ApiAttendanceRecord = {
  date: string;
  time_in?: string;
  time_out?: string;
  status?: string;
  source?: string;
};

// Define the type for our transformed data
export type AttendanceOverviewData = {
  mostLateCheckIn: string | null;
  mostLateDate: string | null;
  averageCheckIn: string | null;
  attendanceStreak: number;
  streakEmoji: string;
  attendanceRecords: Attendance_record[];
};

/**
 * Custom hook to fetch and transform attendance overview data
 */
export const useAttendanceOverview = (employeeId: number | undefined) => {
  const currentMonth = format(new Date(), "yyyy-MM");

  return useQuery({
    queryKey: ["attendanceOverview", employeeId, currentMonth],
    queryFn: async (): Promise<AttendanceOverviewData | null> => {
      if (!employeeId) return null;

      // Fetch data from the API
      const apiData = await getAttendanceOverview(employeeId, currentMonth);

      if (!apiData || !apiData.attendanceRecords) return null;

      // Transform API records to match Attendance_record type
      const records: ApiAttendanceRecord[] = apiData.attendanceRecords;
      const transformedRecords: Attendance_record[] = records.map(
        (record, index) => ({
          attendance_record_id: index,
          employee_id: employeeId,
          date: record.date,
          time_in: record.time_in || undefined,
          time_out: record.time_out || undefined,
          status: (record.status as "present" | "on-leave") || "present",
          source: record.source || "",
        }),
      );

      // Use the helper functions to calculate stats
      const averageCheckIn = calculateAverageCheckIn(transformedRecords);
      const mostLateCheckIn = findMostLateCheckIn(transformedRecords);
      const { count: attendanceStreak, emoji: streakEmoji } =
        calculateAttendanceStreak(transformedRecords);

      return {
        mostLateCheckIn,
        mostLateDate: apiData.mostLateDate,
        averageCheckIn,
        attendanceStreak,
        streakEmoji,
        attendanceRecords: transformedRecords,
      };
    },
    enabled: !!employeeId,
  });
};
