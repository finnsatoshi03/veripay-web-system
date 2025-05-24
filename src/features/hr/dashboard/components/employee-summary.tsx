import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useEmployeeSummary } from "../mutations/useEmployeeSummary";
import Error from "@/features/error/Error";

// Define types for our data
type EmployeeCategory = {
  id: string;
  label: string;
  count: number;
  change: string;
  color: string;
  percentage: number;
};

type EmployeeSummaryData = {
  totalCount: number;
  percentageChange: string;
  categories: EmployeeCategory[];
};

// Header component
const SummaryHeader = () => (
  <>
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Employee Summary</h2>
      <Link to="/hr/account-requests">
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
      <Badge
        className={`h-fit py-0 ${
          change.startsWith("+")
            ? "bg-green-200 text-green-700"
            : change.startsWith("-")
              ? "bg-red-200 text-red-700"
              : "bg-gray-200 text-gray-700"
        }`}
      >
        {change}
      </Badge>
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
}) => {
  const totalCount = categories.reduce(
    (sum, category) => sum + category.count,
    0,
  );

  return (
    <div className="flex items-center gap-1">
      {categories.map((category) => {
        const widthPercentage =
          totalCount > 0
            ? Math.max((category.count / totalCount) * 100, 10)
            : 33.33;

        return (
          <div
            key={category.id}
            className="flex flex-col gap-1"
            style={{ width: `${widthPercentage}%` }}
          >
            <div className={`${category.color} h-6 w-full rounded`} />
            <p className="text-muted-foreground flex items-center gap-1 text-sm">
              <span
                className={`${category.color} size-3 flex-shrink-0 rounded`}
              />
              <span className="truncate">{category.label}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
};

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
        <p
          key={`${category.id}-change`}
          className={
            category.change.startsWith("+")
              ? "text-green-600"
              : category.change.startsWith("-")
                ? "text-red-600"
                : "text-gray-600"
          }
        >
          {category.change}
        </p>
      </>
    ))}
  </div>
);

// Skeleton component for loading state
const EmployeeSummarySkeleton = () => (
  <div className="w-full space-y-2 rounded-lg border p-2">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-32" />
    </div>
    <div className="bg-border -mx-2 h-px px-2" />
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex items-end gap-1">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-1"
            style={{ width: i === 1 ? "45%" : i === 2 ? "35%" : "20%" }}
          >
            <Skeleton className="h-6 w-full rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
      <div className="bg-border -mx-2 h-px px-2" />
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-x-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

import { getPayslips } from "@/services/employee/payslips";
import { useEffect } from "react";
// Main component
export const EmployeeSummary = () => {
  const { data, isLoading, error } = useEmployeeSummary();
  useEffect(() => {
    const fetchData = async () => {
      const page = 1;
      const limit = 10;
      const startDate = '2025-01-01'; // optional, can leave undefined
      const endDate = '2025-12-31';   // optional, can leave undefined
      const employeeId = 4
      const result = await getPayslips({ employeeId, page, limit, startDate, endDate });


      console.log(result);
      
    };

    fetchData();
  }, []);
  if (isLoading) {
    return <EmployeeSummarySkeleton />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load employee summary"
        message="We couldn't fetch the employee summary data. Please try again."
        action={{
          label: "Retry",
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  if (!data) {
    return (
      <Error
        title="No data available"
        message="No employee summary data is currently available."
      />
    );
  }

  // Transform API data to component format
  const transformedData: EmployeeSummaryData = {
    totalCount: data.totalEmployees,
    percentageChange: data.monthlyComparison.totalChangePercentage,
    categories: [
      {
        id: "male",
        label: "Male",
        count: data.maleEmployees,
        change: data.monthlyComparison.maleChangePercentage,
        color: "bg-primary",
        percentage:
          data.totalEmployees > 0
            ? (data.maleEmployees / data.totalEmployees) * 100
            : 0,
      },
      {
        id: "female",
        label: "Female",
        count: data.femaleEmployees,
        change: data.monthlyComparison.femaleChangePercentage,
        color: "bg-secondary",
        percentage:
          data.totalEmployees > 0
            ? (data.femaleEmployees / data.totalEmployees) * 100
            : 0,
      },
      {
        id: "pending",
        label: "Pending",
        count: data.pendingRequests,
        change: data.monthlyComparison.pendingChangePercentage,
        color: "bg-border/80",
        percentage:
          data.totalEmployees > 0
            ? (data.pendingRequests / data.totalEmployees) * 100
            : 0,
      },
    ],
  };

  return (
    <div className="w-full space-y-2 rounded-lg border p-2">
      <SummaryHeader />
      <div className="bg-border -mx-2 h-px px-2" />
      <div className="space-y-3">
        <TotalEmployeeCount
          count={transformedData.totalCount}
          change={transformedData.percentageChange}
        />
        <CategoryVisualizer categories={transformedData.categories} />
        <div className="bg-border -mx-2 h-px px-2" />
        <CategoryBreakdown categories={transformedData.categories} />
      </div>
    </div>
  );
};
