import type { Attendance_record } from "@/lib/types";
import { attendance_config } from "@/lib/configs/hr-config";

/**
 * Format time to display with AM/PM
 */
export const formatTimeWithAmPm = (hours: number, minutes: number): string => {
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

/**
 * Calculate the average check-in time from attendance records
 */
export const calculateAverageCheckIn = (
  records: Attendance_record[],
): string => {
  const validRecords = records.filter((record) => record.time_in);
  if (validRecords.length === 0) return "--:--";

  let totalMinutes = 0;

  validRecords.forEach((record) => {
    const [hours, minutes] = record.time_in!.split(":").map(Number);
    totalMinutes += hours * 60 + minutes;
  });

  const averageMinutes = Math.round(totalMinutes / validRecords.length);
  const hours = Math.floor(averageMinutes / 60);
  const minutes = averageMinutes % 60;

  return formatTimeWithAmPm(hours, minutes);
};

/**
 * Find the most late check-in time
 */
export const findMostLateCheckIn = (records: Attendance_record[]): string => {
  const validRecords = records.filter((record) => record.time_in);
  if (validRecords.length === 0) return "--:--";

  let latestTimeInMinutes = 0;

  validRecords.forEach((record) => {
    const [hours, minutes] = record.time_in!.split(":").map(Number);
    const timeInMinutes = hours * 60 + minutes;

    if (timeInMinutes > latestTimeInMinutes) {
      latestTimeInMinutes = timeInMinutes;
    }
  });

  const hours = Math.floor(latestTimeInMinutes / 60);
  const minutes = latestTimeInMinutes % 60;

  return formatTimeWithAmPm(hours, minutes);
};

/**
 * Calculate attendance streak and return with emoji
 */
export const calculateAttendanceStreak = (
  records: Attendance_record[],
): { count: number; emoji: string } => {
  if (records.length === 0) {
    return { count: 0, emoji: "🙂" };
  }

  // Sort records by date in ascending order
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  let currentStreak = 0;
  let maxStreak = 0;
  let lastPresentDate: Date | null = null;

  for (const record of sortedRecords) {
    const currentDate = new Date(record.date);

    // Skip weekends (0 = Sunday, 6 = Saturday)
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    // Check if present (including late arrivals)
    // Count as present if: has time_in OR status is "present" OR status is "on-leave"
    const isPresent =
      record.time_in ||
      record.status === "present" ||
      record.status === "on-leave";

    if (isPresent) {
      if (lastPresentDate === null) {
        // First present day
        currentStreak = 1;
      } else {
        // Check if this is the next consecutive workday
        const expectedNextDate = new Date(lastPresentDate);
        expectedNextDate.setDate(expectedNextDate.getDate() + 1);

        // Skip weekends when calculating next expected date
        while (
          expectedNextDate.getDay() === 0 ||
          expectedNextDate.getDay() === 6
        ) {
          expectedNextDate.setDate(expectedNextDate.getDate() + 1);
        }

        if (currentDate.toDateString() === expectedNextDate.toDateString()) {
          // Consecutive day - increment streak
          currentStreak++;
        } else {
          // Gap found - check if there are missing workdays between lastPresentDate and currentDate
          const daysDiff = Math.floor(
            (currentDate.getTime() - lastPresentDate.getTime()) /
              (1000 * 60 * 60 * 24),
          );

          // Count only workdays in between
          let workdaysBetween = 0;
          for (let i = 1; i < daysDiff; i++) {
            const checkDate = new Date(lastPresentDate);
            checkDate.setDate(checkDate.getDate() + i);
            const checkDay = checkDate.getDay();
            if (checkDay !== 0 && checkDay !== 6) {
              workdaysBetween++;
            }
          }

          if (workdaysBetween === 0) {
            // No workdays missed (e.g., over weekend) - continue streak
            currentStreak++;
          } else {
            // Workdays were missed - reset streak
            currentStreak = 1;
          }
        }
      }

      lastPresentDate = currentDate;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      // Absent - reset streak
      currentStreak = 0;
      lastPresentDate = null;
    }
  }

  // Determine emoji based on streak threshold
  let emoji = "🙂";
  if (maxStreak >= 20) emoji = "💯";
  else if (maxStreak >= 15) emoji = "⚡";
  else if (maxStreak >= 10) emoji = "🔥";
  else if (maxStreak >= 5) emoji = "✨";
  else if (maxStreak >= 1) emoji = "🙂";

  return { count: maxStreak, emoji };
};

/**
 * Check if an attendance record is late based on config
 */
export const isLateCheckIn = (timeIn: string): boolean => {
  const configTime = attendance_config.time_in;
  const [configHours, configMinutes] = configTime.split(":").map(Number);
  const configTotalMinutes = configHours * 60 + configMinutes;

  const [hours, minutes] = timeIn.split(":").map(Number);
  const timeTotalMinutes = hours * 60 + minutes;

  return timeTotalMinutes > configTotalMinutes;
};
