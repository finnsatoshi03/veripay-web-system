import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "@/lib/supabase";
import { queryKeys } from "@/lib/configs/query-keys";
import toast from "react-hot-toast";

interface UpdateReportStatusParams {
  reportId: number;
  status: "Resolved" | "Rejected";
}

const updateReportStatus = async ({
  reportId,
  status,
}: UpdateReportStatusParams) => {
  const { data, error } = await supabase
    .from("reports")
    .update({ status })
    .eq("id", reportId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReportStatus,
    onSuccess: () => {
      toast.success("Report status updated successfully");
      queryClient.invalidateQueries({
        queryKey: [queryKeys.REPORTS, "allReports"],
      });
    },
  });
};
