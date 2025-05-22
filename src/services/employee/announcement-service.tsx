import { supabase } from "../supabase";

export const getUpcomingBirthdays = async (page = 0, pageSize = 10) => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, first_name, last_name, birth_date");

    if (error) {
      throw new Error(error.message);
    }

    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const formatMonthDay = (date: Date) =>
      `${date.getMonth() + 1}`.padStart(2, "0") +
      "-" +
      `${date.getDate()}`.padStart(2, "0");

    const todayMD = formatMonthDay(today);
    const futureMD = formatMonthDay(sevenDaysFromNow);

    const isInRange = (birthDateStr: string) => {
      const birthDate = new Date(birthDateStr);
      const birthMD = formatMonthDay(birthDate);

      if (todayMD <= futureMD) {
        // Normal case: May 19 to May 26
        return birthMD >= todayMD && birthMD <= futureMD;
      } else {
        // Wrap around New Year: Dec 29 to Jan 5
        return birthMD >= todayMD || birthMD <= futureMD;
      }
    };

    const upcoming = data.filter((user) => isInRange(user.birth_date));

    const start = page * pageSize;
    const end = start + pageSize;
    const paginated = upcoming.slice(start, end);

    return {
      data: paginated,
      total: upcoming.length,
      page,
      pageSize,
    };
  } catch (error) {
    console.error("getUpcomingBirthdays error:", error);
    return { data: [], error };
  }
};

export const getAnnouncements = async (
  role: string,
  page = 0,
  pageSize = 10,
) => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select(
        "*, roles(name), created_by(user_profiles(first_name, last_name))",
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const filtered = data.filter((announcement) => {
      return (
        announcement.scope === "global" ||
        (announcement.scope !== "global" && announcement.roles.name === role)
      );
    });

    const start = page * pageSize;
    const end = start + pageSize;
    const paginated = filtered.slice(start, end);

    return {
      data: paginated,
      total: filtered.length,
      page,
      pageSize,
    };
  } catch (error) {
    console.error("getAnnouncements error:", error);
    return { data: [], error };
  }
};
