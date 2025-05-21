import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define types for our data
type AttendanceStats = {
  id: string;
  label: string;
  count: number;
  change: string;
  color: string;
};

type AttendanceData = {
  totalAttendance: number;
  percentagePresent: number;
  stats: AttendanceStats[];
  todayAttendance: TodayAttendance[];
};

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
  avatar: string;
  time: string;
  status: "present" | "absent" | "leave";
};

// Mock data
const mockAttendanceData: AttendanceData = {
  totalAttendance: 198,
  percentagePresent: 92,
  stats: [
    {
      id: "present",
      label: "Present",
      count: 180,
      change: "+2%",
      color: "bg-green-500",
    },
    {
      id: "absent",
      label: "Absent",
      count: 5,
      change: "-1%",
      color: "bg-red-500",
    },
    {
      id: "late",
      label: "Late",
      count: 8,
      change: "+1%",
      color: "bg-yellow-500",
    },
    {
      id: "leave",
      label: "On Leave",
      count: 5,
      change: "0%",
      color: "bg-blue-500",
    },
  ],
  todayAttendance: [
    {
      id: "present",
      status: "present",
      count: 180,
      percentage: 92,
      color: "bg-green-500",
    },
    {
      id: "absent",
      status: "absent",
      count: 5,
      percentage: 2,
      color: "bg-red-500",
    },
    {
      id: "late",
      status: "late",
      count: 8,
      percentage: 4,
      color: "bg-yellow-500",
    },
    {
      id: "leave",
      status: "leave",
      count: 5,
      percentage: 2,
      color: "bg-blue-500",
    },
  ],
};

const mockEmployees: Record<string, EmployeeAttendance[]> = {
  present: [
    {
      id: "1",
      name: "John Doe",
      position: "Frontend Developer",
      avatar: "https://github.com/shadcn.png",
      time: "7:08 AM",
      status: "present",
    },
    {
      id: "2",
      name: "Jane Smith",
      position: "UI/UX Designer",
      avatar: "https://github.com/shadcn.png",
      time: "7:15 AM",
      status: "present",
    },
    {
      id: "3",
      name: "Mike Johnson",
      position: "Backend Developer",
      avatar: "https://github.com/shadcn.png",
      time: "7:22 AM",
      status: "present",
    },
  ],
  absent: [
    {
      id: "4",
      name: "Sarah Williams",
      position: "Project Manager",
      avatar: "https://github.com/shadcn.png",
      time: "Not Reported",
      status: "absent",
    },
    {
      id: "5",
      name: "Alex Brown",
      position: "QA Engineer",
      avatar: "https://github.com/shadcn.png",
      time: "Not Reported",
      status: "absent",
    },
  ],
  leave: [
    {
      id: "6",
      name: "Emily Davis",
      position: "HR Specialist",
      avatar: "https://github.com/shadcn.png",
      time: "Vacation leave",
      status: "leave",
    },
  ],
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
}: {
  total: number;
  percentage: number;
}) => (
  <div className="flex justify-between">
    <div className="space-y-1">
      <h3 className="text-3xl leading-none font-semibold">{total}</h3>
      <p className="text-muted-foreground text-sm">Total active employees</p>
    </div>
    <div className="space-y-1 text-right">
      <div className="flex items-center justify-end gap-1">
        <h3 className="text-3xl leading-none font-semibold">{percentage}%</h3>
        <Badge className="h-fit bg-green-200 py-0 text-green-700">+2.5%</Badge>
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
    {employees.map((employee) => (
      <div key={employee.id} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-8 rounded-md">
            <AvatarImage src={employee.avatar} />
            <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="leading-none font-medium">{employee.name}</p>
            <p className="text-muted-foreground text-sm leading-none">
              {employee.position}
            </p>
          </div>
        </div>
        <Badge className={`h-fit ${badgeColor}`}>{employee.time}</Badge>
      </div>
    ))}
  </div>
);

// Main component
export const AttendanceOverview = () => {
  const data = mockAttendanceData;
  const employees = mockEmployees;

  return (
    <div className="w-full space-y-2 rounded-lg border p-2">
      <SummaryHeader />
      <div className="bg-border -mx-2 h-px px-2" />

      {/* Summary Section */}
      <div className="space-y-4">
        <AttendanceSummary
          total={data.totalAttendance}
          percentage={data.percentagePresent}
        />
        <AttendanceVisualizer todayStats={data.todayAttendance} />
      </div>

      <div className="bg-border -mx-2 h-px px-2" />

      {/* Employee List Section */}
      <div className="space-y-4">
        <EmployeeList
          title="Present"
          employees={employees.present}
          badgeColor="bg-green-200 py-0 text-green-700"
        />

        <EmployeeList
          title="Absent"
          employees={employees.absent}
          badgeColor="bg-red-200 py-0 text-red-700"
        />

        <EmployeeList
          title="On Leave"
          employees={employees.leave}
          badgeColor="bg-yellow-200 py-0 text-yellow-700"
        />
      </div>
    </div>
  );
};
