import type { Employee as ServiceEmployee } from "@/services/employee-service";

export type EmployeeStatus = "On time" | "Late" | "On leave" | "Absent";
export type Department = string;

// Transform service employee to UI employee
export interface ActiveEmployee {
  id: string;
  name: string;
  department: Department;
  timeIn: string;
  timeOut: string;
  status: EmployeeStatus;
  email: string;
  employeeCode: string;
  position?: string;
  avatar?: string;
}

// Helper function to check if employee is on leave
const isEmployeeOnLeave = (
  employee: ServiceEmployee,
  today: string,
): boolean => {
  const leaveRequests = employee.employees.leave_requests || [];

  return leaveRequests.some((request) => {
    if (request.status !== "approved") return false;

    const startDate = new Date(request.start_date);
    const endDate = new Date(request.end_date);
    const todayDate = new Date(today);

    return todayDate >= startDate && todayDate <= endDate;
  });
};

// Helper function to transform service employee to UI employee
export const transformToActiveEmployee = (
  employee: ServiceEmployee,
): ActiveEmployee => {
  const attendance = employee.employees.attendance_records?.[0];
  const profile = employee.user_profiles;
  const today = new Date().toISOString().split("T")[0];

  // Determine status based on leave requests and attendance
  let status: EmployeeStatus = "Absent";

  if (isEmployeeOnLeave(employee, today)) {
    status = "On leave";
  } else if (attendance) {
    if (attendance.time_in) {
      // You can add logic here to determine if late based on time_in
      status = "On time";
    } else {
      status = "Absent"; // Has attendance record but no time_in
    }
  }

  // Format time display
  const formatTime = (time: string | null): string => {
    if (!time) return "--:--";
    try {
      return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return time; // Return as-is if parsing fails
    }
  };

  return {
    id: employee.id.toString(),
    name: profile ? `${profile.first_name} ${profile.last_name}` : "Unknown",
    department: employee.employees.departments?.name || "Unknown",
    timeIn: formatTime(attendance?.time_in || null),
    timeOut: formatTime(attendance?.time_out || null),
    status,
    email: employee.email,
    employeeCode: employee.employees.employee_code || "",
    position: employee.employees.positions?.title,
    avatar: profile?.profile_image,
  };
};
