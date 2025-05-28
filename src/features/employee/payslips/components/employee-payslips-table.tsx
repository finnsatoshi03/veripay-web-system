import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

import { formatNotionDate } from "@/lib/helpers/formatters";
import type { PayslipData } from "@/services/employee/payslips";

interface EmployeePayslipsTableProps {
  payslips: PayslipData[];
  visibleColumns?: string[];
  onPayslipClick?: (payslip: PayslipData) => void;
}

export const PAYSLIP_TABLE_COLUMNS = [
  { id: "period", label: "Period" },
  { id: "netPay", label: "Net Pay" },
  { id: "status", label: "Status" },
  { id: "datePaid", label: "Date Paid" },
  { id: "actions", label: "Actions" },
];

export const EmployeePayslipsTable = ({
  payslips,
  visibleColumns = ["period", "netPay", "status", "datePaid", "actions"],
  onPayslipClick,
}: EmployeePayslipsTableProps) => {
  const columns = PAYSLIP_TABLE_COLUMNS.filter((col) =>
    visibleColumns.includes(col.id),
  );

  const getColSpan = () => visibleColumns.length || 1;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "generated":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-600";
      case "generated":
        return "bg-blue-600";
      case "draft":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  const handleRowClick = (payslip: PayslipData) => {
    if (onPayslipClick) {
      onPayslipClick(payslip);
    }
  };

  const handleViewClick = (e: React.MouseEvent, payslip: PayslipData) => {
    e.stopPropagation();
    if (onPayslipClick) {
      onPayslipClick(payslip);
    }
  };

  return (
    <Table>
      <TableHeader className="sticky top-0 z-20 bg-zinc-200 dark:bg-zinc-800">
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.id}
              className={`font-medium ${column.id === "actions" ? "w-[100px]" : ""}`}
            >
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {payslips.length === 0 ? (
          <TableRow>
            <TableCell colSpan={getColSpan()} className="h-24 text-center">
              No payslips found.
            </TableCell>
          </TableRow>
        ) : (
          payslips.map((payslip) => {
            const payroll = payslip.payrolls;

            // Improved period logic with better fallbacks
            let period = "Unknown Period";

            if (payroll?.period_start && payroll?.period_end) {
              period = `${formatNotionDate(payroll.period_start)} - ${formatNotionDate(payroll.period_end)}`;
            } else if (
              payslip.payrolls &&
              Array.isArray(payslip.payrolls) &&
              payslip.payrolls.length > 0
            ) {
              // Try to access period from the payrolls array directly
              const payrollData = payslip.payrolls[0];
              if (payrollData.period_start && payrollData.period_end) {
                period = `${formatNotionDate(payrollData.period_start)} - ${formatNotionDate(payrollData.period_end)}`;
              }
            } else {
              // Fallback: try to derive period from issued_at date
              const issuedDate = new Date(payslip.issued_at);
              const year = issuedDate.getFullYear();
              const month = issuedDate.getMonth();
              const periodStart = new Date(year, month, 1);
              const periodEnd = new Date(year, month + 1, 0);
              period = `${formatNotionDate(periodStart.toISOString())} - ${formatNotionDate(periodEnd.toISOString())}`;
            }

            return (
              <TableRow
                key={payslip.id}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => handleRowClick(payslip)}
              >
                {visibleColumns.includes("period") && (
                  <TableCell className="font-medium">{period}</TableCell>
                )}
                {visibleColumns.includes("netPay") && (
                  <TableCell className="font-medium">
                    {formatCurrency(payslip.net_pay)}
                  </TableCell>
                )}
                {visibleColumns.includes("status") && (
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusBadgeClasses(payslip.status)}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${getStatusDotColor(payslip.status)}`}
                      ></div>
                      {payslip.status}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.includes("datePaid") && (
                  <TableCell className="text-muted-foreground">
                    {payslip.date_paid
                      ? formatNotionDate(payslip.date_paid)
                      : "Not paid"}
                  </TableCell>
                )}
                {visibleColumns.includes("actions") && (
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={(e) => handleViewClick(e, payslip)}
                    >
                      <Eye className="size-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};
