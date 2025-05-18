import { ScrollArea } from "@/components/ui/scroll-area";
import { KanbanCard, type KanbanCardProps } from "./kanban-card";

export interface KanbanColumnProps {
  title: string;
  items: KanbanCardProps[];
  icon: React.ReactNode;
}

export const KanbanColumn = ({ title, items, icon }: KanbanColumnProps) => {
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
        <div className="h-full p-2">
          {items.length > 0 ? (
            items.map((item, index) => (
              <KanbanCard key={index} {...item} icon={icon} />
            ))
          ) : (
            <div className="text-muted-foreground flex min-h-20 flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
              <p className="text-sm">No items</p>
              <p className="text-xs">Reports will appear here</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
