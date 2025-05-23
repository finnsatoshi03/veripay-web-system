import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface KanbanItemProps {
  id: string;
  [key: string]: unknown;
}

export interface KanbanColumnProps<T extends KanbanItemProps> {
  title: string;
  items: T[];
  icon: ReactNode;
  renderItem: (item: T, onClick: () => void) => ReactNode;
  onItemClick: (item: T) => void;
  onItemDrop?: (itemId: string, fromColumn: string, toColumn: string) => void;
  emptyStateText?: string;
  emptyStateSubText?: string;
  columnId: string;
  isDragActive?: boolean;
  allowDrop?: boolean;
}

export const KanbanColumn = <T extends KanbanItemProps>({
  title,
  items,
  icon,
  renderItem,
  onItemClick,
  onItemDrop,
  emptyStateText = "No items",
  emptyStateSubText,
  columnId,
  isDragActive = false,
  allowDrop = false,
}: KanbanColumnProps<T>) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const element = columnRef.current;
    if (!element || !onItemDrop) return;

    return dropTargetForElements({
      element,
      getData: () => ({ columnId }),
      onDragEnter: () => {
        if (allowDrop) {
          setIsDraggedOver(true);
        }
      },
      onDragLeave: () => {
        setIsDraggedOver(false);
      },
      onDrop: ({ source }) => {
        setIsDraggedOver(false);
        const sourceData = source.data;
        const itemId = sourceData.itemId as string;
        const fromColumn = sourceData.columnId as string;

        if (fromColumn !== columnId && itemId && allowDrop) {
          onItemDrop(itemId, fromColumn, columnId);
        }
      },
    });
  }, [columnId, onItemDrop, allowDrop]);

  const isDroppable = isDragActive && allowDrop;
  const isHighlighted = isDroppable && isDraggedOver;

  return (
    <div
      ref={columnRef}
      className={cn(
        "flex w-full flex-col rounded-lg border-2 transition-all duration-200",
        isDroppable && "border-blue-300 bg-blue-50/30",
        isHighlighted && "border-blue-500 bg-blue-100/50 shadow-lg",
      )}
    >
      <div
        className={cn(
          "bg-border flex items-center gap-2 rounded-t-md border-b p-2 font-medium transition-colors",
          isDroppable && "bg-blue-100",
          isHighlighted && "bg-blue-200",
        )}
      >
        {icon}
        {title}
        <span className="text-muted-foreground ml-1 text-xs">
          ({items.length})
        </span>
        {isDroppable && (
          <span className="ml-auto text-xs font-medium text-blue-600">
            Drop here
          </span>
        )}
      </div>

      <ScrollArea
        className={cn(
          "bg-border/50 h-full min-h-0 overflow-auto transition-colors",
          isDroppable && "bg-blue-50/50",
        )}
      >
        <div className="h-full space-y-2 p-2">
          {items.length > 0 ? (
            items.map((item) => renderItem(item, () => onItemClick(item)))
          ) : (
            <div
              className={cn(
                "text-muted-foreground flex min-h-20 flex-col items-center justify-center rounded-md border border-dashed p-4 text-center transition-colors",
                isDroppable && "border-blue-300 text-blue-600",
                isHighlighted && "border-blue-500 bg-blue-100",
              )}
            >
              <p className="text-sm">
                {isDroppable ? "Drop here to assign" : emptyStateText}
              </p>
              {emptyStateSubText && !isDroppable && (
                <p className="text-xs">{emptyStateSubText}</p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
