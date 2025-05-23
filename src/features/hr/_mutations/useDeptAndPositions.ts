import { useQuery } from "@tanstack/react-query";
import {
  getDepartments,
  getPositions,
} from "@/services/hr/department-and-positions-service";

export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });
};

export const usePositions = () => {
  return useQuery({
    queryKey: ["positions"],
    queryFn: getPositions,
  });
};
