import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Define types for our data
type EmployeeCategory = {
  id: string;
  label: string;
  count: number;
  change: string;
  color: string;
};

type EmployeeSummaryData = {
  totalCount: number;
  percentageChange: string;
  categories: EmployeeCategory[];
};

// Mock data
const mockEmployeeData: EmployeeSummaryData = {
  totalCount: 215,
  percentageChange: "+6.9%",
  categories: [
    {
      id: "male",
      label: "Male",
      count: 100,
      change: "+10%",
      color: "bg-primary",
    },
    {
      id: "female",
      label: "Female",
      count: 100,
      change: "+10%",
      color: "bg-secondary",
    },
    {
      id: "pending",
      label: "Pending",
      count: 15,
      change: "+10%",
      color: "bg-border/80",
    },
  ],
};

// Header component
const SummaryHeader = () => (
  <>
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Employee Summary</h2>
      <Link to="/hr/active-employees">
        <Button variant="outline" size="sm">
          Manage Employees
        </Button>
      </Link>
    </div>
  </>
);

// Total count component
const TotalEmployeeCount = ({
  count,
  change,
}: {
  count: number;
  change: string;
}) => (
  <div className="space-y-1">
    <div className="flex items-end gap-1">
      <h3 className="text-3xl leading-none font-semibold">{count}</h3>
      <Badge className="h-fit bg-green-200 py-0 text-green-700">{change}</Badge>
      <p className="text-muted-foreground text-sm">vs. last month</p>
    </div>
    <p className="text-muted-foreground text-sm">
      Total employees in the company
    </p>
  </div>
);

// Category visualization component
const CategoryVisualizer = ({
  categories,
}: {
  categories: EmployeeCategory[];
}) => (
  <div className="flex items-center gap-1">
    {categories.map((category) => (
      <div key={category.id} className="flex w-full flex-col gap-1">
        <div className={`${category.color} h-6 w-full rounded`} />
        <p className="text-muted-foreground flex items-center gap-1 text-sm">
          <span className={`${category.color} size-3 rounded`} />{" "}
          {category.label}
        </p>
      </div>
    ))}
  </div>
);

// Category breakdown table component
const CategoryBreakdown = ({
  categories,
}: {
  categories: EmployeeCategory[];
}) => (
  <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 text-sm">
    <h3 className="text-muted-foreground mb-1 font-medium">Category</h3>
    <h3 className="text-muted-foreground mb-1 font-medium">Headcount</h3>
    <h3 className="text-muted-foreground mb-1 font-medium">Change</h3>

    {categories.map((category) => (
      <>
        <p key={`${category.id}-label`} className="flex items-center gap-1">
          <span className={`${category.color} size-3 rounded`} />{" "}
          {category.label}
        </p>
        <p key={`${category.id}-count`}>{category.count}</p>
        <p key={`${category.id}-change`}>{category.change}</p>
      </>
    ))}
  </div>
);

// Main component
export const EmployeeSummary = () => {
  const data = mockEmployeeData;

  return (
    <div className="w-full space-y-2 rounded-lg border p-2">
      <SummaryHeader />
      <div className="bg-border -mx-2 h-px px-2" />
      <div className="space-y-3">
        <TotalEmployeeCount
          count={data.totalCount}
          change={data.percentageChange}
        />
        <CategoryVisualizer categories={data.categories} />
        <div className="bg-border -mx-2 h-px px-2" />
        <CategoryBreakdown categories={data.categories} />
      </div>
    </div>
  );
};
