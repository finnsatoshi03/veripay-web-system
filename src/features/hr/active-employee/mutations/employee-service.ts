import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockActiveEmployees, type ActiveEmployee } from "../lib/data";

type EmployeeAction = "attach" | "view";

interface ProcessEmployeeActionParams {
  employeeId: string;
  action: EmployeeAction;
}

// Hook for fetching active employees
export const useActiveEmployees = () => {
  return useQuery({
    queryKey: ['active-employees'],
    queryFn: async (): Promise<ActiveEmployee[]> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockActiveEmployees;
    },
  });
};

// Hook for processing employee actions
export const useProcessEmployeeAction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ employeeId, action }: ProcessEmployeeActionParams) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock API call logic here
      const response = await fetch(`/api/employees/${employeeId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process employee action');
      }
      
      return response.json();
    },
    onSuccess: (_data, variables) => {
      // Handle different actions
      switch (variables.action) {
        case 'attach':
          console.log(`Attaching document for employee ${variables.employeeId}`);
          break;
        case 'view':
          console.log(`Viewing employee ${variables.employeeId}`);
          break;
      }
      
      // Invalidate and refetch employee data
      queryClient.invalidateQueries({ queryKey: ['active-employees'] });
    },
    onError: (error) => {
      console.error('Employee action failed:', error);
    },
  });
};