import { Skeleton } from "@/components/ui/skeleton";

interface DepartmentStatsProps {
  percentages?: {
    with_department: number;
    no_department: number;
  };
  isLoading?: boolean;
}

export const DepartmentStats = ({
  percentages,
  isLoading,
}: DepartmentStatsProps) => {
  const stats = percentages || { with_department: 0, no_department: 0 };

  if (isLoading) {
    return (
      <div className="flex items-center justify-between rounded-md border px-2 py-1">
        <div className="flex items-center gap-1">
          <Skeleton className="size-2.5 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="size-2.5 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-md border px-2 py-1">
      <div className="flex items-center gap-1">
        <div className="bg-primary size-2.5 rounded-full"></div>
        <p className="text-sm font-medium">
          With Department{" "}
          <span className="text-muted-foreground">
            {stats.with_department}%
          </span>
        </p>
      </div>
      <div className="flex items-center gap-1">
        <div className="size-2.5 rounded-full bg-red-600"></div>
        <p className="text-sm font-medium">
          No Department{" "}
          <span className="text-muted-foreground">{stats.no_department}%</span>
        </p>
      </div>
    </div>
  );
};
