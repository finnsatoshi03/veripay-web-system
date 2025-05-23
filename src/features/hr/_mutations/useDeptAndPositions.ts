import { useQuery } from "@tanstack/react-query";
import {
  getDepartments,
  getPositions,
} from "@/services/hr/department-and-positions-service";
import { queryKeys } from "@/lib/configs/query-keys";

export const useDepartments = () => {
  return useQuery({
    queryKey: [queryKeys.EMPLOYEES.departments],
    queryFn: getDepartments,
  });
};

export const usePositions = () => {
  return useQuery({
    queryKey: [queryKeys.EMPLOYEES.positions],
    queryFn: getPositions,
  });
};
