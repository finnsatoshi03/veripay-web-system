import { useRef, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";
import { Calendar as CalendarIcon } from "lucide-react";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import {
  useSingleDateStore,
  singleDatePresets,
  type SingleDatePresetItem,
} from "@/store/singleDateStore";

export const SingleDatePicker = () => {
  const { pathname } = useLocation();
  const calendarRef = useRef<HTMLDivElement>(null);

  const {
    selectedDate,
    selectedPreset,
    calendarMonth,
    setSelectedDate,
    setCalendarMonth,
    selectPreset,
    clearSelection,
  } = useSingleDateStore();

  // Filter presets based on route if needed
  const filteredPresets = useMemo(() => {
    if (pathname.includes("/hr/active-employee")) {
      // For HR active employee, show all presets
      return singleDatePresets;
    }
    return singleDatePresets;
  }, [pathname]);

  // Set default date if none selected
  useEffect(() => {
    if (!selectedDate) {
      // Default to "Today" for HR active employee page
      const todayPreset = singleDatePresets[0].items[0];
      if (todayPreset) {
        selectPreset(todayPreset);
      }
    }
  }, [selectedDate, selectPreset]);

  // Only show on specific routes
  const allowedRoutes = ["/hr/active-employee"];
  const shouldDisplay = allowedRoutes.some((route) => pathname.includes(route));

  const isPresetActive = (preset: SingleDatePresetItem) => {
    if (!selectedDate || !(selectedDate instanceof Date)) return false;

    try {
      const presetDate = preset.getValue();

      const dateMatch =
        presetDate.getFullYear() === selectedDate.getFullYear() &&
        presetDate.getMonth() === selectedDate.getMonth() &&
        presetDate.getDate() === selectedDate.getDate();

      return dateMatch;
    } catch {
      toast.error("Error comparing dates");
      return false;
    }
  };

  const handlePresetSelect = (preset: SingleDatePresetItem) => {
    selectPreset(preset);

    if (calendarRef.current) {
      calendarRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  if (!shouldDisplay) return null;

  const formatSafeDate = (date: Date | undefined) => {
    if (!date || !(date instanceof Date)) return "";
    try {
      return format(date, "LLL dd, y");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error formatting date: ${error.message}`);
      } else {
        toast.error(`Error formatting date: ${String(error)}`);
      }
      return "";
    }
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="single-date"
            variant="outline"
            className={cn(
              "w-fit justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="size-4" />
            {selectedDate && selectedDate instanceof Date ? (
              <>
                {formatSafeDate(selectedDate)}
                {selectedPreset && (
                  <>
                    {" |"}
                    <span className="text-muted-foreground text-xs">
                      {selectedPreset.name}
                    </span>
                  </>
                )}
              </>
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex flex-col sm:flex-row">
            <div className="p-3" ref={calendarRef}>
              <Calendar
                mode="single"
                defaultMonth={
                  calendarMonth instanceof Date ? calendarMonth : new Date()
                }
                month={
                  calendarMonth instanceof Date ? calendarMonth : new Date()
                }
                onMonthChange={setCalendarMonth}
                selected={selectedDate}
                onSelect={setSelectedDate}
                numberOfMonths={1}
              />
            </div>
            <div className="border-l p-3">
              <div className="grid grid-cols-2 gap-2">
                {filteredPresets.map((group) => (
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
          <div className="flex justify-between p-3">
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (selectedDate) {
                  // Apply the selected date (handled by the store)
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
