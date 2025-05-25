type SummaryItem = {
  label: string;
  value: string;
};

type ActiveSummaryProps = {
  items: SummaryItem[];
};

export const ActiveSummary = ({ items }: ActiveSummaryProps) => {
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
