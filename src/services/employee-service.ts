import supabase from "@/lib/supabase";

// Types
export interface AttendanceRecord {
  employee_id: number;
  date: string;
  time_in: string | null;
  time_out: string | null;
  status: string;
}

export interface Employee {
  id: number;
  email: string;
  created_at: string;
  identity_id: string;
  is_active: boolean;
  employees: {
    id: number;
    employee_code: string;
    status: string;
    date_hired: string;
    departments: { name: string } | null;
    positions: { title: string; level: string; base_salary: number } | null;
    attendance_records?: AttendanceRecord[];
  };
  user_profiles: {
    first_name: string;
    last_name: string;
    contact_number: string;
    address: string;
    birth_date: string;
    gender: string;
    profile_image?: string;
  } | null;
}

export interface SummaryStats {
  total: number;
  onLeave: number;
  loggedIn: number;
  notLoggedIn: number;
  absent: number;
  percentages: {
    onLeave: number;
    loggedIn: number;
    notLoggedIn: number;
    absent: number;
  };
}

export interface ActiveEmployeesResponse {
  employees: Employee[];
  summary: SummaryStats;
}

// Raw Supabase response interface
interface RawSupabaseEmployee {
  id: number;
  employee_code: string;
  status: string;
  date_hired: string;
  departments: unknown;
  positions: unknown;
}

interface RawSupabaseUser {
  id: number;
  email: string;
  created_at: string;
  identity_id: string;
  is_active: boolean;
  employees: RawSupabaseEmployee | RawSupabaseEmployee[];
  user_profiles: unknown;
}

// Helper functions
const normalizeArray = <T>(data: T | T[]): T[] => {
  return Array.isArray(data) ? data : [data];
};

const calculateSummaryStats = (employees: Employee[]): SummaryStats => {
  const total = employees.length;
  let onLeave = 0;
  let loggedIn = 0;
  let notLoggedIn = 0;
  let absent = 0;

  employees.forEach((employee) => {
    const todayAttendance = employee.employees.attendance_records?.[0];

    if (todayAttendance) {
      if (todayAttendance.status === "on_leave") {
        onLeave++;
      } else if (todayAttendance.time_in) {
        loggedIn++;
      } else {
        notLoggedIn++;
      }
    } else {
      // No attendance record means absent
      absent++;
    }
  });

  return {
    total,
    onLeave,
    loggedIn,
    notLoggedIn,
    absent,
    percentages: {
      onLeave: total > 0 ? Math.round((onLeave / total) * 100) : 0,
      loggedIn: total > 0 ? Math.round((loggedIn / total) * 100) : 0,
      notLoggedIn: total > 0 ? Math.round((notLoggedIn / total) * 100) : 0,
      absent: total > 0 ? Math.round((absent / total) * 100) : 0,
    },
  };
};

const transformEmployeeData = (
  rawEmployees: RawSupabaseUser[],
  attendanceMap: Map<number, AttendanceRecord[]>,
): Employee[] => {
  return rawEmployees.map((user) => {
    const employeesData = normalizeArray(user.employees);
    const userProfilesData = normalizeArray(user.user_profiles);
    const employeeData = employeesData[0];
    const userProfileData = userProfilesData[0];

    const departmentsData = employeeData?.departments;
    const positionsData = employeeData?.positions;

    return {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      identity_id: user.identity_id,
      is_active: user.is_active,
      employees: {
        id: employeeData?.id,
        employee_code: employeeData?.employee_code,
        status: employeeData?.status,
        date_hired: employeeData?.date_hired,
        departments: Array.isArray(departmentsData)
          ? departmentsData[0]
          : departmentsData || null,
        positions: Array.isArray(positionsData)
          ? positionsData[0]
          : positionsData || null,
        attendance_records: attendanceMap.get(employeeData?.id) || [],
      },
      user_profiles:
        userProfileData &&
        typeof userProfileData === "object" &&
        "first_name" in userProfileData
          ? (userProfileData as Employee["user_profiles"])
          : null,
    };
  });
};

// Main service function
export const getActiveEmployees = async (
  today: string,
): Promise<ActiveEmployeesResponse | null> => {
  try {
    // Fetch active employees
    const { data: employees, error: empError } = await supabase
      .from("users")
      .select(
        `
        id, email, created_at, identity_id, is_active,
        employees!inner (
          id, employee_code, status, date_hired,
          departments ( name ),
          positions ( title, level, base_salary )
        ),
        user_profiles (
          first_name, last_name, contact_number, address, birth_date, gender, profile_image
        )
      `,
      )
      .eq("employees.status", "active")
      .eq("is_active", true);

    if (empError) throw empError;

    if (!employees || employees.length === 0) {
      return {
        employees: [],
        summary: {
          total: 0,
          onLeave: 0,
          loggedIn: 0,
          notLoggedIn: 0,
          absent: 0,
          percentages: { onLeave: 0, loggedIn: 0, notLoggedIn: 0, absent: 0 },
        },
      };
    }

    // Extract employee IDs
    const employeeIds: number[] = employees.flatMap((user) => {
      const employeesData = normalizeArray(user.employees);
      return employeesData.filter((emp) => emp?.id).map((emp) => emp.id);
    });

    // Fetch attendance records
    const { data: attendanceRecords, error: attError } = await supabase
      .from("attendance_records")
      .select("employee_id, date, time_in, time_out, status")
      .in("employee_id", employeeIds)
      .eq("date", today);

    if (attError) throw attError;

    // Create attendance map
    const attendanceMap = new Map<number, AttendanceRecord[]>();
    attendanceRecords?.forEach((record) => {
      if (!attendanceMap.has(record.employee_id)) {
        attendanceMap.set(record.employee_id, []);
      }
      attendanceMap.get(record.employee_id)?.push(record);
    });

    // Transform data
    const transformedEmployees = transformEmployeeData(
      employees,
      attendanceMap,
    );
    const summary = calculateSummaryStats(transformedEmployees);

    return {
      employees: transformedEmployees,
      summary,
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};
