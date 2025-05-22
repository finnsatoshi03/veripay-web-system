import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockHrReports, type HrReport, type ReportStatus } from "../lib/data";

type ReportAction = "assign" | "view" | "edit" | "complete" | "delete";

interface ProcessReportActionParams {
  reportId: string;
  action: ReportAction;
  assignee?: string;
  status?: ReportStatus;
}

// Hook for fetching HR reports
export const useHrReports = () => {
  return useQuery({
    queryKey: ['hr-reports'],
    queryFn: async (): Promise<HrReport[]> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockHrReports;
    },
  });
};

// Hook for processing report actions
export const useProcessReportAction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reportId, action, assignee, status }: ProcessReportActionParams) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock API call logic here
      const response = await fetch(`/api/reports/${reportId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, assignee, status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process report action');
      }
      
      return response.json();
    },
    onSuccess: (_data, variables) => {
      // Handle different actions
      switch (variables.action) {
        case 'assign':
          console.log(`Assigning report ${variables.reportId} to ${variables.assignee}`);
          break;
        case 'view':
          console.log(`Viewing report ${variables.reportId}`);
          break;
        case 'edit':
          console.log(`Editing report ${variables.reportId}`);
          break;
        case 'complete':
          console.log(`Completing report ${variables.reportId}`);
          break;
        case 'delete':
          console.log(`Deleting report ${variables.reportId}`);
          break;
      }
      
      // Invalidate and refetch reports data
      queryClient.invalidateQueries({ queryKey: ['hr-reports'] });
    },
    onError: (error) => {
      console.error('Report action failed:', error);
    },
  });
};