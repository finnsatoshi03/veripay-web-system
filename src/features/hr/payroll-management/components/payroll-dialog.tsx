import { useState, useRef } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Clipboard,
  Users,
  FileText,
  Shield,
  AlertTriangle,
  CreditCard,
  Upload,
  Download,
  Info,
  X,
  Eye,
  PiggyBank,
} from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { formatNotionDate } from "@/lib/helpers/formatters";
import { useMarkPaidPayslips } from "../mutations/payroll-service";
import { toast } from "react-hot-toast";

import type { PayrollPeriod } from "../lib/data";
import { cn } from "@/lib/utils";

interface PayrollDialogProps {
  payroll: PayrollPeriod | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CebuanaMapping {
  employee_id: number;
  cebuana_id: string;
}

interface PayslipsTableDialogProps {
  payroll: PayrollPeriod | null;
  cebuanaMappings: CebuanaMapping[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PayslipsTableDialog = ({
  payroll,
  cebuanaMappings,
  open,
  onOpenChange,
}: PayslipsTableDialogProps) => {
  if (!payroll || !payroll.rawData) return null;

  const rawData = payroll.rawData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate totals
  const totals = rawData.payslips.reduce(
    (acc, payslip) => ({
      basic_pay: acc.basic_pay + payslip.basic_pay,
      gross_pay: acc.gross_pay + payslip.gross_pay,
      deductions: acc.deductions + payslip.deductions,
      net_pay: acc.net_pay + payslip.net_pay,
    }),
    { basic_pay: 0, gross_pay: 0, deductions: 0, net_pay: 0 },
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[1000px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Employee Payslips - {payroll.period}
            </h2>
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Users className="size-3" />
              {rawData.payslips.length} Employees
            </Badge>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">#</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="bg-blue-50 text-right dark:bg-blue-950/30">
                    Basic Pay
                  </TableHead>
                  <TableHead className="bg-blue-50 text-right dark:bg-blue-950/30">
                    Gross Pay
                  </TableHead>
                  <TableHead className="bg-red-50 text-right dark:bg-red-950/30">
                    Deductions
                  </TableHead>
                  <TableHead className="bg-green-50 text-right dark:bg-green-950/30">
                    Net Pay
                  </TableHead>
                  {cebuanaMappings.length > 0 && (
                    <TableHead>Payment Reference</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rawData.payslips.map((payslip, index) => {
                  const mapping = cebuanaMappings.find(
                    (m) => m.employee_id === payslip.employee_id,
                  );
                  return (
                    <TableRow key={payslip.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{payslip.employee_id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {payslip.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="bg-blue-50/30 text-right font-mono dark:bg-blue-950/20">
                        {formatCurrency(payslip.basic_pay)}
                      </TableCell>
                      <TableCell className="bg-blue-50/30 text-right font-mono dark:bg-blue-950/20">
                        {formatCurrency(payslip.gross_pay)}
                      </TableCell>
                      <TableCell className="bg-red-50/30 text-right font-mono dark:bg-red-950/20">
                        {formatCurrency(payslip.deductions)}
                      </TableCell>
                      <TableCell className="bg-green-50/30 text-right font-mono font-semibold dark:bg-green-950/20">
                        {formatCurrency(payslip.net_pay)}
                      </TableCell>
                      {cebuanaMappings.length > 0 && (
                        <TableCell>
                          {mapping ? (
                            <Badge variant="default" className="text-xs">
                              {mapping.cebuana_id}
                            </Badge>
                          ) : payslip.net_pay > 0 ? (
                            <Badge variant="destructive" className="text-xs">
                              Missing
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              N/A
                            </span>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
                {/* Totals Row */}
                <TableRow className="bg-muted/30 border-t-2 font-semibold">
                  <TableCell className="text-base font-bold">TOTAL</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="bg-blue-50/50 text-right text-base font-bold dark:bg-blue-950/30">
                    {formatCurrency(totals.basic_pay)}
                  </TableCell>
                  <TableCell className="bg-blue-50/50 text-right text-base font-bold dark:bg-blue-950/30">
                    {formatCurrency(totals.gross_pay)}
                  </TableCell>
                  <TableCell className="bg-red-50/50 text-right text-base font-bold dark:bg-red-950/30">
                    {formatCurrency(totals.deductions)}
                  </TableCell>
                  <TableCell className="bg-green-50/50 text-right text-lg font-bold dark:bg-green-950/30">
                    {formatCurrency(totals.net_pay)}
                  </TableCell>
                  {cebuanaMappings.length > 0 && <TableCell></TableCell>}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const PayrollDialog = ({
  payroll,
  open,
  onOpenChange,
}: PayrollDialogProps) => {
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const [cebuanaMappings, setCebuanaMappings] = useState<CebuanaMapping[]>([]);
  const [payslipsDialogOpen, setPayslipsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const markPaidMutation = useMarkPaidPayslips();

  if (!payroll || !payroll.rawData) return null;

  const rawData = payroll.rawData;
  const payrollId = `PAY-${new Date().getFullYear()}-${payroll.id.padStart(4, "0")}`;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="size-4" />;
      case "processed":
        return <CheckCircle className="size-4" />;
      case "scheduled":
        return <Clipboard className="size-4" />;
      default:
        return <Clock className="size-4" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "processed":
        return "bg-green-100 text-green-700 border-green-200";
      case "scheduled":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split("\n");
      const mappings: CebuanaMapping[] = [];

      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [employee_id, cebuana_id] = line.split(",");
        if (employee_id && cebuana_id) {
          mappings.push({
            employee_id: parseInt(employee_id.trim()),
            cebuana_id: cebuana_id.trim(),
          });
        }
      }

      setCebuanaMappings(mappings);
      toast.success(
        `Successfully loaded ${mappings.length} payment references`,
      );
    };

    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csvContent = [
      "employee_id,cebuana_id",
      ...rawData.payslips.map((payslip) => `${payslip.employee_id},`),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payroll_${payroll.id}_payment_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleMarkPaid = async () => {
    if (cebuanaMappings.length === 0) {
      toast.error("Please upload payment reference numbers first");
      return;
    }

    setIsMarkingPaid(true);

    // Convert mappings to the format expected by the API (only employee_id -> cebuana_id)
    const cebuanaMap = cebuanaMappings.reduce(
      (acc, mapping) => {
        acc[mapping.employee_id.toString()] = mapping.cebuana_id;
        return acc;
      },
      {} as Record<string, string>,
    );

    markPaidMutation.mutate(
      {
        payrollId: parseInt(payroll.id),
        cebuanaMap,
      },
      {
        onSuccess: () => {
          toast.success(`Successfully marked payroll ${payroll.id} as paid`);
          onOpenChange(false);
          setCebuanaMappings([]);
        },
        onError: (error) => {
          toast.error(`Failed to mark payroll as paid: ${error.message}`);
        },
        onSettled: () => {
          setIsMarkingPaid(false);
        },
      },
    );
  };

  const canMarkPaid = rawData.status === "processing";
  const needsAction = rawData.status === "processing";

  // Fix the logic to check if all employees with pay actually have mappings
  const employeesWithPay = rawData.payslips.filter((p) => p.net_pay > 0);
  const allPayslipsMapped = employeesWithPay.every((payslip) =>
    cebuanaMappings.some(
      (mapping) => mapping.employee_id === payslip.employee_id,
    ),
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            "max-h-[85vh] overflow-y-auto",
            rawData.status === "approved"
              ? "sm:max-w-[600px]"
              : "sm:max-w-[900px]",
          )}
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <span>HR Portal</span>
                  <span>/</span>
                  <span>Payroll</span>
                  <span>/</span>
                  <span className="text-foreground font-medium">
                    {payrollId}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 border-blue-200 bg-blue-50 text-blue-700"
                >
                  <Shield className="size-3" />
                  HR Portal
                </Badge>
              </div>

              <div className="space-y-4">
                <h1 className="pr-8 text-2xl leading-tight font-bold">
                  Payroll Period: {payroll.period}
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1.5 ${getStatusStyles(rawData.status)}`}
                  >
                    {getStatusIcon(rawData.status)}
                    {rawData.status.charAt(0).toUpperCase() +
                      rawData.status.slice(1)}
                  </Badge>

                  <Badge
                    variant="outline"
                    className="flex items-center gap-1.5"
                  >
                    <Users className="size-3" />
                    {payroll.employeeCount} Employees
                  </Badge>

                  <Badge
                    variant="outline"
                    className="flex items-center gap-1.5"
                  >
                    {formatCurrency(payroll.totalNet)} Total
                  </Badge>

                  {needsAction && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1.5 border-orange-200 bg-orange-50 text-orange-700"
                    >
                      <AlertTriangle className="size-3" />
                      Action Required
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Two Column Layout */}
            <div
              className={cn(
                "grid grid-cols-1 gap-6",
                rawData.status === "approved"
                  ? "lg:grid-cols-1"
                  : "lg:grid-cols-2",
              )}
            >
              {/* Left Column - Payroll Details & Timeline */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <PiggyBank className="text-muted-foreground size-4" />
                    <h3 className="font-semibold">Financial Summary</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        Total Gross Pay
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrency(payroll.totalGross)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        Total Deductions
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrency(payroll.totalDeductions)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-2">
                      <span className="text-muted-foreground text-sm">
                        Total Net Pay
                      </span>
                      <span className="text-lg font-bold">
                        {formatCurrency(payroll.totalNet)}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <FileText className="text-muted-foreground size-4" />
                    Payroll Details & Timeline
                  </h3>

                  <div className="space-y-4">
                    {/* Period Information */}
                    <div className="space-y-3">
                      <h4 className="text-muted-foreground text-sm font-medium">
                        Period Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="text-muted-foreground size-3" />
                          <span className="text-sm">
                            {payroll.startDate} to {payroll.endDate}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            Created:{" "}
                          </span>
                          {formatNotionDate(rawData.created_at)}
                        </div>
                        {rawData.date_processed && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Processed:{" "}
                            </span>
                            {formatNotionDate(rawData.date_processed)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Information */}
                    <div className="space-y-3">
                      <h4 className="text-muted-foreground text-sm font-medium">
                        Status Information
                      </h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            Status:{" "}
                          </span>
                          <Badge
                            variant={
                              rawData.status === "approved"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {rawData.status === "approved"
                              ? "Approved"
                              : rawData.status}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            Total Employees:{" "}
                          </span>
                          {rawData.total_employees || rawData.payslips.length}
                        </div>
                        {rawData.notes && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Notes:{" "}
                            </span>
                            <p className="mt-1 text-sm">{rawData.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employee Payslips Summary */}
                <Separator />
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <CreditCard className="text-muted-foreground size-4" />
                    Employee Payslips
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        Total Employees
                      </span>
                      <span className="font-semibold">
                        {rawData.payslips.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        Employees with Pay
                      </span>
                      <span className="font-semibold">
                        {rawData.payslips.filter((p) => p.net_pay > 0).length}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPayslipsDialogOpen(true)}
                      className="w-full"
                    >
                      <Eye className="mr-2 size-4" />
                      View Detailed Payslips
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment Processing & Actions */}
              <div className="space-y-6">
                {/* Payment Reference Mapping */}
                {rawData.status !== "approved" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Upload className="text-muted-foreground size-4" />
                      <h3 className="font-semibold">
                        Payment Reference Mapping
                      </h3>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Upload a file containing payment reference numbers (like
                        Cebuana transaction IDs) for each employee. This helps
                        track which payments have been processed.
                        <br />
                        <strong>File format:</strong>{" "}
                        employee_id,reference_number
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="csv-upload">
                          Upload Payment References
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="csv-upload"
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="size-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Download Template</Label>
                        <Button
                          variant="outline"
                          onClick={downloadTemplate}
                          className="w-full"
                        >
                          <Download className="mr-2 size-4" />
                          Download Template File
                        </Button>
                      </div>
                    </div>

                    {cebuanaMappings.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            Loaded {cebuanaMappings.length} payment references
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCebuanaMappings([])}
                          >
                            <X className="size-4" />
                            Clear
                          </Button>
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {allPayslipsMapped ? (
                            <span className="text-green-600">
                              ✓ All employees with pay have reference numbers
                            </span>
                          ) : (
                            <span className="text-orange-600">
                              ⚠ Some employees are missing reference numbers
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Required Notice */}
                {needsAction && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="size-4 text-orange-600" />
                        <h3 className="font-semibold text-orange-900">
                          Action Required
                        </h3>
                      </div>
                      <div className="rounded-r-md border-l-4 border-orange-200 bg-orange-50 p-4">
                        <p className="text-sm leading-relaxed text-orange-800">
                          This payroll has been calculated but needs to be
                          marked as paid. Please upload the payment reference
                          numbers and verify all payments have been processed
                          before marking as complete.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* HR Actions */}
                {canMarkPaid && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Shield className="text-muted-foreground size-4" />
                        <span>HR Actions</span>
                      </div>
                      <div className="space-y-3">
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={handleMarkPaid}
                          disabled={
                            isMarkingPaid ||
                            markPaidMutation.isPending ||
                            cebuanaMappings.length === 0
                          }
                        >
                          <CheckCircle className="mr-2 size-4" />
                          {isMarkingPaid
                            ? "Processing..."
                            : "Mark All Payments as Complete"}
                        </Button>
                        {cebuanaMappings.length === 0 && (
                          <p className="text-muted-foreground text-center text-sm">
                            Please upload payment reference numbers to complete
                            this action.
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PayslipsTableDialog
        payroll={payroll}
        cebuanaMappings={cebuanaMappings}
        open={payslipsDialogOpen}
        onOpenChange={setPayslipsDialogOpen}
      />
    </>
  );
};
