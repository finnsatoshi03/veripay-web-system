import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockPayrollPeriods, type PayrollPeriod } from "../lib/data";

type PayrollAction = "process" | "view" | "edit";

interface ProcessPayrollActionParams {
  payrollId: string;
  action: PayrollAction;
}

// Mock hook for fetching payroll periods
export const usePayrollPeriods = () => {
  return useQuery({
    queryKey: ['payroll-periods'],
    queryFn: async (): Promise<PayrollPeriod[]> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockPayrollPeriods;
    },
  });
};

// Mock hook for processing payroll actions
export const useProcessPayrollAction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ payrollId, action }: ProcessPayrollActionParams) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock API call logic here
      const response = await fetch(`/api/payroll/${payrollId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process payroll action');
      }
      
      return response.json();
    },
    onSuccess: (_data, variables) => {
      // Handle different actions
      switch (variables.action) {
        case 'process':
          console.log(`Processing payroll ${variables.payrollId}`);
          break;
        case 'view':
          console.log(`Viewing payroll ${variables.payrollId}`);
          break;
        case 'edit':
          console.log(`Editing payroll ${variables.payrollId}`);
          break;
      }
      
      // Invalidate and refetch payroll data
      queryClient.invalidateQueries({ queryKey: ['payroll-periods'] });
    },
    onError: (error) => {
      console.error('Payroll action failed:', error);
    },
  });
};