import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PayslipActions } from "./payslips-actions";
import type { EmployeePayslip } from "../lib/data";

interface EmployeePayslipsTableProps {
  payslips: EmployeePayslip[];
  visibleColumns?: string[];
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
}: EmployeePayslipsTableProps) => {
  const columns = PAYSLIP_TABLE_COLUMNS.filter((col) =>
    visibleColumns.includes(col.id)
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
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "Generated":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Voided":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-600";
      case "Generated":
        return "bg-yellow-600";
      case "Voided":
        return "bg-red-600";
      default:
        return "bg-gray-600";
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
          payslips.map((payslip) => (
            <TableRow key={payslip.id} className="hover:bg-muted/50">
              {visibleColumns.includes("period") && (
                <TableCell className="font-medium">
                  {payslip.period}
                </TableCell>
              )}
              {visibleColumns.includes("netPay") && (
                <TableCell className="font-medium">
                  {formatCurrency(payslip.netPay)}
                </TableCell>
              )}
              {visibleColumns.includes("status") && (
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusBadgeClasses(payslip.status)}
                  >
                    <div className={`h-2 w-2 rounded-full ${getStatusDotColor(payslip.status)}`}></div>
                    {payslip.status}
                  </Badge>
                </TableCell>
              )}
              {visibleColumns.includes("datePaid") && (
                <TableCell className="text-muted-foreground">
                  {payslip.datePaid}
                </TableCell>
              )}
              {visibleColumns.includes("actions") && (
                <TableCell>
                  <PayslipActions payslip={payslip} />
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
