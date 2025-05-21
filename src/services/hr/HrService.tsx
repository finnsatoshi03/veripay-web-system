import supabase from "@/lib/supabase";
import { startOfMonth, subMonths, endOfMonth, format } from "date-fns";

export const getEmployeeSummary = async () => {
  try {
    const now = new Date();
    const thisMonthStart = format(startOfMonth(now), "yyyy-MM-dd");
    const lastMonthStart = format(
      startOfMonth(subMonths(now, 1)),
      "yyyy-MM-dd",
    );
    const lastMonthEnd = format(endOfMonth(subMonths(now, 1)), "yyyy-MM-dd");

    const { data: users, error: userError } = await supabase
      .from("users")
      .select(
        `
        id, created_at,
        employees (
          status
        ),
        user_profiles (
          gender
        )
      `,
      );
    if (userError) throw new Error(userError.message);

    const totalEmployees = users.length;
    const thisMonthEmployees = users.filter(
      (u) => u.created_at >= thisMonthStart,
    ).length;
    const lastMonthEmployees = users.filter(
      (u) => u.created_at >= lastMonthStart && u.created_at <= lastMonthEnd,
    ).length;
    const percentageChange =
      lastMonthEmployees === 0
        ? 100
        : ((thisMonthEmployees - lastMonthEmployees) / lastMonthEmployees) *
          100;

    const genderCounts = users.reduce(
      (acc, user) => {
        const gender = user.user_profiles?.gender?.toLowerCase();
        if (gender === "male") acc.male++;
        else if (gender === "female") acc.female++;
        else acc.others++;
        return acc;
      },
      { male: 0, female: 0, others: 0 },
    );

    const { data: pendingRequests, error: pendingError } = await supabase
      .from("registration_requests")
      .select("id")
      .eq("status", "pending");
    if (pendingError) throw new Error(pendingError.message);

    const totalPending = pendingRequests.length;
    const totalWithPending = totalEmployees + totalPending;

    const pendingPercentage =
      totalWithPending === 0 ? 0 : (totalPending / totalWithPending) * 100;

    return {
      totalEmployees,
      percentageChange: parseFloat(percentageChange.toFixed(2)),
      gender: {
        male: {
          count: genderCounts.male,
          percentage: totalEmployees
            ? parseFloat(
                ((genderCounts.male / totalEmployees) * 100).toFixed(2),
              )
            : 0,
        },
        female: {
          count: genderCounts.female,
          percentage: totalEmployees
            ? parseFloat(
                ((genderCounts.female / totalEmployees) * 100).toFixed(2),
              )
            : 0,
        },
        others: {
          count: genderCounts.others,
          percentage: totalEmployees
            ? parseFloat(
                ((genderCounts.others / totalEmployees) * 100).toFixed(2),
              )
            : 0,
        },
      },
      pending: {
        count: totalPending,
        percentage: parseFloat(pendingPercentage.toFixed(2)),
      },
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAttendanceOverview = async () => {
  try {
    const today = format(new Date(), "yyyy-MM-dd");

    const { data, error } = await supabase.from("users").select(
      `
        id, email, created_at, identity_id, is_active,
        employees (
          employee_code, status, date_hired,
          departments (
            name
          ),
          positions (
            title, level, base_salary
          ),
          attendance_records!inner (
            time_in, status, date
          )
        ),
        user_profiles (
          first_name, last_name, contact_number, address, birth_date, gender
        )
      `
    );

    if (error) throw new Error(error.message);

    const todayRecords = data.flatMap((user) => {
      const emp : any = user.employees;
      if (!emp?.attendance_records) return [];

      return emp.attendance_records
        .filter((record : any) => record.date === today)
        .map((record : any) => ({
          name: `${user.user_profiles?.first_name ?? ""} ${user.user_profiles?.last_name ?? ""}`.trim(),
          department: emp.departments?.name ?? "N/A",
          time_in: record.time_in,
          status: record.status,
        }));
    });

    return todayRecords;
  } catch (error) {
    console.error("Attendance Overview Error:", error);
    return null;
  }
};