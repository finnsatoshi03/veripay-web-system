import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { usePayrollSummary } from "@/features/hr/payroll-management/mutations/payroll-service";
import { AlertCircle } from "lucide-react";

// Header component
const SummaryHeader = () => (
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold">Latest Payroll Summary</h2>
    <Link to="/hr/payroll-management">
      <Button variant="outline" size="sm">
        Go to Payroll
      </Button>
    </Link>
  </div>
);

// Main summary component - similar to AttendanceSummary structure
const PayrollOverview = ({
  data,
}: {
  data: {
    totalEmployees: number;
    totalGrossPay: number;
    period_formatted: string;
    date_processed_formatted: string | null;
  };
}) => (
  <div className="space-y-3">
    {/* Top metrics - similar to attendance overview */}
    <div className="flex justify-between">
      <div className="space-y-1">
        <h3 className="text-3xl leading-none font-semibold">
          {data.totalEmployees === 0 ? "0" : data.totalEmployees}
        </h3>
        <p className="text-muted-foreground text-sm">
          {data.totalEmployees === 0 ? "No employees" : "Employees Paid"}
        </p>
      </div>
      <div className="space-y-1 text-right">
        <div className="flex items-center justify-end gap-1">
          <h3 className="text-3xl leading-none font-semibold">
            {data.totalGrossPay === 0
              ? "₱0"
              : `₱${(data.totalGrossPay / 1000).toFixed(0)}K`}
          </h3>
          <Badge
            className={`h-fit py-0 ${
              data.totalGrossPay === 0
                ? "bg-gray-200 text-gray-700"
                : "bg-green-200 text-green-700"
            }`}
          >
            {data.totalGrossPay === 0 ? "No Data" : "Processed"}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          {data.totalGrossPay === 0 ? "No payroll amount" : "Total Gross Pay"}
        </p>
      </div>
    </div>

    {/* Payroll period info */}
    <div className="bg-muted/30 rounded-lg p-3">
      <div className="flex items-center justify-between text-sm">
        <div>
          <span className="text-muted-foreground">Period: </span>
          <span className="font-medium">
            {data.period_formatted || "Not specified"}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Processed: </span>
          <span className="font-medium">
            {data.date_processed_formatted || "Not processed"}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Payroll breakdown - visual progress bar approach
const PayrollBreakdown = ({
  data,
  totalGrossPay,
}: {
  data: {
    totalNetPay: number;
    totalDeductions: number;
  };
  totalGrossPay: number;
}) => {
  // Calculate percentages safely
  const netPayPercentage =
    totalGrossPay > 0 ? (data.totalNetPay / totalGrossPay) * 100 : 0;
  const deductionsPercentage =
    totalGrossPay > 0 ? (data.totalDeductions / totalGrossPay) * 100 : 0;

  // Check if there's no payroll data
  const hasNoData =
    totalGrossPay === 0 ||
    (data.totalNetPay === 0 && data.totalDeductions === 0);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Pay Distribution</h3>

      {/* Visual progress bar - similar to attendance visualization */}
      {hasNoData ? (
        <div className="bg-muted flex h-4 w-full overflow-hidden rounded">
          <div className="flex w-full items-center justify-center">
            <span className="text-muted-foreground text-xs">
              No payroll data
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

      {/* Metrics cards in grid - similar to attendance stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center rounded-lg border p-3">
          <div className="flex items-center gap-1.5">
            <span className="bg-primary h-3 w-3 rounded-full" />
            <span className="text-sm font-medium">Net Pay</span>
          </div>
          <p className="text-xl font-semibold">
            {data.totalNetPay === 0
              ? "₱0"
              : `₱${(data.totalNetPay / 1000).toFixed(0)}K`}
          </p>
          <p className="text-muted-foreground text-xs">
            {hasNoData ? "0.0%" : `${netPayPercentage.toFixed(1)}%`}
          </p>
        </div>

        <div className="flex flex-col items-center rounded-lg border p-3">
          <div className="flex items-center gap-1.5">
            <span className="bg-secondary h-3 w-3 rounded-full" />
            <span className="text-sm font-medium">Deductions</span>
          </div>
          <p className="text-xl font-semibold">
            {data.totalDeductions === 0
              ? "₱0"
              : `₱${(data.totalDeductions / 1000).toFixed(0)}K`}
          </p>
          <p className="text-muted-foreground text-xs">
            {hasNoData ? "0.0%" : `${deductionsPercentage.toFixed(1)}%`}
          </p>
        </div>
      </div>

      {/* Detailed amounts */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div>
          <p className="text-muted-foreground text-sm">Total Net Pay</p>
          <p className="text-lg font-semibold">
            {data.totalNetPay === 0
              ? "₱0.00"
              : `₱${data.totalNetPay.toLocaleString()}`}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Total Deductions</p>
          <p className="text-lg font-semibold">
            {data.totalDeductions === 0
              ? "₱0.00"
              : `₱${data.totalDeductions.toLocaleString()}`}
          </p>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton component
const PayrollSummarySkeleton = () => (
  <div className="w-full space-y-2 rounded-lg border p-2">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-8 w-28" />
    </div>
    <div className="bg-border -mx-2 h-px px-2" />
    <div className="space-y-3">
      <div className="flex justify-between">
        <div className="space-y-1">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-1 text-right">
          <div className="flex items-center justify-end gap-1">
            <Skeleton className="h-9 w-12" />
            <Skeleton className="h-5 w-12" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
    <div className="bg-border -mx-2 h-px px-2" />
    <div className="space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-full rounded" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

export const PayrollSummary = () => {
  const { data: payrollData, isLoading, error } = usePayrollSummary();

  const latestPayrollData = useMemo(() => {
    if (!payrollData?.data || payrollData.data.length === 0) return null;

    // Get the most recent processed payroll
    const processedPayrolls = payrollData.data.filter(
      (p) => p.date_processed !== null,
    );

    if (processedPayrolls.length === 0) return null;

    const latest = processedPayrolls.sort(
      (a, b) =>
        new Date(b.date_processed!).getTime() -
        new Date(a.date_processed!).getTime(),
    )[0];

    // Calculate totals from payslips
    const totalGrossPay = latest.payslips.reduce(
      (sum, payslip) => sum + payslip.gross_pay,
      0,
    );
    const totalDeductions = latest.payslips.reduce(
      (sum, payslip) => sum + payslip.total_mandatory_deductions,
      0,
    );
    const totalNetPay = totalGrossPay - totalDeductions;

    return {
      ...latest,
      totalGrossPay,
      totalDeductions,
      totalNetPay,
      totalEmployees: latest.payslips.length,
    };
  }, [payrollData]);

  if (isLoading) {
    return <PayrollSummarySkeleton />;
  }

  if (error || !latestPayrollData) {
    return (
      <div className="w-full space-y-2 rounded-lg border p-2">
        <SummaryHeader />
        <div className="bg-border -mx-2 h-px px-2" />
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="text-muted-foreground mx-auto h-12 w-12" />
            <p className="text-muted-foreground mt-2 text-sm">
              {error
                ? "Failed to load payroll data"
                : "No payroll data available"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2 rounded-lg border p-2">
      <SummaryHeader />
      <div className="bg-border -mx-2 h-px px-2" />
      <PayrollOverview data={latestPayrollData} />
      <div className="bg-border -mx-2 h-px px-2" />
      <PayrollBreakdown
        data={latestPayrollData}
        totalGrossPay={latestPayrollData.totalGrossPay}
      />
    </div>
  );
};
