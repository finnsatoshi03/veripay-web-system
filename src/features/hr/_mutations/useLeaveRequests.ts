import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLeaveRequests } from "@/services/hr/leave-service";
import { queryKeys } from "@/lib/configs/query-keys";
import { supabase } from "@/services/supabase";
import toast from "react-hot-toast";

export const useLeaveRequests = () => {
  return useQuery({
    queryKey: [queryKeys.HR.leaveRequests],
    queryFn: getLeaveRequests,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateLeaveStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      rejectionReason,
      reviewedBy,
    }: {
      id: number;
      status: "approved" | "rejected";
      rejectionReason?: string;
      reviewedBy: number;
    }) => {
      const updateData: {
        status: string;
        reviewed_by: number;
        rejection_reason?: string;
      } = {
        status,
        reviewed_by: reviewedBy,
      };

      if (status === "rejected" && rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      const { data, error } = await supabase
        .from("leave_requests")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Leave request updated successfully");
      queryClient.invalidateQueries({
        queryKey: [queryKeys.HR.leaveRequests],
      });
    },
    onError: () => {
      toast.error("Failed to update leave request");
    },
  });
};
