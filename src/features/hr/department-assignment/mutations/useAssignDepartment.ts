import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "@/lib/supabase";
import toast from "react-hot-toast";

interface AssignDepartmentParams {
  employeeId: number;
  departmentId: number;
  positionId: number;
}

const assignDepartmentAndPosition = async (params: AssignDepartmentParams) => {
  const { data, error } = await supabase
    .from("employees")
    .update({
      department_id: params.departmentId,
      position_id: params.positionId,
    })
    .eq("id", params.employeeId)
    .select();

  if (error) throw error;
  return data;
};

export const useAssignDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignDepartmentAndPosition,
    onSuccess: () => {
      toast.success("Employee successfully assigned to department!");
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
    onError: (error: Error) => {
      toast.error(
        `Failed to assign department: ${error.message || "Unknown error"}`,
      );
    },
  });
};
