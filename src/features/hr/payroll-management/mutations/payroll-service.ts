import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPayrollSummary, markPaidPayslips } from "@/services/hr/payroll";

// Types for payroll data
export interface PayrollSummaryData {
  success: boolean;
  data: PayrollPeriod[];
  lastPayrollDate: string | null;
  nextPayrollDate: string;
  late_submissions: number;
}

export interface PayrollPeriod {
  id: number;
  period_start: string;
  period_end: string;
  date_processed: string | null;
  created_at: string;
  period_formatted: string;
  date_processed_formatted: string | null;
  total_gross_pay?: number;
  total_deductions?: number;
  total_net_pay?: number;
  status: string;
  total_employees?: number;
  notes?: string;
  created_by?: number;
  payslips: PayslipData[];
}

export interface PayslipData {
  id: number;
  employee_id: number;
  basic_pay: number;
  gross_pay: number;
  net_pay: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  status: string;
  date_paid: string | null;
  cebuana_id: string | null;
  overtime_pay: number;
  remarks: string | null;
  issued_at: string;
  payroll_id: number;
  mandatory_deductions: DeductionData[];
  total_mandatory_deductions: number;
}

export interface DeductionData {
  name: string;
  amount: number;
  displayValue: string;
}

export interface MarkPaidPayslipsParams {
  payrollId: number;
  cebuanaMap: Record<string, unknown>;
}

// Query Keys
export const payrollKeys = {
  all: ["payroll"] as const,
  summary: () => [...payrollKeys.all, "summary"] as const,
  periods: () => [...payrollKeys.all, "periods"] as const,
};

// Hook for fetching payroll summary
export const usePayrollSummary = () => {
  return useQuery({
    queryKey: payrollKeys.summary(),
    queryFn: async (): Promise<PayrollSummaryData> => {
      const result = await getPayrollSummary();

      if (!result.success) {
        const errorMessage =
          typeof result.error === "object" &&
          result.error &&
          "message" in result.error
            ? (result.error as { message: string }).message
            : "Failed to fetch payroll summary";
        throw new Error(errorMessage);
      }

      return result as PayrollSummaryData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for marking payslips as paid
export const useMarkPaidPayslips = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payrollId, cebuanaMap }: MarkPaidPayslipsParams) => {
      return await markPaidPayslips(payrollId, cebuanaMap);
    },
    onSuccess: () => {
      // Invalidate and refetch payroll data
      queryClient.invalidateQueries({ queryKey: payrollKeys.summary() });
      queryClient.invalidateQueries({ queryKey: payrollKeys.periods() });
    },
    onError: (error) => {
      console.error("Failed to mark payslips as paid:", error);
    },
  });
};

// Hook for processing payroll actions (legacy support)
export const useProcessPayrollAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payrollId,
      action,
    }: {
      payrollId: string;
      action: string;
    }) => {
      // This can be extended based on specific action requirements
      console.log(`Processing ${action} for payroll ${payrollId}`);

      // For now, just simulate the action
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return { success: true, payrollId, action };
    },
    onSuccess: (_data, variables) => {
      console.log(
        `Successfully processed ${variables.action} for payroll ${variables.payrollId}`,
      );

      // Invalidate and refetch payroll data
      queryClient.invalidateQueries({ queryKey: payrollKeys.all });
    },
    onError: (error) => {
      console.error("Payroll action failed:", error);
    },
  });
};

// Alias for backward compatibility
export const usePayrollPeriods = usePayrollSummary;
