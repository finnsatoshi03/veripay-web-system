import { Skeleton } from "@/components/ui/skeleton";

interface ActiveEmployeeStatsProps {
  percentages?: {
    present: number;
    late: number;
    onLeave: number;
    absent: number;
  };
  isLoading?: boolean;
}

export const ActiveEmployeeStats = ({
  percentages,
  isLoading,
}: ActiveEmployeeStatsProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-md border px-2 py-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-1">
            <Skeleton className="size-2.5 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  const stats = percentages || { present: 0, late: 0, onLeave: 0, absent: 0 };

  return (
    <div className="flex items-center gap-2 rounded-md border px-2 py-1">
      <div className="flex items-center gap-1">
        <div className="size-2.5 rounded-full bg-green-500"></div>
        <p className="text-sm font-medium">
          On time{" "}
          <span className="text-muted-foreground">{stats.present}%</span>
        </p>
      </div>
      <div className="flex items-center gap-1">
        <div className="size-2.5 rounded-full bg-yellow-500"></div>
        <p className="text-sm font-medium">
          Late <span className="text-muted-foreground">{stats.late}%</span>
        </p>
      </div>
      <div className="flex items-center gap-1">
        <div className="size-2.5 rounded-full bg-blue-500"></div>
        <p className="text-sm font-medium">
          On leave{" "}
          <span className="text-muted-foreground">{stats.onLeave}%</span>
        </p>
      </div>
      <div className="flex items-center gap-1">
        <div className="size-2.5 rounded-full bg-red-500"></div>
        <p className="text-sm font-medium">
          Absent <span className="text-muted-foreground">{stats.absent}%</span>
        </p>
      </div>
    </div>
  );
};
