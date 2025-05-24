import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { KanbanItemProps } from "./column";
import { KanbanColumn } from "./column";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export interface KanbanBoardProps<T extends KanbanItemProps> {
  columns: Array<{
    id: string;
    title: string;
    items: T[];
    icon: ReactNode;
    allowDrop?: boolean;
  }>;
  renderItem: (item: T, onClick: () => void) => ReactNode;
  renderDialog: (
    selectedItem: T | null,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
  ) => ReactNode;
  onItemDrop?: (itemId: string, fromColumn: string, toColumn: string) => void;
  emptyStateText?: string;
  emptyStateSubText?: string;
}

export const KanbanBoard = <T extends KanbanItemProps>({
  columns,
  renderItem,
  renderDialog,
  onItemDrop,
  emptyStateText,
  emptyStateSubText,
}: KanbanBoardProps<T>) => {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    return monitorForElements({
      onDragStart: () => setIsDragActive(true),
      onDrop: () => setIsDragActive(false),
    });
  }, []);

  const handleItemClick = (item: T) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="flex h-full min-h-0 w-full gap-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            columnId={column.id}
            title={column.title}
            items={column.items}
            icon={column.icon}
            renderItem={renderItem}
            onItemClick={handleItemClick}
            onItemDrop={onItemDrop}
            emptyStateText={emptyStateText}
            emptyStateSubText={emptyStateSubText}
            isDragActive={isDragActive}
            allowDrop={column.allowDrop}
          />
        ))}
      </div>

      {renderDialog(selectedItem, isDialogOpen, setIsDialogOpen)}
    </>
  );
};
