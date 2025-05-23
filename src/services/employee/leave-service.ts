import { supabase } from "../supabase";

export interface LeaveRequest {
  id: number;
  employee_id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  reason?: string;
  requested_at: string;
  reviewed_by?: {
    user_profiles: {
      first_name: string;
      last_name: string;
      profile_image?: string;
    };
  };
  reviewed_at?: string;
  status: "pending" | "approved" | "rejected" | null;
}

export interface LeaveType {
  id: number;
  name: string;
  description?: string;
  max_days?: number;
}

export const getLeaveRequestsByEmployeeId = async (
  employeeId: number,
): Promise<LeaveRequest[]> => {
  try {
    const { data, error } = await supabase
      .from("leave_requests")
      .select(
        "*, reviewed_by(user_profiles(first_name, last_name, profile_image))",
      )
      .eq("employee_id", employeeId);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error getting leave requests:", error);
    throw error;
  }
};

// data will be like this
// {
//   "leave_types": {
//     "id": 1,
//     "name": "Vacation Leave",
//     "description": "Vacation Leave",
//     "max_days": 12
//   }
export const getLeaveTypes = async (): Promise<LeaveType[]> => {
  try {
    const { data, error } = await supabase.from("leave_types").select("*");

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error getting leave types:", error);
    throw error;
  }
};
