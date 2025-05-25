import { useState } from "react";
import { format, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SingleDatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export const SingleDatePicker = ({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: SingleDatePickerProps) => {
  const [date, setDate] = useState<Date | undefined>(value || new Date());

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    onChange?.(newDate);
  };

  const handlePresetClick = (presetDate: Date) => {
    handleDateChange(presetDate);
  };

  const today = new Date();
  const yesterday = subDays(today, 1);

  const presets = [
    {
      label: "Today",
      date: today,
    },
    {
      label: "Yesterday",
      date: yesterday,
    },
  ];

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <div className="flex flex-col border-r">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">Presets</p>
              </div>
              <div className="flex flex-col gap-1 px-2 pb-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    className="h-8 justify-start px-2 text-sm"
                    onClick={() => handlePresetClick(preset.date)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            <Calendar
              mode="single"
              defaultMonth={date}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={1}
              className="p-3"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
