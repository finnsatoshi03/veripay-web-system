type SummaryItem = {
  label: string;
  value: string;
};

type AttendanceSummaryProps = {
  items: SummaryItem[];
};

export const AttendanceSummary = ({ items }: AttendanceSummaryProps) => {
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
