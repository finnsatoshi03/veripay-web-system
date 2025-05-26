import { CheckCircle2, Clock, UserX, UserMinus } from "lucide-react";
import { FacetedFilter } from "@/components/custom/table/faceted-filter";
import type { EmployeeStatus } from "../lib/helpers";

interface StatusFilterProps {
  selectedStatuses: EmployeeStatus[];
  onChange: (statuses: EmployeeStatus[]) => void;
}

export const statusOptions = [
  {
    label: "On time",
    value: "On time",
    icon: CheckCircle2,
    count: 0, // This will be dynamically updated
  },
  {
    label: "Late",
    value: "Late",
    icon: Clock,
    count: 0, // This will be dynamically updated
  },
  {
    label: "On leave",
    value: "On leave",
    icon: UserX,
    count: 0, // This will be dynamically updated
  },
  {
    label: "Absent",
    value: "Absent",
    icon: UserMinus,
    count: 0, // This will be dynamically updated
  },
];

export const StatusFilter = ({
  selectedStatuses,
  onChange,
}: StatusFilterProps) => {
  return (
    <FacetedFilter
      title="Status"
      options={statusOptions}
      value={selectedStatuses}
      onChange={onChange as (value: string[]) => void}
    />
  );
};
