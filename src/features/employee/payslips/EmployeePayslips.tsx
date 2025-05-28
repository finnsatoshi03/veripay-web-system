import { useMemo } from "react";
import { today } from "@/features/employee/_lib/helpers";
import EmployeePayslipsBoard from "./components/employee-payslips-board";
import { Separator } from "@/components/ui/separator";
import { PayslipsSummary } from "./components/payslips-summary";
import { PayslipsStats } from "./components/payslips-stats";

import { usePayslipSummary, usePayslips } from "./mutations/payslips-service";
import { useUser } from "@/store/userStore";

export default function EmployeePayslips() {
  const { employeeId } = useUser();

  const { data: summaryData, isLoading: isSummaryLoading } =
    usePayslipSummary(employeeId);

  // Get all payslips to calculate paid percentage
  const { data: allPayslipsResponse } = usePayslips({
    employeeId: employeeId || undefined,
    page: 1,
    limit: 100,
  });

  const summaryItems = useMemo(() => {
    if (!summaryData) {
      return [
        { label: "Gross Pay", value: "₱0.00" },
        { label: "Deductions", value: "₱0.00" },
        { label: "Net Pay", value: "₱0.00" },
      ];
    }

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
      }).format(amount);
    };

    return [
      {
        label: "Total Gross Pay",
        value: formatCurrency(summaryData.totalGrossPay),
      },
      {
        label: "Total Deductions",
        value: formatCurrency(summaryData.totalDeductions),
      },
      {
        label: "Average Net Pay",
        value: formatCurrency(summaryData.averageNetPay),
      },
    ];
  }, [summaryData]);

  const payslipsStatsData = useMemo(() => {
    if (!summaryData || summaryData.totalGrossPay === 0) {
      return {
        netPay: 0,
        deductions: 0,
        paid: 0,
      };
    }

    const netPayPercentage = Math.round(
      (summaryData.totalNetPay / summaryData.totalGrossPay) * 100,
    );
    const deductionsPercentage = Math.round(
      (summaryData.totalDeductions / summaryData.totalGrossPay) * 100,
    );

    // Calculate paid percentage from actual data
    let paidPercentage = 0;
    if (allPayslipsResponse?.data && allPayslipsResponse.data.length > 0) {
      const totalPayslips = allPayslipsResponse.data.length;
      const paidPayslips = allPayslipsResponse.data.filter(
        (payslip) => payslip.status.toLowerCase() === "paid",
      ).length;
      paidPercentage = Math.round((paidPayslips / totalPayslips) * 100);
    }

    return {
      netPay: netPayPercentage,
      deductions: deductionsPercentage,
      paid: paidPercentage,
    };
  }, [summaryData, allPayslipsResponse]);

  if (isSummaryLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading payslips data...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Employee Payslips</h1>
            <p className="text-muted-foreground text-sm">{today}</p>
          </div>
          <Separator />
          <PayslipsStats percentages={payslipsStatsData} />
        </div>
        <PayslipsSummary items={summaryItems} />
      </div>

      <div className="relative h-full min-h-0 flex-1 overflow-auto">
        <EmployeePayslipsBoard />
      </div>
    </div>
  );
}
