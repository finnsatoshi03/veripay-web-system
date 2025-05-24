type SummaryItem = {
  label: string;
  value: string;
};

type PayslipsSummaryProps = {
  items: SummaryItem[];
};

export const PayslipsSummary = ({ items }: PayslipsSummaryProps) => {
  // Split items into top row (Gross Pay, Deductions) and bottom row (Net Pay)
  const topRowItems = items.slice(0, 2);
  const bottomRowItem = items[2];

  return (
    <div className="">
      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
        {topRowItems.map((item, index) => (
          <div key={index} className="text-left">
            <p className="text-muted-foreground text-sm font-medium mb-1">
              {item.label}
            </p>
            <p className="text-2xl font-meduim">{item.value}</p>
          </div>
        ))}
      </div>
      
      {/* Bottom row - Net Pay (centered) */}
      {bottomRowItem && (
        <div className="mt-6 text-center">
          <p className="text-2xl font-medium mb-1">{bottomRowItem.value}</p>
          <p className="text-muted-foreground text-sm font-medium">
            {bottomRowItem.label}
          </p>
        </div>
      )}
    </div>
  );
};