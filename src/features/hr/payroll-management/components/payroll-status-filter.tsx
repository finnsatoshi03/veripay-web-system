import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { FacetedFilter } from "@/components/custom/table/faceted-filter";
import type { PayrollStatus } from "../lib/data";
import { useMemo } from "react";

interface PayrollStatusFilterProps {
  selectedStatuses: PayrollStatus[];
  onChange: (statuses: PayrollStatus[]) => void;
  statusCounts: Record<PayrollStatus, number>;
}

const basePayrollStatusOptions = [
  {
    label: "Processed",
    value: "processed",
    icon: CheckCircle2,
  },
  {
    label: "Processing",
    value: "processing",
    icon: Loader2,
  },
  {
    label: "Scheduled",
    value: "scheduled",
    icon: Clock,
  },
];

export const PayrollStatusFilter = ({
  selectedStatuses,
  onChange,
  statusCounts,
}: PayrollStatusFilterProps) => {
  // Create options with counts using useMemo for performance
  const payrollStatusOptions = useMemo(() => {
    return basePayrollStatusOptions.map((option) => ({
      ...option,
      count: statusCounts[option.value as PayrollStatus] || 0,
    }));
  }, [statusCounts]);

  return (
    <FacetedFilter
      title="Status"
      options={payrollStatusOptions}
      value={selectedStatuses}
      onChange={onChange as (value: string[]) => void}
    />
  );
};
