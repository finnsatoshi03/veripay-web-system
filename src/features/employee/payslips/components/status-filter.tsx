import { CheckCircle2, FileText, XCircle } from "lucide-react";
import { FacetedFilter } from "@/components/custom/table/faceted-filter";
import type { PayslipStatus } from "../lib/data";

interface StatusFilterProps {
  selectedStatuses: PayslipStatus[];
  onChange: (statuses: PayslipStatus[]) => void;
}

export const statusOptions = [
  {
    label: "Paid",
    value: "Paid",
    icon: CheckCircle2,
    count: 0,
  },
  {
    label: "Generated",
    value: "Generated",
    icon: FileText,
    count: 0,
  },
  {
    label: "Voided",
    value: "Voided",
    icon: XCircle,
    count: 0,
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