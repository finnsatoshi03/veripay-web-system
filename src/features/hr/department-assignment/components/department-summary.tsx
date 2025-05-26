import { Skeleton } from "@/components/ui/skeleton";

type SummaryItem = {
  label: string;
  value: string;
};

type DepartmentSummaryProps = {
  items: SummaryItem[];
  isLoading?: boolean;
};

export const DepartmentSummary = ({
  items,
  isLoading,
}: DepartmentSummaryProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
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
