import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "@/lib/supabase";
import { queryKeys } from "@/lib/configs/query-keys";
import toast from "react-hot-toast";

interface AssignReportParams {
  reportId: number;
  assignedToId: number;
  status: "In Progress";
}

const assignReport = async ({
  reportId,
  assignedToId,
  status,
}: AssignReportParams) => {
  const { data, error } = await supabase
    .from("reports")
    .update({
      assigned_to: assignedToId,
      status,
    })
    .eq("id", reportId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const useAssignReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignReport,
    onSuccess: () => {
      toast.success("Report assigned successfully");
      queryClient.invalidateQueries({
        queryKey: [queryKeys.REPORTS, "allReports"],
      });
    },
  });
};
