import { Skeleton } from "@/components/ui/skeleton";

type SummaryItem = {
  label: string;
  value: string;
};

type ActiveSummaryProps = {
  items: SummaryItem[];
  isLoading?: boolean;
};

export const ActiveSummary = ({ items, isLoading }: ActiveSummaryProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3">
      {items.map((item, index) => (
        <div key={index}>
          <p className="text-muted-foreground text-sm font-medium">
            {item.label}
          </p>
          <p className="text-2xl font-semibold">{item.value}</p>
        </div>
      ))}
    </div>
  );
};
