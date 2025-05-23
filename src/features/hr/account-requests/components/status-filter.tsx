import { CheckCircle2, Clock, XCircle, type LucideIcon } from "lucide-react";
import { FacetedFilter } from "@/components/custom/table/faceted-filter";
import type { RequestStatus } from "../lib/data";

interface StatusOption {
  label: string;
  value: string;
  icon: LucideIcon;
  count: number;
}

interface StatusFilterProps {
  selectedStatuses: RequestStatus[];
  onChange: (statuses: RequestStatus[]) => void;
  statusOptions?: StatusOption[];
}

export const defaultStatusOptions = [
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

// Keep the original export for backward compatibility
export const statusOptions = defaultStatusOptions;

export const StatusFilter = ({
  selectedStatuses,
  onChange,
  statusOptions = defaultStatusOptions,
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
