interface PayslipsStatsProps {
  percentages?: {
    netPay: number;
    deductions: number;
    paid: number;
  };
}

export const PayslipsStats = ({ percentages }: PayslipsStatsProps) => {
  const stats = percentages || { netPay: 0, deductions: 0, paid: 0 };

  return (
    <div className="flex items-center gap-2 rounded-md border px-2 py-1">
      <div className="flex items-center gap-1">
        <div className="bg-blue-500 size-2.5 rounded-full"></div>
        <p className="text-sm font-medium">
          Net pay{" "}
          <span className="text-muted-foreground">{stats.netPay}%</span>
        </p>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-yellow-500 size-2.5 rounded-full"></div>
        <p className="text-sm font-medium">
          Deductions{" "}
          <span className="text-muted-foreground">{stats.deductions}%</span>
        </p>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-gray-500 size-2.5 rounded-full"></div>
        <p className="text-sm font-medium">
          Paid{" "}
          {/* <span className="text-muted-foreground">{stats.paid}%</span> */}
        </p>
      </div>
    </div>
  );
};