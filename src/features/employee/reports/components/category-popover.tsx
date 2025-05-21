import * as React from "react";
import {
  CheckIcon,
  ClipboardIcon,
  FileIcon,
  FolderIcon,
  UsersIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CategoryOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface CategoryPopoverProps {
  selected: string;
  onSelect: (value: string) => void;
}

export const CategoryPopover = ({
  selected,
  onSelect,
}: CategoryPopoverProps) => {
  const [open, setOpen] = React.useState(false);

  const categories: CategoryOption[] = [
    {
      value: "HR",
      label: "HR",
      icon: <UsersIcon className="size-4" />,
      description: "Human resources related reports",
    },
    {
      value: "Payroll",
      label: "Payroll",
      icon: <FileIcon className="size-4" />,
      description: "Financial and salary reports",
    },
    {
      value: "Training",
      label: "Training",
      icon: <ClipboardIcon className="size-4" />,
      description: "Employee training and development",
    },
    {
      value: "Compliance",
      label: "Compliance",
      icon: <CheckIcon className="size-4" />,
      description: "Legal and regulatory compliance reports",
    },
    {
      value: "Other",
      label: "Other",
      icon: <FolderIcon className="size-4" />,
      description: "Miscellaneous reports",
    },
  ];

  const selectedCategory =
    categories.find((c) => c.value === selected) || categories[0];

  const handleSelect = (value: string) => {
    onSelect(value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="cursor-pointer">
          {selected ? (
            <Badge
              variant="outline"
              className="hover:bg-muted flex items-center gap-1 p-1 px-2"
            >
              {selectedCategory.icon}
              {selectedCategory.label}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="hover:bg-muted text-muted-foreground flex items-center gap-1 p-1 px-2"
            >
              <FolderIcon className="size-4" />
              Select category
            </Badge>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0" align="start">
        <div className="bg-muted/50 p-2 text-sm font-medium">
          Select category
        </div>
        <div className="p-0">
          {categories.map((category) => (
            <div
              key={category.value}
              className={`hover:bg-muted flex cursor-pointer items-center gap-2 p-2 ${selected === category.value ? "bg-primary/5" : ""} `}
              onClick={() => handleSelect(category.value)}
            >
              <div className="bg-background flex h-8 w-8 items-center justify-center rounded-md border">
                {category.icon}
              </div>
              <div className="text-sm">
                <div className="font-medium">{category.label}</div>
                {category.description && (
                  <div className="text-muted-foreground text-xs">
                    {category.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
