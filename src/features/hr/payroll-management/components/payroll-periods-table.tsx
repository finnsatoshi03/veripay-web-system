import { useState } from "react";
import { CheckCircle2, Clock, Loader2, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PayrollActions } from "./payroll-actions";
import { PayrollDialog } from "./payroll-dialog";
import type { PayrollPeriod } from "../lib/data";

interface PayrollPeriodsTableProps {
  payrolls: PayrollPeriod[];
  visibleColumns?: string[];
}

export const PAYROLL_TABLE_COLUMNS = [
  { id: "period", label: "Period" },
  { id: "status", label: "Status" },
  { id: "employeeCount", label: "# of Employees" },
  { id: "totalGross", label: "Total Gross" },
  { id: "totalDeductions", label: "Total Deductions" },
  { id: "totalNet", label: "Total Net" },
  { id: "actions", label: "Actions" },
];

export const PayrollPeriodsTable = ({
  payrolls,
  visibleColumns = [
    "period",
    "status",
    "employeeCount",
    "totalGross",
    "totalDeductions",
    "totalNet",
    "actions",
  ],
}: PayrollPeriodsTableProps) => {
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollPeriod | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter columns by visibility
  const columns = PAYROLL_TABLE_COLUMNS.filter((col) =>
    visibleColumns.includes(col.id),
  );

  const getColSpan = () => visibleColumns.length || 1;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processed":
        return (
          <Badge
            variant="secondary"
            className="border-green-200 bg-green-100 text-green-700"
          >
            <CheckCircle2 className="mr-1 size-3" />
            Processed
          </Badge>
        );
      case "processing":
        return (
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="border-yellow-200 bg-yellow-100 text-yellow-700"
            >
              <Clock className="mr-1 size-3" />
              Processing
            </Badge>
            <Badge
              variant="outline"
              className="border-orange-200 bg-orange-50 text-orange-700"
            >
              <AlertTriangle className="mr-1 size-3" />
              Action Required
            </Badge>
          </div>
        );
      case "scheduled":
        return (
          <Badge
            variant="secondary"
            className="border-blue-200 bg-blue-100 text-blue-700"
          >
            <Loader2 className="mr-1 size-3" />
            Scheduled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "--";
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatEmployeeCount = (count: number) => {
    if (count === 0) return "--";
    return count.toString();
  };

  const handleRowClick = (payroll: PayrollPeriod) => {
    setSelectedPayroll(payroll);
    setDialogOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader className="sticky top-0 bg-zinc-200 dark:bg-zinc-800">
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
          {payrolls.length === 0 ? (
            <TableRow>
              <TableCell colSpan={getColSpan()} className="h-24 text-center">
                No payroll periods found.
              </TableCell>
            </TableRow>
          ) : (
            payrolls.map((payroll) => (
              <TableRow
                key={payroll.id}
                className={`hover:bg-muted/50 cursor-pointer transition-colors ${
                  payroll.status === "processing"
                    ? "border-l-4 border-l-orange-400"
                    : ""
                }`}
                onClick={() => handleRowClick(payroll)}
              >
                {visibleColumns.includes("period") && (
                  <TableCell className="font-medium">
                    {payroll.period}
                  </TableCell>
                )}
                {visibleColumns.includes("status") && (
                  <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                )}
                {visibleColumns.includes("employeeCount") && (
                  <TableCell className="">
                    {formatEmployeeCount(payroll.employeeCount)}
                  </TableCell>
                )}
                {visibleColumns.includes("totalGross") && (
                  <TableCell className="font-mono">
                    {formatCurrency(payroll.totalGross)}
                  </TableCell>
                )}
                {visibleColumns.includes("totalDeductions") && (
                  <TableCell className="font-mono">
                    {formatCurrency(payroll.totalDeductions)}
                  </TableCell>
                )}
                {visibleColumns.includes("totalNet") && (
                  <TableCell className="font-mono font-semibold">
                    {formatCurrency(payroll.totalNet)}
                  </TableCell>
                )}
                {visibleColumns.includes("actions") && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <PayrollActions payroll={payroll} />
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PayrollDialog
        payroll={selectedPayroll}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};
