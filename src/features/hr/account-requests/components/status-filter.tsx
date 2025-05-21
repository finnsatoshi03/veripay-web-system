import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { FacetedFilter } from "@/components/custom/table/faceted-filter";
import type { RequestStatus } from "../lib/data";

interface StatusFilterProps {
  selectedStatuses: RequestStatus[];
  onChange: (statuses: RequestStatus[]) => void;
}

export const statusOptions = [
  {
    label: "Pending",
    value: "pending",
    icon: Clock,
    count: 0, // This will be dynamically updated
  },
  {
    label: "Approved",
    value: "approved",
    icon: CheckCircle2,
    count: 0, // This will be dynamically updated
  },
  {
    label: "Rejected",
    value: "rejected",
    icon: XCircle,
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
