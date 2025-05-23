import { supabase } from "../supabase";

import type { LeaveRequest } from "@/features/hr/_lib/types";

export const getLeaveRequests = async (): Promise<LeaveRequest[]> => {
  try {
    const { data, error } = await supabase
      .from("leave_requests")
      .select(
        `*,
        employee_id:employees(
          id,
          user_id:users(
            user_profiles(
              first_name,
              last_name,
              profile_image
            )
          ),
          position_id:positions(
            title
          )
        ),
        leave_type_id:leave_types(
          id,
          name
        ),
        reviewed_by:users(
          id,
          user_profiles(
            first_name,
            last_name,
            profile_image
          )
        )
      `,
      )
      .order("requested_at", { ascending: true });

    if (error) throw error.message;

    return data as LeaveRequest[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
