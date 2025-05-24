import { useMutation } from "@tanstack/react-query";

import { createHrEmployee } from "@/services/hr/create-hr-service";
("@/services/hr/create-hr-service");

export const useCreateEmployee = () => {
  return useMutation({
    mutationFn: createHrEmployee,
    onSuccess: (data) => {
      console.log("Employee created successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to create employee:", error);
    },
  });
};
