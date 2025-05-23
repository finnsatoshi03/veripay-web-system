import { useQuery } from "@tanstack/react-query";
import { getHrEmployees } from "@/services/employee/hr-employees";
import { queryKeys } from "@/lib/configs/query-keys";

export const useHrEmployees = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [queryKeys.HR.hrEmployees],
    queryFn: getHrEmployees,
    enabled: options?.enabled !== false,
  });
};
