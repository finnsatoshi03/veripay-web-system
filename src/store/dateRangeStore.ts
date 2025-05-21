import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

import type { DateRange } from "react-day-picker";
import {
  addDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  subWeeks,
  subMonths,
} from "date-fns";

export type PresetItem = {
  name: string;
  getValue: () => { from: Date; to: Date };
};

export type PresetGroup = {
  category: string;
  items: PresetItem[];
};

// Define all available presets
export const datePresets: PresetGroup[] = [
  {
    category: "Range",
    items: [
      {
        name: "All Time",
        getValue: () => ({
          from: new Date(2020, 0, 1),
          to: endOfDay(new Date()),
        }),
      },
    ],
  },
  {
    category: "Year",
    items: [
      {
        name: "This Year",
        getValue: () => ({
          from: startOfYear(new Date()),
          to: endOfDay(new Date()),
        }),
      },
    ],
  },
  {
    category: "Month",
    items: [
      {
        name: "This Month",
        getValue: () => ({
          from: startOfMonth(new Date()),
          to: endOfDay(new Date()),
        }),
      },
      {
        name: "Past Month",
        getValue: () => ({
          from: startOfDay(subMonths(new Date(), 1)),
          to: endOfMonth(subMonths(new Date(), 1)),
        }),
      },
    ],
  },
  {
    category: "Week",
    items: [
      {
        name: "This Week",
        getValue: () => ({
          from: startOfWeek(new Date(), { weekStartsOn: 1 }),
          to: endOfDay(new Date()),
        }),
      },
      {
        name: "Past Week",
        getValue: () => ({
          from: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
          to: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
        }),
      },
    ],
  },
  {
    category: "Day",
    items: [
      {
        name: "Today",
        getValue: () => ({
          from: startOfDay(new Date()),
          to: endOfDay(new Date()),
        }),
      },
      {
        name: "Yesterday",
        getValue: () => {
          const yesterday = addDays(new Date(), -1);
          return {
            from: startOfDay(yesterday),
            to: endOfDay(yesterday),
          };
        },
      },
    ],
  },
];

// helpers
export const findPresetByValues = (
  date: DateRange | undefined,
): PresetItem | undefined => {
  if (!date?.from || !date?.to) return undefined;

  // Ensure from and to are Date objects
  if (!(date.from instanceof Date) || !(date.to instanceof Date))
    return undefined;

  for (const group of datePresets) {
    for (const preset of group.items) {
      try {
        const presetRange = preset.getValue();

        // Compare dates (year, month, day only)
        const fromMatch =
          presetRange.from.getFullYear() === date.from.getFullYear() &&
          presetRange.from.getMonth() === date.from.getMonth() &&
          presetRange.from.getDate() === date.from.getDate();

        const toMatch =
          presetRange.to.getFullYear() === date.to.getFullYear() &&
          presetRange.to.getMonth() === date.to.getMonth() &&
          presetRange.to.getDate() === date.to.getDate();

        if (fromMatch && toMatch) {
          return preset;
        }
      } catch (error) {
        toast.error(`Error comparing preset dates: ${error}`);
        continue;
      }
    }
  }

  return undefined;
};

const ensureDateObject = (date: unknown): Date | undefined => {
  if (!date) return undefined;

  try {
    if (date instanceof Date) return date;
    if (typeof date === "string") return new Date(date);
    return undefined;
  } catch {
    return undefined;
  }
};

const createSafeDateRange = (
  from?: unknown,
  to?: unknown,
): DateRange | undefined => {
  const fromDate = ensureDateObject(from);
  const toDate = ensureDateObject(to);

  if (!fromDate) return undefined;

  return {
    from: fromDate,
    to: toDate,
  };
};

// Define the store type
interface DateRangeStore {
  // State
  dateRange: DateRange | undefined;
  selectedPreset: PresetItem | undefined;
  calendarMonth: Date | undefined;

  // Actions
  setDateRange: (range: DateRange | undefined) => void;
  setSelectedPreset: (preset: PresetItem | undefined) => void;
  setCalendarMonth: (month: Date | undefined) => void;

  // Combined actions
  selectPreset: (preset: PresetItem) => void;
  clearSelection: () => void;
}

// Create the store
export const useDateRangeStore = create<DateRangeStore>()(
  persist(
    (set) => ({
      // Initial state
      dateRange: undefined,
      selectedPreset: undefined,
      calendarMonth: new Date(),

      // Actions
      setDateRange: (range) => {
        if (!range) {
          set({ dateRange: undefined });
          return;
        }

        const safeRange = createSafeDateRange(range.from, range.to);
        set({ dateRange: safeRange });
      },
      setSelectedPreset: (preset) => set({ selectedPreset: preset }),
      setCalendarMonth: (month) => {
        const safeMonth = ensureDateObject(month) || new Date();
        set({ calendarMonth: safeMonth });
      },

      // Combined actions
      selectPreset: (preset) => {
        try {
          const range = preset.getValue();
          set({
            dateRange: { from: range.from, to: range.to },
            selectedPreset: preset,
            calendarMonth: range.from,
          });
        } catch (error) {
          toast.error(`Error selecting preset: ${error}`);
        }
      },
      clearSelection: () =>
        set({
          dateRange: undefined,
          selectedPreset: undefined,
        }),
    }),
    {
      name: "date-range-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        dateRange: state.dateRange,
        selectedPreset: state.selectedPreset
          ? {
              name: state.selectedPreset.name,
            }
          : undefined,
        calendarMonth: state.calendarMonth,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.selectedPreset?.name) {
          for (const group of datePresets) {
            for (const preset of group.items) {
              if (preset.name === state.selectedPreset.name) {
                state.selectPreset(preset);
                return;
              }
            }
          }
        }
      },
    },
  ),
);
