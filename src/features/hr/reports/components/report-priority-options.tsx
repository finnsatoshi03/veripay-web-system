import { Flag, Clock, CheckCircle2, BarChart3, CreditCard, TrendingUp, Shield } from "lucide-react";
import { FacetedFilter } from "@/components/custom/table/faceted-filter";
import type { ReportPriority, ReportCategory } from "../lib/data";

// Priority Filter
interface ReportPriorityFilterProps {
  selectedPriorities: ReportPriority[];
  onChange: (priorities: ReportPriority[]) => void;
}

export const reportPriorityOptions = [
  {
    label: "High",
    value: "high",
    icon: Flag,
    count: 0,
  },
  {
    label: "Normal",
    value: "normal",
    icon: Clock,
    count: 0,
  },
  {
    label: "Low",
    value: "low",
    icon: CheckCircle2,
    count: 0,
  },
];

export const ReportPriorityFilter = ({
  selectedPriorities,
  onChange,
}: ReportPriorityFilterProps) => {
  return (
    <FacetedFilter
      title="Priority"
      options={reportPriorityOptions}
      value={selectedPriorities}
      onChange={onChange as (value: string[]) => void}
    />
  );
};

// Category Filter
interface ReportCategoryFilterProps {
  selectedCategories: ReportCategory[];
  onChange: (categories: ReportCategory[]) => void;
}

export const reportCategoryOptions = [
  {
    label: "Attendance",
    value: "Attendance",
    icon: Clock,
    count: 0,
  },
  {
    label: "Payroll",
    value: "Payroll",
    icon: CreditCard,
    count: 0,
  },
  {
    label: "Benefits",
    value: "Benefits",
    icon: Shield,
    count: 0,
  },
  {
    label: "Performance",
    value: "Performance",
    icon: TrendingUp,
    count: 0,
  },
  {
    label: "Compliance",
    value: "Compliance",
    icon: BarChart3,
    count: 0,
  },
];

export const ReportCategoryFilter = ({
  selectedCategories,
  onChange,
}: ReportCategoryFilterProps) => {
  return (
    <FacetedFilter
      title="Category"
      options={reportCategoryOptions}
      value={selectedCategories}
      onChange={onChange as (value: string[]) => void}
    />
  );
};