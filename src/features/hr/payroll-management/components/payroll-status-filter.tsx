import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { FacetedFilter } from "@/components/custom/table/faceted-filter";
import type { PayrollStatus } from "../lib/data";

interface PayrollStatusFilterProps {
  selectedStatuses: PayrollStatus[];
  onChange: (statuses: PayrollStatus[]) => void;
}

export const payrollStatusOptions = [
  {
    label: "Processed",
    value: "processed",
    icon: CheckCircle2,
    count: 0, // This will be dynamically updated
  },
  {
    label: "Processing",
    value: "processing",
    icon: Loader2,
    count: 0, // This will be dynamically updated
  },
  {
    label: "Scheduled",
    value: "scheduled",
    icon: Clock,
    count: 0, // This will be dynamically updated
  },
];

export const PayrollStatusFilter = ({
  selectedStatuses,
  onChange,
}: PayrollStatusFilterProps) => {
  return (
    <FacetedFilter
      title="Status"
      options={payrollStatusOptions}
      value={selectedStatuses}
      onChange={onChange as (value: string[]) => void}
    />
  );
};