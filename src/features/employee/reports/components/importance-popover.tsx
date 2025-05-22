import * as React from "react";
import { AlertCircle, CheckCircle, Circle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ImportanceOption {
  value: "Low" | "Normal" | "High";
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface ImportancePopoverProps {
  selected: string;
  onSelect: (value: "Low" | "Normal" | "High") => void;
}

export const ImportancePopover = ({
  selected,
  onSelect,
}: ImportancePopoverProps) => {
  const [open, setOpen] = React.useState(false);

  const importanceOptions: ImportanceOption[] = [
    {
      value: "Low",
      label: "Low",
      icon: <Circle className="size-4" />,
      color: "bg-green-100 text-green-700 border-green-200",
      description: "Minimal impact, non-urgent",
    },
    {
      value: "Normal",
      label: "Normal",
      icon: <CheckCircle className="size-4" />,
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      description: "Moderate impact, needs attention",
    },
    {
      value: "High",
      label: "High",
      icon: <AlertCircle className="size-4" />,
      color: "bg-red-100 text-red-700 border-red-200",
      description: "Critical impact, urgent action required",
    },
  ];

  const selectedImportance =
    importanceOptions.find((i) => i.value === selected) || importanceOptions[1];

  const handleSelect = (value: "Low" | "Normal" | "High") => {
    onSelect(value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="cursor-pointer">
          <Badge
            variant="outline"
            className={`hover:bg-muted flex items-center gap-1 p-1 px-2 ${selectedImportance.color}`}
          >
            {selectedImportance.icon}
            {selectedImportance.label}
          </Badge>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0" align="start">
        <div className="bg-muted/50 p-2 text-sm font-medium">
          Select importance
        </div>
        <div className="p-0">
          {importanceOptions.map((option) => (
            <div
              key={option.value}
              className={`hover:bg-muted flex cursor-pointer items-center gap-3 p-3 ${selected === option.value ? "bg-primary/5" : ""} `}
              onClick={() => handleSelect(option.value)}
            >
              <Badge
                className={`${option.color} mt-0.5 flex items-center gap-1 self-start`}
              >
                {option.icon}
                {option.label}
              </Badge>
              <div className="text-muted-foreground text-sm">
                {option.description}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
