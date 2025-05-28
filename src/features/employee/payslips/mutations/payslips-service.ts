import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getPayslips,
  getPayslipById,
  getPayslipSummary,
  getDetailedPayslipById,
  type PayslipQueryParams,
} from "@/services/employee/payslips";
import { queryKeys } from "@/lib/configs/query-keys";

// Hook to get paginated payslips
export const usePayslips = (params: PayslipQueryParams = {}) => {
  return useQuery({
    queryKey: [queryKeys.PAYSLIPS.list, params],
    queryFn: () => getPayslips(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!params.employeeId || !!params.payrollId, // Only fetch if we have an employee or payroll ID
  });
};

// Hook to get infinite payslips (for pagination)
export const useInfinitePayslips = (
  params: Omit<PayslipQueryParams, "page"> = {},
) => {
  return useInfiniteQuery({
    queryKey: [queryKeys.PAYSLIPS.infinite, params],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getPayslips({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: { page: number; totalPages: number }) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!params.employeeId || !!params.payrollId,
  });
};

// Hook to get a single payslip by ID
export const usePayslip = (payslipId: number | null) => {
  return useQuery({
    queryKey: [queryKeys.PAYSLIPS.detail, payslipId],
    queryFn: () => getPayslipById(payslipId!),
    enabled: !!payslipId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook to get payslip summary for an employee
export const usePayslipSummary = (employeeId: number | null) => {
  return useQuery({
    queryKey: [queryKeys.PAYSLIPS.summary, employeeId],
    queryFn: () => getPayslipSummary(employeeId!),
    enabled: !!employeeId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to get all payslips for HR view (no employee filter)
export const useAllPayslips = (
  params: Omit<PayslipQueryParams, "employeeId"> = {},
) => {
  return useQuery({
    queryKey: [queryKeys.PAYSLIPS.all, params],
    queryFn: () => getPayslips(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to get detailed payslip by ID with deductions and benefits
export const useDetailedPayslip = (payslipId: number | null) => {
  return useQuery({
    queryKey: [queryKeys.PAYSLIPS.detail, "detailed", payslipId],
    queryFn: () => getDetailedPayslipById(payslipId!),
    enabled: !!payslipId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
