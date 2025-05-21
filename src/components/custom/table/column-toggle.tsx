import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ColumnDef = {
  id: string;
  label: string;
};

interface ColumnToggleProps {
  columns: ColumnDef[];
  visibleColumns: string[];
  onColumnToggle: (columnId: string) => void;
  primaryColumnId?: string;
}

export function ColumnToggle({
  columns,
  visibleColumns,
  onColumnToggle,
  primaryColumnId = "name",
}: ColumnToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="size-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => {
          // Always show the primary column
          const isDisabled = column.id === primaryColumnId;

          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={visibleColumns.includes(column.id)}
              onCheckedChange={() => onColumnToggle(column.id)}
              disabled={isDisabled}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
