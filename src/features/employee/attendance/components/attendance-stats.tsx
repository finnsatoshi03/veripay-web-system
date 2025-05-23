interface AttendanceStatsProps {
  percentages?: {
    present: number;
    late: number;
    onLeave: number;
  };
}

export const AttendanceStats = ({ percentages }: AttendanceStatsProps) => {
  const stats = percentages || { present: 0, late: 0, onLeave: 0 };

  return (
    <div className="flex items-center gap-2 rounded-md border px-2 py-1">
      <div className="flex items-center gap-1">
        <div className="bg-primary size-2.5 rounded-full"></div>
        <p className="text-sm font-medium">
          On time{" "}
          <span className="text-muted-foreground">{stats.present}%</span>
        </p>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-secondary size-2.5 rounded-full"></div>
        <p className="text-sm font-medium">
          Late <span className="text-muted-foreground">{stats.late}%</span>
        </p>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-input size-2.5 rounded-full"></div>
        <p className="text-sm font-medium">
          On leave{" "}
          <span className="text-muted-foreground">{stats.onLeave}%</span>
        </p>
      </div>
    </div>
  );
};
