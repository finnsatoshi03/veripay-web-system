import { format, lastDayOfMonth } from 'date-fns';

/**
 * Returns the current payroll period as a formatted string, e.g. "May 1–15, 2025" or "May 16–31, 2025".
 */
export function getCurrentPayrollPeriod(date: Date = new Date()): string {
  const year = format(date, 'yyyy');
  const monthName = format(date, 'MMMM');
  const day = date.getDate();

  if (day <= 15) {
    return `${monthName} 1–15, ${year}`;
  }

  const endDay = format(lastDayOfMonth(date), 'd');
  return `${monthName} 16–${endDay}, ${year}`;
}

/**
 * Returns the next cut-off date as a formatted string, e.g. "May 15, 2025" or "May 31, 2025".
 */
export function getNextCutOff(date: Date = new Date()): string {
  const year = format(date, 'yyyy');
  const monthName = format(date, 'MMMM');
  const day = date.getDate();

  if (day <= 15) {
    return `${monthName} 15, ${year}`;
  }

  const last = format(lastDayOfMonth(date), 'MMMM d, yyyy');
  return last;
}
