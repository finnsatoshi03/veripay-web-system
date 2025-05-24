import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createHrEmployee } from "@/services/hr/create-hr-service";
import toast from "react-hot-toast";

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHrEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee created successfully!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
};
