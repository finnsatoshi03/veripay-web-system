import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  subDays,
  subWeeks,
  subMonths,
} from "date-fns";

export type SingleDatePresetItem = {
  name: string;
  getValue: () => Date;
};

export type SingleDatePresetGroup = {
  category: string;
  items: SingleDatePresetItem[];
};

// Define all available single date presets
export const singleDatePresets: SingleDatePresetGroup[] = [
  {
    category: "Day",
    items: [
      {
        name: "Today",
        getValue: () => startOfDay(new Date()),
      },
      {
        name: "Yesterday",
        getValue: () => startOfDay(subDays(new Date(), 1)),
      },
      {
        name: "2 Days Ago",
        getValue: () => startOfDay(subDays(new Date(), 2)),
      },
      {
        name: "3 Days Ago",
        getValue: () => startOfDay(subDays(new Date(), 3)),
      },
    ],
  },
  {
    category: "Week",
    items: [
      {
        name: "Start of This Week",
        getValue: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
      },
      {
        name: "Start of Last Week",
        getValue: () =>
          startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
      },
    ],
  },
  {
    category: "Month",
    items: [
      {
        name: "Start of This Month",
        getValue: () => startOfMonth(new Date()),
      },
      {
        name: "Start of Last Month",
        getValue: () => startOfMonth(subMonths(new Date(), 1)),
      },
    ],
  },
];

// helpers
export const findSingleDatePresetByValue = (
  date: Date | undefined,
): SingleDatePresetItem | undefined => {
  if (!date || !(date instanceof Date)) return undefined;

  for (const group of singleDatePresets) {
    for (const preset of group.items) {
      try {
        const presetDate = preset.getValue();

        // Compare dates (year, month, day only)
        const dateMatch =
          presetDate.getFullYear() === date.getFullYear() &&
          presetDate.getMonth() === date.getMonth() &&
          presetDate.getDate() === date.getDate();

        if (dateMatch) {
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

// Define the store type
interface SingleDateStore {
  // State
  selectedDate: Date | undefined;
  selectedPreset: SingleDatePresetItem | undefined;
  calendarMonth: Date | undefined;

  // Actions
  setSelectedDate: (date: Date | undefined) => void;
  setSelectedPreset: (preset: SingleDatePresetItem | undefined) => void;
  setCalendarMonth: (month: Date | undefined) => void;

  // Combined actions
  selectPreset: (preset: SingleDatePresetItem) => void;
  clearSelection: () => void;
}

// Create the store
export const useSingleDateStore = create<SingleDateStore>()(
  persist(
    (set) => ({
      // Initial state
      selectedDate: startOfDay(new Date()), // Default to today
      selectedPreset: singleDatePresets[0].items[0], // Default to "Today"
      calendarMonth: new Date(),

      // Actions
      setSelectedDate: (date) => {
        const safeDate = ensureDateObject(date);
        set({ selectedDate: safeDate });
      },
      setSelectedPreset: (preset) => set({ selectedPreset: preset }),
      setCalendarMonth: (month) => {
        const safeMonth = ensureDateObject(month) || new Date();
        set({ calendarMonth: safeMonth });
      },

      // Combined actions
      selectPreset: (preset) => {
        try {
          const date = preset.getValue();
          set({
            selectedDate: date,
            selectedPreset: preset,
            calendarMonth: date,
          });
        } catch (error) {
          toast.error(`Error selecting preset: ${error}`);
        }
      },
      clearSelection: () =>
        set({
          selectedDate: undefined,
          selectedPreset: undefined,
        }),
    }),
    {
      name: "single-date-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedDate: state.selectedDate,
        selectedPreset: state.selectedPreset
          ? {
              name: state.selectedPreset.name,
            }
          : undefined,
        calendarMonth: state.calendarMonth,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.selectedPreset?.name) {
          for (const group of singleDatePresets) {
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
