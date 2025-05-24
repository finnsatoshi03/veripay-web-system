import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { format } from "date-fns";

import {
  createLeaveRequest,
  type CreateLeaveRequestData,
  type LeaveRequest,
} from "@/services/employee/leave-service";
import { queryKeys } from "@/lib/configs/query-keys";
import { useUser } from "@/store/userStore";

export interface CreateLeaveRequestFormData {
  leave_type: "Vacation" | "Sick" | "Emergency" | "Bereavement" | "Annual";
  start_date: Date;
  end_date: Date;
  reason: string;
}

// mapping between form leave types and database leave type IDs
const LEAVE_TYPE_MAP: Record<string, number> = {
  Vacation: 1,
  Sick: 2,
  Emergency: 3,
  Bereavement: 4,
  "Vacation Leave": 1,
  "Sick Leave": 2,
  "Emergency Leave": 3,
  "Bereavement Leave": 4,
};

export const useCreateLeaveRequest = () => {
  const queryClient = useQueryClient();
  const { employee } = useUser();

  return useMutation({
    mutationFn: async (
      formData: CreateLeaveRequestFormData,
    ): Promise<LeaveRequest> => {
      if (!employee?.id) {
        throw new Error("Employee ID is required");
      }

      const leaveTypeId = LEAVE_TYPE_MAP[formData.leave_type];
      if (!leaveTypeId) {
        throw new Error(`Invalid leave type: ${formData.leave_type}`);
      }

      const createData: CreateLeaveRequestData = {
        employee_id: employee.id,
        leave_type_id: leaveTypeId,
        start_date: format(formData.start_date, "yyyy-MM-dd"),
        end_date: format(formData.end_date, "yyyy-MM-dd"),
        reason: formData.reason,
      };

      return createLeaveRequest(createData);
    },

    onSuccess: () => {
      // invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: [queryKeys.OVERVIEW.leaveOverview],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.HR.leaveRequests],
      });

      toast.success("Leave request submitted successfully");
    },

    onError: (error) => {
      console.error("Error creating leave request:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit leave request",
      );
    },
  });
};
