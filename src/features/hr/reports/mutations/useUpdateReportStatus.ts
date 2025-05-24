import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "@/lib/supabase";
import { queryKeys } from "@/lib/configs/query-keys";
import toast from "react-hot-toast";

interface UpdateReportStatusParams {
  reportId: number;
  status: "Resolved" | "Rejected";
  rejectionReason?: string;
}

const updateReportStatus = async ({
  reportId,
  status,
  rejectionReason,
}: UpdateReportStatusParams) => {
  const updateData: { status: string; rejection_reason?: string } = { status };

  if (status === "Rejected" && rejectionReason) {
    updateData.rejection_reason = rejectionReason;
  }

  const { data, error } = await supabase
    .from("reports")
    .update(updateData)
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
