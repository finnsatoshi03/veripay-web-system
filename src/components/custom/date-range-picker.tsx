import { CalendarIcon } from "lucide-react";
import {
  addDays,
  format,
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
import type { DateRange } from "react-day-picker";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

// Define preset type
type PresetItem = {
  name: string;
  getValue: () => { from: Date; to: Date };
};

type PresetGroup = {
  category: string;
  items: PresetItem[];
};

const presets: PresetGroup[] = [
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

type DateRangePickerProps = {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
};

export const DateRangePicker = ({
  date,
  onDateChange,
}: DateRangePickerProps) => {
  const { pathname } = useLocation();
  const [calendarMonth, setCalendarMonth] = useState<Date | undefined>(
    date?.from,
  );
  const [selectedPreset, setSelectedPreset] = useState<
    PresetItem | undefined
  >();
  const calendarRef = useRef<HTMLDivElement>(null);

  const allowedRoutes = [
    "/employee/attendance",
    "/employee/payslips",
    "/hr/active-employee",
    "/hr/reports",
  ];

  const shouldDisplay = allowedRoutes.some((route) => pathname.includes(route));

  useEffect(() => {
    if (date?.from) {
      setCalendarMonth(date.from);
    }
  }, [date]);

  useEffect(() => {
    if (date?.from && date?.to) {
      // Find the matching preset
      for (const group of presets) {
        for (const preset of group.items) {
          if (isPresetActive(preset)) {
            setSelectedPreset(preset);
            return;
          }
        }
      }
      // If no preset matches, clear the selected preset
      setSelectedPreset(undefined);
    } else {
      setSelectedPreset(undefined);
    }
  }, [date]);

  // helper
  const isPresetActive = (preset: {
    name: string;
    getValue: () => { from: Date; to: Date };
  }) => {
    if (!date?.from || !date?.to) return false;

    const presetRange = preset.getValue();

    const fromMatch =
      presetRange.from.getFullYear() === date.from.getFullYear() &&
      presetRange.from.getMonth() === date.from.getMonth() &&
      presetRange.from.getDate() === date.from.getDate();

    const toMatch =
      presetRange.to.getFullYear() === date.to.getFullYear() &&
      presetRange.to.getMonth() === date.to.getMonth() &&
      presetRange.to.getDate() === date.to.getDate();

    return fromMatch && toMatch;
  };

  // handlers
  const handlePresetSelect = (preset: {
    name: string;
    getValue: () => { from: Date; to: Date };
  }) => {
    const presetRange = preset.getValue();
    onDateChange({ from: presetRange.from, to: presetRange.to });
    setCalendarMonth(presetRange.from);
    setSelectedPreset(preset);

    if (calendarRef.current) {
      calendarRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  const handleClear = () => {
    onDateChange(undefined);
    setSelectedPreset(undefined);
  };

  if (!shouldDisplay) return null;

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-fit justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                  {" |"}
                  <span className="text-muted-foreground text-xs">
                    {selectedPreset?.name}
                  </span>
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col sm:flex-row">
            <div className="p-3" ref={calendarRef}>
              <Calendar
                mode="range"
                defaultMonth={calendarMonth}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                selected={date}
                onSelect={onDateChange}
                numberOfMonths={2}
              />
            </div>
            <div className="border-l p-3">
              <div className="grid grid-cols-2 gap-2">
                {presets.map((group) => (
                  <div key={group.category} className="space-y-2">
                    <h4 className="text-muted-foreground text-sm font-medium">
                      {group.category}
                    </h4>
                    <div className="flex flex-col gap-1">
                      {group.items.map((preset) => {
                        const isActive = isPresetActive(preset);
                        return (
                          <Button
                            key={preset.name}
                            variant={isActive ? "secondary" : "outline"}
                            size="sm"
                            className="justify-start font-normal"
                            onClick={() => handlePresetSelect(preset)}
                          >
                            {preset.name}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex justify-end gap-2 p-3">
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (date) {
                  // Apply the selected date range (this is handled by the onSelect in Calendar)
                }
              }}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
