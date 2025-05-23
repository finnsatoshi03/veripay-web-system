import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/services/hr/department-and-positions-service";

export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
