/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "../supabase";

interface UserProfile {
  first_name: string;
  last_name: string;
  gender: string;
}

interface EmployeeWithUserProfile {
  id: number;
  status: string;
  created_at: string;
  user_id: {
    user_profiles: UserProfile;
  } | null;
}

export interface EmployeeSummaryData {
  totalEmployees: number;
  maleEmployees: number;
  femaleEmployees: number;
  pendingRequests: number;
  monthlyComparison: {
    totalChange: number;
    totalChangePercentage: string;
    maleChange: number;
    maleChangePercentage: string;
    femaleChange: number;
    femaleChangePercentage: string;
    pendingChange: number;
    pendingChangePercentage: string;
  };
}

export const getEmployeeSummary = async (): Promise<EmployeeSummaryData> => {
  try {
    // Get current month boundaries
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch all current active employees
    const { data: currentEmployees, error: currentError } = await supabase
      .from("employees")
      .select(
        `
        id,
        user_id(user_profiles(first_name, last_name, gender)),
        status,
        created_at
      `,
      )
      .eq("status", "active")
      .returns<EmployeeWithUserProfile[]>();

    if (currentError) throw currentError;

    // Fetch employees from previous month for comparison
    const { data: previousEmployees, error: previousError } = await supabase
      .from("employees")
      .select(
        `
        id,
        user_id(user_profiles(first_name, last_name, gender)),
        status,
        created_at
      `,
      )
      .eq("status", "active")
      .lt("created_at", currentMonthStart.toISOString())
      .returns<EmployeeWithUserProfile[]>();

    if (previousError) throw previousError;

    // Fetch current pending requests
    const { data: currentPendingData, error: currentPendingError } =
      await supabase
        .from("registration_requests")
        .select("*")
        .eq("status", "pending");

    if (currentPendingError) throw currentPendingError;

    // Fetch previous month pending requests for comparison
    const { data: previousPendingData, error: previousPendingError } =
      await supabase
        .from("registration_requests")
        .select("*")
        .eq("status", "pending")
        .gte("created_at", previousMonthStart.toISOString())
        .lt("created_at", previousMonthEnd.toISOString());

    if (previousPendingError) throw previousPendingError;

    // Helper function to safely get gender
    const getGender = (emp: EmployeeWithUserProfile): string => {
      return emp.user_id?.user_profiles?.gender?.toLowerCase() || "";
    };

    // Calculate current stats
    const totalEmployees = currentEmployees?.length || 0;
    const maleEmployees =
      currentEmployees?.filter((emp) => getGender(emp) === "male").length || 0;
    const femaleEmployees =
      currentEmployees?.filter((emp) => getGender(emp) === "female").length ||
      0;
    const pendingRequests = currentPendingData?.length || 0;

    // Calculate previous month stats
    const previousTotal = previousEmployees?.length || 0;
    const previousMale =
      previousEmployees?.filter((emp) => getGender(emp) === "male").length || 0;
    const previousFemale =
      previousEmployees?.filter((emp) => getGender(emp) === "female").length ||
      0;
    const previousPending = previousPendingData?.length || 0;

    // Calculate changes and percentages
    const calculateChange = (current: number, previous: number) => {
      const change = current - previous;
      const percentage =
        previous > 0 ? ((change / previous) * 100).toFixed(1) : "0.0";
      return {
        change,
        percentage: change >= 0 ? `+${percentage}%` : `${percentage}%`,
      };
    };

    const totalChange = calculateChange(totalEmployees, previousTotal);
    const maleChange = calculateChange(maleEmployees, previousMale);
    const femaleChange = calculateChange(femaleEmployees, previousFemale);
    const pendingChange = calculateChange(pendingRequests, previousPending);

    return {
      totalEmployees,
      maleEmployees,
      femaleEmployees,
      pendingRequests,
      monthlyComparison: {
        totalChange: totalChange.change,
        totalChangePercentage: totalChange.percentage,
        maleChange: maleChange.change,
        maleChangePercentage: maleChange.percentage,
        femaleChange: femaleChange.change,
        femaleChangePercentage: femaleChange.percentage,
        pendingChange: pendingChange.change,
        pendingChangePercentage: pendingChange.percentage,
      },
    };
  } catch (error) {
    console.error("Error fetching employee summary:", error);
    throw error;
  }
};

export interface AttendanceSummaryData {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  onLeaveToday: number;
  presentPercentage: number;
  monthlyComparison: {
    presentChange: number;
    presentChangePercentage: string;
  };
  todayAttendance: Array<{
    id: string;
    status: "present" | "absent" | "late" | "leave";
    count: number;
    percentage: number;
    color: string;
  }>;
  employeeDetails: {
    present: Array<{
      id: string;
      name: string;
      position: string;
      avatar?: string;
      time: string;
      status: "present";
    }>;
    absent: Array<{
      id: string;
      name: string;
      position: string;
      avatar?: string;
      time: string;
      status: "absent";
    }>;
    late: Array<{
      id: string;
      name: string;
      position: string;
      avatar?: string;
      time: string;
      status: "late";
    }>;
    leave: Array<{
      id: string;
      name: string;
      position: string;
      avatar?: string;
      time: string;
      status: "leave";
    }>;
  };
}

export const getAttendanceSummary =
  async (): Promise<AttendanceSummaryData> => {
    try {
      const today = new Date();
      const todayString = today.toISOString().split("T")[0];

      // Fetch all active employees
      const { data: allEmployees, error: employeesError } = await supabase
        .from("employees")
        .select(
          `
        id,
        user_id(user_profiles(first_name, last_name, profile_image)),
        positions(title),
        status
      `,
        )
        .eq("status", "active");

      if (employeesError) throw employeesError;

      // Fetch today's attendance records
      const { data: todayAttendance, error: attendanceError } = await supabase
        .from("attendance_records")
        .select(
          `
        id,
        employee_id,
        employees(
          id,
          user_id(user_profiles(first_name, last_name, profile_image)),
          positions(title)
        ),
        date,
        time_in,
        time_out,
        status,
        source
      `,
        )
        .eq("date", todayString);

      if (attendanceError) throw attendanceError;

      // Fetch approved leave requests for today
      const { data: leaveToday, error: leaveError } = await supabase
        .from("leave_requests")
        .select(
          `
        id,
        employee_id,
        employees(
          id,
          user_id(user_profiles(first_name, last_name, profile_image)),
          positions(title)
        ),
        start_date,
        end_date,
        status
      `,
        )
        .eq("status", "approved")
        .lte("start_date", todayString)
        .gte("end_date", todayString);

      if (leaveError) throw leaveError;

      // Calculate totals
      const totalEmployees = allEmployees?.length || 0;
      const attendanceRecords = todayAttendance || [];
      const leaveRecords = leaveToday || [];

      // Get employee IDs who are on leave today
      const employeesOnLeave = new Set(
        leaveRecords.map((record) => record.employee_id),
      );

      // Get employee IDs who have attendance records today
      const employeesWithAttendance = new Set(
        attendanceRecords.map((record) => record.employee_id),
      );

      // Count by status
      const presentToday = attendanceRecords.filter(
        (record) =>
          (record.status === "present" || record.status === "on_time") &&
          record.time_in,
      ).length;
      const lateToday = attendanceRecords.filter(
        (record) => record.status === "late" && record.time_in,
      ).length;
      const onLeaveToday = leaveRecords.length;

      // Find employees who are absent (no attendance record or no time_in, and not on leave)
      const absentEmployees =
        allEmployees?.filter((emp) => {
          const isOnLeave = employeesOnLeave.has(emp.id);
          const hasAttendanceRecord = employeesWithAttendance.has(emp.id);
          const attendanceRecord = attendanceRecords.find(
            (record) => record.employee_id === emp.id,
          );
          const hasTimeIn = attendanceRecord?.time_in;

          return !isOnLeave && (!hasAttendanceRecord || !hasTimeIn);
        }) || [];

      const absentToday = absentEmployees.length;

      // Calculate percentage
      const presentPercentage =
        totalEmployees > 0
          ? Math.round(((presentToday + lateToday) / totalEmployees) * 100)
          : 0;

      // Mock previous month data for comparison (enhance with real data later)
      const previousPresentPercentage = 89;
      const presentChange = presentPercentage - previousPresentPercentage;
      const presentChangePercentage =
        presentChange >= 0 ? `+${presentChange}%` : `${presentChange}%`;

      // Transform employee data helpers for each status type
      const transformPresentEmployees = (records: any[]) => {
        return records.map((record) => ({
          id: record.id.toString(),
          name:
            `${record.employees?.user_id?.user_profiles?.first_name || ""} ${record.employees?.user_id?.user_profiles?.last_name || ""}`.trim() ||
            "Unknown Employee",
          position: record.employees?.positions?.title || "No Position",
          avatar: record.employees?.user_id?.user_profiles?.profile_image,
          time: record.time_in || "N/A",
          status: "present" as const,
        }));
      };

      const transformLateEmployees = (records: any[]) => {
        return records.map((record) => ({
          id: record.id.toString(),
          name:
            `${record.employees?.user_id?.user_profiles?.first_name || ""} ${record.employees?.user_id?.user_profiles?.last_name || ""}`.trim() ||
            "Unknown Employee",
          position: record.employees?.positions?.title || "No Position",
          avatar: record.employees?.user_id?.user_profiles?.profile_image,
          time: record.time_in || "N/A",
          status: "late" as const,
        }));
      };

      const transformAbsentEmployees = (records: any[]) => {
        return records.map((record) => ({
          id: record.id.toString(),
          name:
            `${record.user_id?.user_profiles?.first_name || ""} ${record.user_id?.user_profiles?.last_name || ""}`.trim() ||
            "Unknown Employee",
          position: record.positions?.title || "No Position",
          avatar: record.user_id?.user_profiles?.profile_image,
          time: "Not Reported",
          status: "absent" as const,
        }));
      };

      const transformLeaveEmployees = (records: any[]) => {
        return records.map((record) => ({
          id: record.id.toString(),
          name:
            `${record.employees?.user_id?.user_profiles?.first_name || ""} ${record.employees?.user_id?.user_profiles?.last_name || ""}`.trim() ||
            "Unknown Employee",
          position: record.employees?.positions?.title || "No Position",
          avatar: record.employees?.user_id?.user_profiles?.profile_image,
          time: "On Leave",
          status: "leave" as const,
        }));
      };

      // Prepare today's attendance breakdown
      const todayAttendanceBreakdown = [
        {
          id: "present",
          status: "present" as const,
          count: presentToday,
          percentage:
            totalEmployees > 0
              ? Math.round((presentToday / totalEmployees) * 100)
              : 0,
          color: "bg-green-500",
        },
        {
          id: "late",
          status: "late" as const,
          count: lateToday,
          percentage:
            totalEmployees > 0
              ? Math.round((lateToday / totalEmployees) * 100)
              : 0,
          color: "bg-yellow-500",
        },
        {
          id: "absent",
          status: "absent" as const,
          count: absentToday,
          percentage:
            totalEmployees > 0
              ? Math.round((absentToday / totalEmployees) * 100)
              : 0,
          color: "bg-red-500",
        },
        {
          id: "leave",
          status: "leave" as const,
          count: onLeaveToday,
          percentage:
            totalEmployees > 0
              ? Math.round((onLeaveToday / totalEmployees) * 100)
              : 0,
          color: "bg-blue-500",
        },
      ];

      return {
        totalEmployees,
        presentToday,
        absentToday,
        lateToday,
        onLeaveToday,
        presentPercentage,
        monthlyComparison: {
          presentChange,
          presentChangePercentage,
        },
        todayAttendance: todayAttendanceBreakdown,
        employeeDetails: {
          present: transformPresentEmployees(
            attendanceRecords.filter(
              (r) =>
                (r.status === "present" || r.status === "on_time") && r.time_in,
            ),
          ),
          late: transformLateEmployees(
            attendanceRecords.filter((r) => r.status === "late" && r.time_in),
          ),
          absent: transformAbsentEmployees(absentEmployees),
          leave: transformLeaveEmployees(leaveRecords),
        },
      };
    } catch (error) {
      console.error("Error fetching attendance summary:", error);
      throw error;
    }
  };
