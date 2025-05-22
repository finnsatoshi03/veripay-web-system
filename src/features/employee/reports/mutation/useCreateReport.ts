import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReport } from "@/services/employee/reports-service";

type CreateReportParams = {
  category: "Attendance" | "Payroll";
  status: "In Progress" | "To Review" | "Resolved" | "Rejected";
  title: string;
  assigned_to: number | null;
  submitted_by: number;
  submitted_at: string;
  description: string;
  flag_level: "Low" | "Normal" | "High";
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReportParams) => createReport(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["reports", data.submitted_by],
      });
    },
  });
};
