import { supabase } from "../supabase";
import { parseISO, isSameMonth } from "date-fns";

export { getUpcomingBirthdays } from "./announcement-service";
export { getAnnouncements } from "./announcement-service";

export const getAttendanceOverview = async (
  employeeId: number,
  month: string,
) => {
  try {
    const { data, error } = await supabase
      .from("attendance_records")
      .select("date, time_in, time_out, status, source")
      .eq("employee_id", employeeId)
      .order("date", { ascending: true });

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return null;

    // Filter records to the specified month
    const filteredRecords = data.filter((r) =>
      isSameMonth(parseISO(r.date), parseISO(`${month}-01`)),
    );

    const validRecords = filteredRecords.filter(
      (r) => r.time_in && r.status === "present",
    );

    const mostLate = validRecords.reduce(
      (latest, record) => {
        return !latest || record.time_in > latest.time_in ? record : latest;
      },
      null as (typeof data)[0] | null,
    );

    const avgTime = (() => {
      const totalMinutes = validRecords.reduce((sum, r) => {
        const [h, m] = r.time_in.split(":").map(Number);
        return sum + h * 60 + m;
      }, 0);

      if (validRecords.length === 0) return null;

      const avgMinutes = Math.floor(totalMinutes / validRecords.length);
      const hours = Math.floor(avgMinutes / 60)
        .toString()
        .padStart(2, "0");
      const minutes = (avgMinutes % 60).toString().padStart(2, "0");

      return `${hours}:${minutes}`;
    })();

    const streak = (() => {
      let count = 0;
      const sorted = filteredRecords
        .slice()
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

      for (const rec of sorted) {
        if (rec.status === "present") {
          count++;
        } else if (rec.status === "absent") {
          break;
        }
      }
      return count;
    })();

    return {
      mostLateCheckIn: mostLate?.time_in ?? null,
      mostLateDate: mostLate?.date ?? null,
      averageCheckIn: avgTime,
      attendanceStreak: streak,
      attendanceRecords: filteredRecords,
    };
  } catch (error) {
    console.error("Overview Error:", error);
    return null;
  }
};
