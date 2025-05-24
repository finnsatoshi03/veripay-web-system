import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/services/hr/department-and-positions-service";
import { queryKeys } from "@/lib/configs/query-keys";

export const useEmployees = () => {
  return useQuery({
    queryKey: [queryKeys.EMPLOYEES.employees],
    queryFn: getEmployees,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
