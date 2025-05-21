import supabase from "@/lib/supabase";

type Report = {
  id: number;
  category: "Attendance" | "Payroll";
  status: "In Progress" | "To Review" | "Resolved" | "Rejected";
  assigned_to: number | null;
  submitted_by: number;
  submitted_at: string;
  description: string;
  flag_level: "Low" | "Normal" | "High";
  created_at: string;
};

export const createReport = async (report: Omit<Report, "id" | "created_at">) => {
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

export const editReport = async (id: number, updates: Partial<Omit<Report, "id" | "created_at">>) => {
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


export const getAllReports = async () => {
  try {
    const { data, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error("Get All Reports Error:", error);
    return [];
  }
};
