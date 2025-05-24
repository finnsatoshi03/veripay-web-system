import supabase from "@/lib/supabase";
import type { Report } from "@/features/hr/_lib/types";

export const createReport = async (
  report: Omit<Report, "id" | "created_at">,
) => {
  try {
    const { data, error } = await supabase
      .from("reports")
      .insert([report])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error("Create Report Error:", error);
    return null;
  }
};

export const editReport = async (
  id: number,
  updates: Partial<Omit<Report, "id" | "created_at">>,
) => {
  try {
    const { data, error } = await supabase
      .from("reports")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error("Edit Report Error:", error);
    return null;
  }
};

export const deleteReport = async (id: number) => {
  try {
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return true;
  } catch (error) {
    console.error("Delete Report Error:", error);
    return false;
  }
};

export const getReportByUser = async (userId: number) => {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select(
        "*, submitted_by(user_profiles(first_name, last_name, profile_image)), assigned_to(user_profiles(first_name, last_name, profile_image))",
      )
      .eq("submitted_by", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error("Get Report By User Error:", error);
    return [];
  }
};

export const getReportById = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error("Get Report Error:", error);
    return null;
  }
};

export const getAllReports = async (): Promise<Report[]> => {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select(
        "*, submitted_by(user_profiles(first_name, last_name, profile_image)), assigned_to(user_profiles(first_name, last_name, profile_image))",
      )
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error("Get All Reports Error:", error);
    return [];
  }
};
