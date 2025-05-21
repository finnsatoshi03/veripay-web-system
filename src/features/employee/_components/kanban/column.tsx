import type { ReactNode } from "react";
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
  emptyStateText?: string;
  emptyStateSubText?: string;
}

export const KanbanColumn = <T extends KanbanItemProps>({
  title,
  items,
  icon,
  renderItem,
  onItemClick,
  emptyStateText = "No items",
  emptyStateSubText,
}: KanbanColumnProps<T>) => {
  return (
    <div className="flex w-full flex-col rounded-lg border-2">
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
