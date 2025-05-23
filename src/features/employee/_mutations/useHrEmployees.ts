import { useQuery } from "@tanstack/react-query";
import { getHrEmployees } from "@/services/employee/hr-employees";

export const useHrEmployees = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["hrEmployees"],
    queryFn: getHrEmployees,
    enabled: options?.enabled !== false,
  });
};
