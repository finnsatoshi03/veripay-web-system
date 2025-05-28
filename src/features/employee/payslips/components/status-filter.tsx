import { FacetedFilter } from "@/components/custom/table/faceted-filter";

interface StatusFilterProps {
  selectedStatuses: string[];
  onChange: (statuses: string[]) => void;
}

export const statusOptions = [
  { label: "Paid", value: "paid", count: 0 },
  { label: "Generated", value: "generated", count: 0 },
  { label: "Draft", value: "draft", count: 0 },
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
      onChange={onChange}
    />
  );
};
