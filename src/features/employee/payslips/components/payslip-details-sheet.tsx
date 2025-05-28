import { useMemo } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  FileText,
  Receipt,
  TrendingDown,
  Wallet,
  Building,
  CreditCard,
  PiggyBank,
} from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { formatInitials, formatNotionDate } from "@/lib/helpers/formatters";
import { useUser } from "@/store/userStore";
import { useDetailedPayslip } from "../mutations/payslips-service";

import type { PayslipData } from "@/services/employee/payslips";

interface PayslipDetailsDialogProps {
  payslip: PayslipData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PayslipDetailsDialog = ({
  payslip,
  open,
  onOpenChange,
}: PayslipDetailsDialogProps) => {
  const { fullName, profile } = useUser();

  // Get detailed payslip data
  const { data: detailedPayslip, isLoading } = useDetailedPayslip(
    payslip?.id || null,
  );

  const payslipDetails = useMemo(() => {
    const currentPayslip = detailedPayslip || payslip;
    if (!currentPayslip) return null;

    const payslipId = `PAY-${new Date(currentPayslip.issued_at).getFullYear()}-${currentPayslip.id.toString().padStart(4, "0")}`;

    // Handle the correct data structure - single objects, not arrays
    const payroll = currentPayslip.payrolls;
    const employee = currentPayslip.employees;
    const userProfile = employee?.users?.user_profiles;

    // For detailed payslip, access departments and positions from employees
    const department = employee?.departments;
    const position = employee?.positions;

    // Improved period logic with better fallbacks
    let period = "Unknown Period";

    if (payroll?.period_start && payroll?.period_end) {
      period = `${formatNotionDate(payroll.period_start)} - ${formatNotionDate(payroll.period_end)}`;
    } else {
      // Fallback: try to derive period from issued_at date
      const issuedDate = new Date(currentPayslip.issued_at);
      const year = issuedDate.getFullYear();
      const month = issuedDate.getMonth();
      const periodStart = new Date(year, month, 1);
      const periodEnd = new Date(year, month + 1, 0);
      period = `${formatNotionDate(periodStart.toISOString())} - ${formatNotionDate(periodEnd.toISOString())}`;
    }

    // Get employee name from the nested structure
    const employeeName = userProfile
      ? `${userProfile.first_name} ${userProfile.last_name}`.trim()
      : fullName;

    // Calculate total mandatory deductions
    const mandatoryDeductions = detailedPayslip?.mandatory_deductions || [];
    const totalMandatoryDeductions = mandatoryDeductions.reduce(
      (sum, deduction) => sum + deduction.calculated_amount,
      0,
    );

    // Only include mandatory deductions if there are employee benefits
    const shouldShowMandatoryDeductions =
      (detailedPayslip?.employee_benefits || []).length > 0;
    const effectiveMandatoryDeductions = shouldShowMandatoryDeductions
      ? totalMandatoryDeductions
      : 0;

    // Use the higher value between calculated mandatory deductions and payslip deductions
    const totalDeductions = Math.max(
      effectiveMandatoryDeductions,
      currentPayslip.deductions,
    );

    return {
      id: payslipId,
      period,
      employeeName,
      employeeCode: employee?.employee_code || "N/A",
      department: department?.name || "N/A",
      position: position?.title || "N/A",
      baseSalary: position?.base_salary || 0,
      basicPay: currentPayslip.basic_pay,
      grossPay: currentPayslip.gross_pay,
      netPay: currentPayslip.net_pay,
      allowances: currentPayslip.allowances,
      deductions: totalDeductions,
      originalDeductions: currentPayslip.deductions,
      overtimePay: currentPayslip.overtime_pay,
      status: currentPayslip.status,
      issuedAt: currentPayslip.issued_at,
      datePaid: currentPayslip.date_paid,
      remarks: currentPayslip.remarks,
      cebuanaId: currentPayslip.cebuana_id,
      profileImage: userProfile?.profile_image || profile?.profile_image,
      payrollStatus: payroll?.status,
      payrollProcessedDate: payroll?.date_processed,
      mandatoryDeductions: mandatoryDeductions,
      employeeBenefits: detailedPayslip?.employee_benefits || [],
      shouldShowMandatoryDeductions,
    };
  }, [detailedPayslip, payslip, fullName, profile]);

  if (!payslip || !payslipDetails) return null;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <CheckCircle className="size-4" />;
      case "generated":
        return <Clock className="size-4" />;
      case "draft":
        return <AlertCircle className="size-4" />;
      default:
        return <Clock className="size-4" />;
    }
  };

  const getStatusStyles = (status: string) => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[900px]">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-1" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>

              <div className="space-y-4">
                <Skeleton className="h-8 w-80" />
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Two Column Layout Skeleton */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left Column Skeleton */}
              <div className="space-y-6">
                {/* Employee Information Skeleton */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-5 w-40" />
                  </div>

                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Earnings Breakdown Skeleton */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-5 w-36" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center justify-between border-t pt-3">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-6 w-28" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column Skeleton */}
              <div className="space-y-6">
                {/* Deductions Skeleton */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-5 w-24" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex items-center justify-between border-t pt-3">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Net Pay Skeleton */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-5 w-16" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-8 w-36" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>

                {/* Payment Information Skeleton */}
                <Separator />
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-5 w-36" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Footer Skeleton */}
            <Separator />
            <div className="bg-muted/30 p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <Skeleton className="mx-auto h-3 w-16" />
                  <Skeleton className="mx-auto h-4 w-20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="mx-auto h-3 w-20" />
                  <Skeleton className="mx-auto h-4 w-20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="mx-auto h-3 w-16" />
                  <Skeleton className="mx-auto h-4 w-20" />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[900px]">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>Employee Portal</span>
                <span>/</span>
                <span>Payslips</span>
                <span>/</span>
                <span className="text-foreground font-medium">
                  {payslipDetails.id}
                </span>
              </div>
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 border-blue-200 bg-blue-50 text-blue-700"
              >
                <Receipt className="size-3" />
                Payslip
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="pr-8 text-2xl leading-tight font-bold">
                Payslip for {payslipDetails.period}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1.5 ${getStatusStyles(payslipDetails.status)}`}
                >
                  {getStatusIcon(payslipDetails.status)}
                  {payslipDetails.status}
                </Badge>

                {payslipDetails.employeeCode !== "N/A" && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1.5"
                  >
                    <User className="size-3" />
                    {payslipDetails.employeeCode}
                  </Badge>
                )}

                {payslipDetails.payrollStatus && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1.5"
                  >
                    <Building className="size-3" />
                    Payroll {payslipDetails.payrollStatus}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column - Employee & Earnings */}
            <div className="space-y-6">
              {/* Employee Information */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <User className="text-muted-foreground size-4" />
                  Employee Information
                </h3>

                <div className="flex items-center gap-3">
                  <Avatar className="size-12 flex-shrink-0">
                    <AvatarImage
                      src={payslipDetails.profileImage || undefined}
                      alt={payslipDetails.employeeName}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {formatInitials(payslipDetails.employeeName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{payslipDetails.employeeName}</p>
                    {payslipDetails.employeeCode !== "N/A" && (
                      <p className="text-muted-foreground text-sm">
                        Employee ID: {payslipDetails.employeeCode}
                      </p>
                    )}
                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <Calendar className="size-3" />
                      Issued: {formatNotionDate(payslipDetails.issuedAt)}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Department
                    </span>
                    <span className="text-sm font-medium">
                      {payslipDetails.department}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Position
                    </span>
                    <span className="text-sm font-medium">
                      {payslipDetails.position}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Earnings Breakdown */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <PiggyBank className="text-muted-foreground size-4" />
                  Earnings Breakdown
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Basic Pay
                    </span>
                    <span className="font-mono font-medium">
                      {formatCurrency(payslipDetails.basicPay)}
                    </span>
                  </div>

                  {payslipDetails.overtimePay > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        Overtime Pay
                      </span>
                      <span className="font-mono font-medium">
                        {formatCurrency(payslipDetails.overtimePay)}
                      </span>
                    </div>
                  )}

                  {/* Employee Benefits */}
                  {payslipDetails.employeeBenefits.length > 0 && (
                    <>
                      {payslipDetails.employeeBenefits.map((benefit, index) => {
                        const benefitInfo = benefit.benefits?.[0];
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-muted-foreground text-sm">
                              {benefitInfo?.name || `Benefit ${index + 1}`}
                            </span>
                            <span className="font-mono text-sm">
                              +{formatCurrency(benefit.value)}
                            </span>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {payslipDetails.allowances > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        Other Allowances
                      </span>
                      <span className="font-mono font-medium">
                        +{formatCurrency(payslipDetails.allowances)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="font-semibold">Gross Pay</span>
                    <span className="font-mono text-lg font-bold">
                      {formatCurrency(payslipDetails.grossPay)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Deductions & Net Pay */}
            <div className="space-y-6">
              {/* Deductions */}
              {payslipDetails.deductions > 0 ||
              payslipDetails.mandatoryDeductions.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <TrendingDown className="text-muted-foreground size-4" />
                    Deductions
                  </h3>

                  <div className="space-y-3">
                    {/* Mandatory Deductions - only show if there are employee benefits */}
                    {payslipDetails.shouldShowMandatoryDeductions &&
                      payslipDetails.mandatoryDeductions.length > 0 && (
                        <>
                          {payslipDetails.mandatoryDeductions.map(
                            (deduction, index) => (
                              <div key={index} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground text-sm">
                                    {deduction.name}
                                  </span>
                                  <span className="font-mono text-sm text-red-600">
                                    -
                                    {formatCurrency(
                                      deduction.calculated_amount,
                                    )}
                                  </span>
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {deduction.amount_type === "percentage"
                                    ? `${deduction.value}% of basic pay`
                                    : "Fixed amount"}
                                </div>
                              </div>
                            ),
                          )}
                        </>
                      )}

                    {/* Other Deductions - only show if there are additional deductions beyond mandatory */}
                    {payslipDetails.originalDeductions > 0 &&
                      payslipDetails.originalDeductions !==
                        payslipDetails.deductions && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            Other Deductions
                          </span>
                          <span className="font-mono font-medium text-red-600">
                            -{formatCurrency(payslipDetails.originalDeductions)}
                          </span>
                        </div>
                      )}

                    <div className="flex items-center justify-between border-t pt-3">
                      <span className="font-semibold">Total Deductions</span>
                      <span className="font-mono text-lg font-bold text-red-600">
                        -{formatCurrency(payslipDetails.deductions)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Percentage of gross pay
                      </span>
                      <span className="font-medium text-red-600">
                        {payslipDetails.grossPay > 0
                          ? (
                              (payslipDetails.deductions /
                                payslipDetails.grossPay) *
                              100
                            ).toFixed(1)
                          : "0.0"}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <TrendingDown className="text-muted-foreground size-4" />
                    Deductions
                  </h3>
                  <div className="border border-green-200 bg-green-50 p-4 text-center">
                    <CheckCircle className="mx-auto mb-2 size-8 text-green-600" />
                    <p className="font-medium text-green-800">
                      No Deductions Applied
                    </p>
                    <p className="text-sm text-green-600">
                      This payslip has no deductions for this period.
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              {/* Net Pay */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Wallet className="text-muted-foreground size-4" />
                  Net Pay
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Take-Home Pay</span>
                    <span className="font-mono text-3xl font-bold text-green-600">
                      {formatCurrency(payslipDetails.netPay)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Percentage of gross pay
                    </span>
                    <span className="font-medium text-green-600">
                      {payslipDetails.grossPay > 0
                        ? (
                            (payslipDetails.netPay / payslipDetails.grossPay) *
                            100
                          ).toFixed(1)
                        : "0.0"}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              {(payslipDetails.datePaid ||
                payslipDetails.cebuanaId ||
                payslipDetails.payrollProcessedDate) && (
                <>
                  <Separator />
                  <div className="space-y-6">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <CreditCard className="text-muted-foreground size-4" />
                      Payment Information
                    </h3>

                    <div className="space-y-3">
                      {payslipDetails.payrollProcessedDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            Payroll Processed
                          </span>
                          <span className="font-medium">
                            {formatNotionDate(
                              payslipDetails.payrollProcessedDate,
                            )}
                          </span>
                        </div>
                      )}

                      {payslipDetails.datePaid && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            Date Paid
                          </span>
                          <span className="font-medium">
                            {formatNotionDate(payslipDetails.datePaid)}
                          </span>
                        </div>
                      )}

                      {payslipDetails.cebuanaId && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            Cebuana Reference
                          </span>
                          <span className="font-mono font-medium">
                            {payslipDetails.cebuanaId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Remarks */}
          {payslipDetails.remarks && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="text-muted-foreground size-4" />
                  <h3 className="font-semibold">Additional Notes</h3>
                </div>
                <div className="border-l-4 border-blue-200 bg-blue-50 p-4">
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                    {payslipDetails.remarks}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Summary Footer */}
          <Separator />
          <div className="bg-muted/30 p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Gross Pay
                </p>
                <p className="font-mono text-sm font-semibold">
                  {formatCurrency(payslipDetails.grossPay)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Deductions
                </p>
                <p className="font-mono text-sm font-semibold text-red-600">
                  -{formatCurrency(payslipDetails.deductions)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Net Pay
                </p>
                <p className="font-mono text-sm font-semibold text-green-600">
                  {formatCurrency(payslipDetails.netPay)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
