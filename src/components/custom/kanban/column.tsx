import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ScrollArea } from "@/components/ui/scroll-area";

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
}: KanbanColumnProps<T>) => {
  const columnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = columnRef.current;
    if (!element || !onItemDrop) return;

    return dropTargetForElements({
      element,
      getData: () => ({ columnId }),
      onDrop: ({ source }) => {
        const sourceData = source.data;
        const itemId = sourceData.itemId as string;
        const fromColumn = sourceData.columnId as string;

        if (fromColumn !== columnId && itemId) {
          onItemDrop(itemId, fromColumn, columnId);
        }
      },
    });
  }, [columnId, onItemDrop]);

  return (
    <div ref={columnRef} className="flex w-full flex-col rounded-lg border-2">
      <div className="bg-border flex items-center gap-2 rounded-t-md border-b p-2 font-medium">
        {icon}
        {title}
        <span className="text-muted-foreground ml-1 text-xs">
          ({items.length})
        </span>
      </div>

      <ScrollArea className="bg-border/50 h-full min-h-0 overflow-auto">
        <div className="h-full space-y-2 p-2">
          {items.length > 0 ? (
            items.map((item) => renderItem(item, () => onItemClick(item)))
          ) : (
            <div className="text-muted-foreground flex min-h-20 flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
              <p className="text-sm">{emptyStateText}</p>
              {emptyStateSubText && (
                <p className="text-xs">{emptyStateSubText}</p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
