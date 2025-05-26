import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAttendanceSummary } from "../mutations/useAttendanceSummary";
import Error from "@/features/error/Error";
import { formatTime } from "@/lib/helpers/formatters";

// Define types for our data
type TodayAttendance = {
  id: string;
  status: "present" | "absent" | "late" | "leave";
  count: number;
  percentage: number;
  color: string;
};

type EmployeeAttendance = {
  id: string;
  name: string;
  position: string;
  avatar?: string;
  time: string;
  status: "present" | "absent" | "leave" | "late";
};

// Header component
const SummaryHeader = () => (
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold">Attendance Overview</h2>
    <Link to="/hr/active-employee">
      <Button variant="outline" size="sm">
        View Logs
      </Button>
    </Link>
  </div>
);

// Overall attendance stats
const AttendanceSummary = ({
  total,
  percentage,
  change,
}: {
  total: number;
  percentage: number;
  change: string;
}) => (
  <div className="flex justify-between">
    <div className="space-y-1">
      <h3 className="text-3xl leading-none font-semibold">{total}</h3>
      <p className="text-muted-foreground text-sm">Total active employees</p>
    </div>
    <div className="space-y-1 text-right">
      <div className="flex items-center justify-end gap-1">
        <h3 className="text-3xl leading-none font-semibold">{percentage}%</h3>
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
      </div>
      <p className="text-muted-foreground text-sm">Present today</p>
    </div>
  </div>
);

// Today's attendance visualization
const AttendanceVisualizer = ({
  todayStats,
}: {
  todayStats: TodayAttendance[];
}) => (
  <div className="space-y-3">
    <h3 className="text-sm font-medium">Today's Attendance</h3>

    <div className="flex h-3 w-full overflow-hidden rounded">
      {todayStats.map((stat) => (
        <div
          key={stat.id}
          className={`${stat.color}`}
          style={{ width: `${stat.percentage}%` }}
        />
      ))}
    </div>

    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {todayStats.map((stat) => (
        <div
          key={stat.id}
          className="flex flex-col items-center rounded-lg border p-2"
        >
          <div className="flex items-center gap-1.5">
            <span className={`${stat.color} size-3 rounded-full`} />
            <span className="text-sm font-medium capitalize">
              {stat.status}
            </span>
          </div>
          <p className="text-2xl font-semibold">{stat.count}</p>
          <p className="text-muted-foreground text-sm">{stat.percentage}%</p>
        </div>
      ))}
    </div>
  </div>
);

// Employee List Section
const EmployeeList = ({
  title,
  employees,
  badgeColor,
}: {
  title: string;
  employees: EmployeeAttendance[];
  badgeColor: string;
}) => (
  <div className="space-y-2">
    <h2 className="text-muted-foreground text-xs font-semibold uppercase">
      {title}
    </h2>
    {employees.length > 0 ? (
      employees.slice(0, 5).map((employee) => (
        <div key={employee.id} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={employee.avatar} />
              <AvatarFallback>
                {employee.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="leading-none font-medium">{employee.name}</p>
              <p className="text-muted-foreground text-sm leading-none">
                {employee.position}
              </p>
            </div>
          </div>
          <Badge className={`h-fit ${badgeColor}`}>
            {employee.time === "Not Reported" || employee.time === "On Leave"
              ? employee.time
              : formatTime(employee.time)}
          </Badge>
        </div>
      ))
    ) : (
      <p className="text-muted-foreground py-2 text-center text-sm">
        No employees in this category
      </p>
    )}
    {employees.length > 5 && (
      <p className="text-muted-foreground text-center text-xs">
        +{employees.length - 5} more employees
      </p>
    )}
  </div>
);

// Skeleton component for loading state
const AttendanceOverviewSkeleton = () => (
  <div className="w-full space-y-2 rounded-lg border p-2">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-8 w-20" />
    </div>
    <div className="bg-border -mx-2 h-px px-2" />

    {/* Summary skeleton */}
    <div className="flex justify-between">
      <div className="space-y-1">
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="space-y-1 text-right">
        <div className="flex items-center justify-end gap-1">
          <Skeleton className="h-9 w-12" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
    </div>

    {/* Visualizer skeleton */}
    <div className="space-y-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-full rounded" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center space-y-1 rounded-lg border p-2"
          >
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-7 w-8" />
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>
    </div>

    <div className="bg-border -mx-2 h-px px-2" />

    {/* Employee lists skeleton */}
    <div className="space-y-4">
      {[1, 2, 3].map((section) => (
        <div key={section} className="space-y-2">
          <Skeleton className="h-4 w-16" />
          {[1, 2].map((emp) => (
            <div key={emp} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="size-8 rounded-md" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Main component
export const AttendanceOverview = () => {
  const { data, isLoading, error } = useAttendanceSummary();

  if (isLoading) {
    return <AttendanceOverviewSkeleton />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load attendance data"
        message="We couldn't fetch the attendance information. Please try again."
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
        title="No attendance data available"
        message="No attendance information is currently available."
      />
    );
  }

  return (
    <div className="w-full space-y-2 rounded-lg border p-2">
      <SummaryHeader />
      <div className="bg-border -mx-2 h-px px-2" />

      {/* Summary Section */}
      <div className="space-y-4">
        <AttendanceSummary
          total={data.totalEmployees}
          percentage={data.presentPercentage}
          change={data.monthlyComparison.presentChangePercentage}
        />
        <AttendanceVisualizer todayStats={data.todayAttendance} />
      </div>

      <div className="bg-border -mx-2 h-px px-2" />

      {/* Employee List Section */}
      <div className="space-y-4">
        <EmployeeList
          title="Present"
          employees={data.employeeDetails.present}
          badgeColor="bg-green-200 py-0 text-green-700"
        />

        <EmployeeList
          title="Late"
          employees={data.employeeDetails.late}
          badgeColor="bg-yellow-200 py-0 text-yellow-700"
        />

        <EmployeeList
          title="Absent"
          employees={data.employeeDetails.absent}
          badgeColor="bg-red-200 py-0 text-red-700"
        />

        <EmployeeList
          title="On Leave"
          employees={data.employeeDetails.leave}
          badgeColor="bg-blue-200 py-0 text-blue-700"
        />
      </div>
    </div>
  );
};
