import { supabase } from "../supabase";
import { parseISO, isSameMonth, differenceInMinutes } from "date-fns";

interface User {
  id: number;
  email: string;
  created_at: string;
  identity_id?: string | null;
  is_active: boolean;
}

interface Employee {
  id: number;
  user_id: number;
  employee_code: string;
  status: string;
  date_hired: string;

}

interface UserProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  contact_number?: string;
  address?: string;
  birth_date?: string;
  gender?: string;
}

type EditableUser = Partial<Pick<User, "is_active">>;
type EditableEmployee = Partial<Omit<Employee, "id" | "user_id" | "departments" | "positions" | "attendance_records">>;
type EditableUserProfile = Partial<Omit<UserProfile, "id" | "user_id">>;

interface EditProfileParams {
  userId: number;
  users?: EditableUser;
  employees?: EditableEmployee;
  user_profiles?: EditableUserProfile;
}

export const editProfile = async (params: EditProfileParams) => {
  const { userId, users, employees, user_profiles } = params;

  try {
    if (user_profiles) {
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update(user_profiles)
        .eq("user_id", userId);

      if (profileError) throw profileError;
    }

    if (employees) {
      const { data: empData, error: empFetchError } = await supabase
        .from("employees")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (empFetchError) throw empFetchError;

      const { error: empUpdateError } = await supabase
        .from("employees")
        .update(employees)
        .eq("id", empData.id);

      if (empUpdateError) throw empUpdateError;
    }

    if (users) {
      const { error: userError } = await supabase
        .from("users")
        .update(users)
        .eq("id", userId);

      if (userError) throw userError;
    }

    return true;
  } catch (error) {
    console.error("Edit profile error:", error);
    return false;
  }
};

export const getProfile = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
          id, email, created_at, identity_id, is_active,
          employees (
            employee_code, status, date_hired,
            departments (
              name
            ),
            positions (
              title, level, base_salary
            )
          ),
          user_profiles (
            first_name, last_name, contact_number, address, birth_date, gender
          )
        `,
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    console.log(data);
    
    
    return data;
  } catch (error) {
    console.log(error);
    // toast (error)
    return null
  }
};


export const getAttendanceOverview = async (
  employeeId: number,
  month: string
) => {
  try {
    const { data, error } = await supabase
      .from("attendance_records")
      .select("date, time_in, status")
      .eq("employee_id", employeeId)
      .order("date", { ascending: true });

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return null;
    
    // Filter records to the specified month
    const filteredRecords = data.filter((r) =>
      isSameMonth(parseISO(r.date), parseISO(`${month}-01`))
    );

    const validRecords = filteredRecords.filter(
      (r) => r.time_in && r.status === "present"
    );

    const mostLate = validRecords.reduce((latest, record) => {
      return !latest || record.time_in > latest.time_in ? record : latest;
    }, null as typeof data[0] | null);

    const avgTime = (() => {
      const totalMinutes = validRecords.reduce((sum, r) => {
        const [h, m] = r.time_in.split(":").map(Number);
        return sum + h * 60 + m;
      }, 0);

      if (validRecords.length === 0) return null;

      const avgMinutes = Math.floor(totalMinutes / validRecords.length);
      const hours = Math.floor(avgMinutes / 60)
        .toString()
        .padStart(2, "0");
      const minutes = (avgMinutes % 60).toString().padStart(2, "0");

      return `${hours}:${minutes}`;
    })();

    const streak = (() => {
      let count = 0;
      const sorted = filteredRecords
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      for (const rec of sorted) {
        if (rec.status === "present") {
          count++;
        } else if (rec.status === "absent") {
          break;
        }
      }
      return count;
    })();

    return {
      mostLateCheckIn: mostLate?.time_in ?? null,
      mostLateDate: mostLate?.date ?? null,
      averageCheckIn: avgTime,
      attendanceStreak: streak,
      attendanceRecords: filteredRecords,
    };
  } catch (error) {
    console.error("Overview Error:", error);
    return null;
  }
};

export const getAttendanceHistory = async (
  employeeId: number,
  start: string,
  end: string   
) => {
  try {
    const { data, error } = await supabase
      .from("attendance_records")
      .select("date, time_in, time_out, status")
      .eq("employee_id", employeeId)
      .gte("date", start)
      .lte("date", end)
      .order("date", { ascending: true });

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return null;

    const records = data;

    const totalAttendance = records.length;

  
    let presentCount = 0;
    let lateCount = 0;
    let onLeaveCount = 0;
    let totalMinutes = 0;
    let totalCheckInMinutes = 0;
    let totalCheckOutMinutes = 0;
    let checkInCount = 0;
    let checkOutCount = 0;

    records.forEach((r) => {
      if (r.status === "present") presentCount++;
      if (r.status === "late") lateCount++;
      if (r.status === "on leave") onLeaveCount++;

      if (r.time_in && r.time_out) {
        const inTime = parseISO(`${r.date}T${r.time_in}`);
        const outTime = parseISO(`${r.date}T${r.time_out}`);
        const duration = differenceInMinutes(outTime, inTime);
        if (duration > 0) {
          totalMinutes += duration;
        }
      }

      if (r.time_in) {
        const [h, m] = r.time_in.split(":").map(Number);
        totalCheckInMinutes += h * 60 + m;
        checkInCount++;
      }

      if (r.time_out) {
        const [h, m] = r.time_out.split(":").map(Number);
        totalCheckOutMinutes += h * 60 + m;
        checkOutCount++;
      }
    });

    const formatAvgTime = (minutes: number) => {
      const hrs = Math.floor(minutes / 60)
        .toString()
        .padStart(2, "0");
      const mins = (minutes % 60).toString().padStart(2, "0");
      return `${hrs}:${mins}`;
    };

    const total = presentCount + lateCount + onLeaveCount || 1;

    return {
      totalAttendance,
      totalHours: (totalMinutes / 60).toFixed(2),
      averageCheckIn: checkInCount ? formatAvgTime(Math.floor(totalCheckInMinutes / checkInCount)) : null,
      averageCheckOut: checkOutCount ? formatAvgTime(Math.floor(totalCheckOutMinutes / checkOutCount)) : null,
      percentages: {
        present: parseFloat(((presentCount / total) * 100).toFixed(2)),
        late: parseFloat(((lateCount / total) * 100).toFixed(2)),
        onLeave: parseFloat(((onLeaveCount / total) * 100).toFixed(2)),
      },
      attendanceRecords: records,
    };
  } catch (error) {
    console.error("Attendance History Error:", error);
    return null;
  }
};