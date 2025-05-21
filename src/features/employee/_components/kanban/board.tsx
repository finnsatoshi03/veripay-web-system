import { useState } from "react";
import type { ReactNode } from "react";
import type { KanbanItemProps } from "./column";
import { KanbanColumn } from "./column";

export interface KanbanBoardProps<T extends KanbanItemProps> {
  columns: Array<{
    title: string;
    items: T[];
    icon: ReactNode;
  }>;
  renderItem: (item: T, onClick: () => void) => ReactNode;
  renderDialog: (
    selectedItem: T | null,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
  ) => ReactNode;
  emptyStateText?: string;
  emptyStateSubText?: string;
}

export const KanbanBoard = <T extends KanbanItemProps>({
  columns,
  renderItem,
  renderDialog,
  emptyStateText,
  emptyStateSubText,
}: KanbanBoardProps<T>) => {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemClick = (item: T) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="flex h-full min-h-0 w-full gap-4 p-1">
        {columns.map((column) => (
          <KanbanColumn
            key={column.title}
            title={column.title}
            items={column.items}
            icon={column.icon}
            renderItem={renderItem}
            onItemClick={handleItemClick}
            emptyStateText={emptyStateText}
            emptyStateSubText={emptyStateSubText}
          />
        ))}
      </div>

      {renderDialog(selectedItem, isDialogOpen, setIsDialogOpen)}
    </>
  );
};
