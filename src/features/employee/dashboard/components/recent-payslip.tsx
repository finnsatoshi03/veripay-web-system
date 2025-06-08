import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { formatPlaceValue } from "@/lib/helpers/formatters";
import { usePayslips } from "@/features/employee/payslips/mutations/payslips-service";
import { useUser } from "@/store/userStore";

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

// Header component
const SummaryHeader = ({ payslipId }: { payslipId?: number }) => (
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold">Recent Payslip</h2>
    <div className="flex gap-2">
      {payslipId && (
        <Link to={`/employee/payslips?open=${payslipId}`}>
          <Button variant="outline" size="sm">
            View Breakdown
          </Button>
        </Link>
      )}
      <Link to="/employee/payslips">
        <Button variant="outline" size="sm">
          View All Payslips
        </Button>
      </Link>
    </div>
  </div>
);

// Latest payslip overview
const PayslipOverview = ({
  data,
}: {
  data: {
    grossPay: number;
    netPay: number;
    deductions: number;
    status: string;
    period: string;
  };
}) => (
  <div className="space-y-3">
    {/* Gross pay and status */}
    <div className="flex justify-between">
      <div className="space-y-1">
        <div className="flex items-end gap-1">
          <h3 className="text-3xl leading-none font-semibold">
            {formatPlaceValue(data.grossPay)}
          </h3>
          <Badge
            className={`h-fit py-0 ${
              data.status.toLowerCase() === "paid"
                ? "bg-green-200 text-green-700"
                : data.status.toLowerCase() === "pending"
                  ? "bg-yellow-200 text-yellow-700"
                  : "bg-gray-200 text-gray-700"
            }`}
          >
            {data.status}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">Gross Pay</p>
      </div>
    </div>

    {/* Period info */}
    <div className="bg-muted/30 rounded-lg p-3">
      <div className="text-sm">
        <span className="text-muted-foreground">Period: </span>
        <span className="font-medium">{data.period}</span>
      </div>
    </div>
  </div>
);

// Pay distribution breakdown
const PayDistribution = ({
  data,
}: {
  data: {
    grossPay: number;
    netPay: number;
    deductions: number;
  };
}) => {
  // Calculate percentages safely
  const netPayPercentage =
    data.grossPay > 0 ? (data.netPay / data.grossPay) * 100 : 0;
  const deductionsPercentage =
    data.grossPay > 0 ? (data.deductions / data.grossPay) * 100 : 0;

  const hasNoData = data.grossPay === 0;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Pay Distribution</h3>

      {/* Visual progress bar */}
      {hasNoData ? (
        <div className="bg-muted flex h-4 w-full overflow-hidden rounded">
          <div className="flex w-full items-center justify-center">
            <span className="text-muted-foreground text-xs">
              No payslip data
            </span>
          </div>
        </div>
      ) : (
        <div className="flex h-4 w-full overflow-hidden rounded">
          <div
            className="bg-primary"
            style={{ width: `${netPayPercentage}%` }}
          />
          <div
            className="bg-secondary"
            style={{ width: `${deductionsPercentage}%` }}
          />
        </div>
      )}

      {/* Pay breakdown items */}
      <div className="space-y-1">
        <PayBreakdownItem
          label="Net Pay"
          amount={data.netPay}
          isPrimary={true}
        />
        <PayBreakdownItem label="Deductions" amount={data.deductions} />
      </div>
    </div>
  );
};

// Loading skeleton
const RecentPayslipSkeleton = () => (
  <div className="w-full space-y-2 rounded-lg border p-2">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-28" />
    </div>
    <div className="bg-border -mx-2 h-px px-2" />
    <div className="space-y-3">
      <div className="flex justify-between">
        <div className="space-y-1">
          <div className="flex items-end gap-1">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-5 w-12" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
    <div className="bg-border -mx-2 h-px px-2" />
    <div className="space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-full rounded" />
      <div className="space-y-1">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// main component
export const RecentPayslip = () => {
  const { employeeId } = useUser();

  // Get recent payslips
  const {
    data: payslipsResponse,
    isLoading,
    error,
  } = usePayslips({
    employeeId: employeeId || undefined,
    page: 1,
    limit: 5, // Get latest 5 payslips
  });

  const latestPayslipData = useMemo(() => {
    if (!payslipsResponse?.data || payslipsResponse.data.length === 0)
      return null;

    // Get the most recent payslip (first one should be latest)
    const latest = payslipsResponse.data[0];

    // Calculate deductions from gross pay and net pay
    const deductions = latest.gross_pay - latest.net_pay;

    return {
      id: latest.id,
      grossPay: latest.gross_pay,
      netPay: latest.net_pay,
      deductions: deductions,
      status: latest.status,
      period: `${latest.payrolls?.[0]?.period_start || ""} - ${latest.payrolls?.[0]?.period_end || ""}`,
      allowances: latest.allowances || 0,
    };
  }, [payslipsResponse]);

  if (isLoading) {
    return <RecentPayslipSkeleton />;
  }

  if (error || !latestPayslipData) {
    return (
      <div className="w-full space-y-2 rounded-lg border p-2">
        <SummaryHeader payslipId={latestPayslipData?.id} />
        <div className="bg-border -mx-2 h-px px-2" />
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="text-muted-foreground mx-auto h-12 w-12" />
            <p className="text-muted-foreground mt-2 text-sm">
              {error ? "Failed to load payslip data" : "No payslip available"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2 rounded-lg border p-2">
      <SummaryHeader payslipId={latestPayslipData?.id} />
      <div className="bg-border -mx-2 h-px px-2" />
      <PayslipOverview data={latestPayslipData} />
      <div className="bg-border -mx-2 h-px px-2" />
      <PayDistribution data={latestPayslipData} />
    </div>
  );
};
