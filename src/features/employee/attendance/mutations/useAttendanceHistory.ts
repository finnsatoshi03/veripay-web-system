import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { getAttendanceHistory } from "@/services/employee/profile-service";
import { useUser } from "@/store/userStore";
import { useDateRangeStore } from "@/store/dateRangeStore";

import type { Attendance_record } from "@/lib/types";
import { queryKeys } from "@/lib/configs/query-keys";

// Types based on the API response from getAttendanceHistory
export interface AttendanceHistoryResponse {
  totalAttendance: number;
  totalHours: string;
  averageCheckIn: string | null;
  averageCheckOut: string | null;
  percentages: {
    present: number;
    late: number;
    onLeave: number;
  };
  attendanceRecords: Array<{
    date: string;
    time_in: string | null;
    time_out: string | null;
    status: "present" | "late" | "on leave" | null;
    source: string;
  }>;
}

// Transform API response to match our Attendance_record type
const transformAttendanceData = (
  data: AttendanceHistoryResponse,
  employeeId: number,
): Attendance_record[] => {
  return data.attendanceRecords.map((record, index) => ({
    attendance_record_id: index + 1, // Generate ID since API doesn't provide it
    employee_id: employeeId,
    date: record.date,
    time_in: record.time_in || undefined,
    time_out: record.time_out || undefined,
    // Map "late" and "present" to "present", "on leave" to "on-leave"
    status:
      record.status === "on leave"
        ? "on-leave"
        : record.status === "late" || record.status === "present"
          ? "present"
          : undefined,
    source: record.source,
  }));
};

// Calculate actual attendance excluding absent records
const calculateActualAttendance = (
  records: AttendanceHistoryResponse["attendanceRecords"],
) => {
  return records.filter((record) => {
    return record.status === "on leave" || record.time_in || record.time_out;
  }).length;
};

// Summary data interface for the attendance stats
export interface AttendanceSummaryData {
  totalAttendance: string;
  totalHours: string;
  averageCheckIn: string;
  averageCheckOut: string;
  percentages: {
    present: number;
    late: number;
    onLeave: number;
  };
}

export const useAttendanceHistory = () => {
  const { employee } = useUser();
  const { dateRange } = useDateRangeStore();

  const employeeId = employee?.id;
  const startDate = dateRange?.from
    ? format(dateRange.from, "yyyy-MM-dd")
    : null;
  const endDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : null;

  return useQuery({
    queryKey: [queryKeys.ATTENDANCE_HISTORY, employeeId, startDate, endDate],
    queryFn: async () => {
      if (!employeeId || !startDate || !endDate) {
        throw new Error("Missing required parameters for attendance history");
      }

      const data = await getAttendanceHistory(employeeId, startDate, endDate);

      if (!data) {
        // Return empty data structure when no records found
        return {
          attendanceRecords: [],
          summaryData: {
            totalAttendance: "0 days",
            totalHours: "0 hours",
            averageCheckIn: "N/A",
            averageCheckOut: "N/A",
            percentages: {
              present: 0,
              late: 0,
              onLeave: 0,
            },
          },
        };
      }

      const attendanceRecords = transformAttendanceData(data, employeeId);

      // Calculate actual attendance excluding absent records
      const actualAttendance = calculateActualAttendance(
        data.attendanceRecords,
      );

      const summaryData: AttendanceSummaryData = {
        totalAttendance: `${actualAttendance} days`,
        totalHours: `${data.totalHours} hours`,
        averageCheckIn: data.averageCheckIn || "N/A",
        averageCheckOut: data.averageCheckOut || "N/A",
        percentages: data.percentages,
      };

      return {
        attendanceRecords,
        summaryData,
      };
    },
    enabled: !!(employeeId && startDate && endDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
