import supabase from "@/lib/supabase";

type AttendanceRecord = {
  employee_id: number;
  date: string;
  time_in: string | null;
  time_out: string | null;
  status: string;
};

type Employee = {
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
  };
};

type SummaryStats = {
  total: number;
  onLeave: number;
  loggedIn: number;
  notLoggedIn: number;
  percentages: {
    onLeave: number;
    loggedIn: number;
    notLoggedIn: number;
  };
};

export const getActiveEmployees = async (
  today: string
): Promise<{ employees: Employee[]; summary: SummaryStats } | null> => {
  try {    
    const { data: employees, error: empError } = await supabase
      .from("users")
      .select(`
        id, email, created_at, identity_id, is_active,
        employees (
          id, employee_code, status, date_hired,
          departments ( name ),
          positions ( title, level, base_salary )
        ),
        user_profiles (
          first_name, last_name, contact_number, address, birth_date, gender
        )
      `)
      .eq("employees.status", "active");

    if (empError) throw empError;

    const filteredEmployees : Employee[] = employees;
    const employeeIds = filteredEmployees.map((u) => u.employees?.id).filter(Boolean);

    if (employeeIds.length === 0) {
      return {
        employees: [],
        summary: {
          total: 0,
          onLeave: 0,
          loggedIn: 0,
          notLoggedIn: 0,
          percentages: { onLeave: 0, loggedIn: 0, notLoggedIn: 0 },
        },
      };
    }
    
    const { data: attendanceRecords, error: attError } = await supabase
      .from("attendance_records")
      .select("employee_id, date, time_in, time_out, status")
      .in("employee_id", employeeIds)
      .eq("date", today);

    if (attError) throw attError;

    const attendanceMap = (attendanceRecords || []).reduce<Record<number, AttendanceRecord[]>>(
      (acc, record) => {
        if (!acc[record.employee_id]) acc[record.employee_id] = [];
        acc[record.employee_id].push(record);
        return acc;
      },
      {}
    );
    
    let onLeave = 0;
    let loggedIn = 0;
    let notLoggedIn = 0;

    const result = filteredEmployees.map((user) => {
      const emp = user.employees;
      const empId = emp?.id;

      if (empId) {
        const records = attendanceMap[empId] || [];
        emp.attendance_records = records;

        if (emp.status === "on leave") {
          onLeave++;
        } else if (records.length > 0) {
          loggedIn++;
        } else {
          notLoggedIn++;
        }
      }

      return user;
    });

    const total = result.length;
    const summary: SummaryStats = {
      total,
      onLeave,
      loggedIn,
      notLoggedIn,
      percentages: {
        onLeave: +(onLeave / total * 100).toFixed(2),
        loggedIn: +(loggedIn / total * 100).toFixed(2),
        notLoggedIn: +(notLoggedIn / total * 100).toFixed(2),
      },
    };


    return { employees: result, summary };
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};