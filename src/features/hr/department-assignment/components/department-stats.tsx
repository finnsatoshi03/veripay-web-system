interface DepartmentStatsProps {
  percentages?: {
    with_department: number;
    no_department: number;
  };
}

export const DepartmentStats = ({ percentages }: DepartmentStatsProps) => {
  const stats = percentages || { with_department: 0, no_department: 0 };

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
