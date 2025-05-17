import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { formatPlaceValue } from "@/lib/helpers/formatters";

// types
interface PayBreakdownItemProps {
  label: string;
  amount: number;
  isPrimary?: boolean;
}

// components
export const PayBreakdownItem = ({
  label,
  amount,
  isPrimary = false,
}: PayBreakdownItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <div
          className={`${isPrimary ? "bg-primary" : "bg-primary/20"} size-3.5 rounded`}
        />
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
      <p className="text-muted-foreground text-sm">
        {formatPlaceValue(amount)}
      </p>
    </div>
  );
};

// main component
export const RecentPayslip = () => {
  // data
  const payData = {
    grossPay: 6900.69,
    netPay: 6000.6,
    benefits: 900.09,
    percentageChange: 0.5,
    netPayPercentage: 70,
    benefitsPercentage: 30,
  };

  return (
    <div className="w-full space-y-2 rounded-lg border p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Payslip</h2>
        <Button variant="outline" size="sm">
          View Breakdown
        </Button>
      </div>
      <div className="bg-border -mx-2 h-px px-2" />

      {/* gross pay section */}
      <div>
        <div className="flex items-end gap-1">
          <p className="text-3xl font-semibold">
            {formatPlaceValue(payData.grossPay)}
          </p>
          <Badge className="mb-0.5 h-fit rounded-full bg-green-200 px-1 py-0.5 leading-none font-medium text-green-800">
            +{payData.percentageChange}%
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">Gross Pay</p>
      </div>

      {/* pay distribution visualization */}
      <div className="flex items-center gap-1">
        <div
          className="bg-primary h-5 rounded"
          style={{ width: `${payData.netPayPercentage}%` }}
        ></div>
        <div
          className="bg-primary/20 h-5 rounded"
          style={{ width: `${payData.benefitsPercentage}%` }}
        ></div>
      </div>

      {/* pay breakdown */}
      <div>
        <PayBreakdownItem
          label="Net Pay"
          amount={payData.netPay}
          isPrimary={true}
        />
        <PayBreakdownItem label="Benefits" amount={payData.benefits} />
      </div>

      <Button variant="secondary" size="sm" className="w-full">
        <Download className="size-4" />
        Download PDF
      </Button>
    </div>
  );
};
