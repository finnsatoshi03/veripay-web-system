import { supabase } from "../supabase";

export type HrAnnouncement = {
  id?: number;
  title: string;
  body?: string;
  target_role?: number;
  created_by?: number;
  created_at?: string;
  scope: "global" | "by role";
};

export type AnnouncementWithDetails = {
  id: number;
  title: string;
  body: string;
  target_role?: number;
  created_by?: number;
  created_at: string;
  scope: "global" | "by role";
  roles?: {
    id: number;
    name: string;
  } | null;
  created_by_profile?: {
    user_profiles: {
      first_name: string;
      last_name: string;
      profile_image: string;
    };
  } | null;
};

// Get all announcements for HR management
export const getAllAnnouncementsForHr = async (page = 0, pageSize = 20) => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select(
        `
        id,
        title,
        body,
        target_role,
        created_by,
        created_at,
        scope,
        roles:target_role(id, name),
        created_by_profile:created_by(user_profiles(first_name, last_name, profile_image))
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const start = page * pageSize;
    const end = start + pageSize;
    const paginated = data.slice(start, end);

    return {
      data: paginated as unknown as AnnouncementWithDetails[],
      total: data.length,
      page,
      pageSize,
    };
  } catch (error) {
    console.error("getAllAnnouncementsForHr error:", error);
    return { data: [], error, total: 0, page, pageSize };
  }
};

// Get announcements filtered by scope
export const getAnnouncementsByScope = async (
  scope: "global" | "by role" | "all",
  page = 0,
  pageSize = 20,
) => {
  try {
    let query = supabase.from("announcements").select(`
        id,
        title,
        body,
        target_role,
        created_by,
        created_at,
        scope,
        roles:target_role(id, name),
        created_by_profile:created_by(user_profiles(first_name, last_name, profile_image))
      `);

    if (scope !== "all") {
      query = query.eq("scope", scope);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      throw new Error(error.message);
    }

    const start = page * pageSize;
    const end = start + pageSize;
    const paginated = data.slice(start, end);

    return {
      data: paginated as unknown as AnnouncementWithDetails[],
      total: data.length,
      page,
      pageSize,
    };
  } catch (error) {
    console.error("getAnnouncementsByScope error:", error);
    return { data: [], error, total: 0, page, pageSize };
  }
};

// Create announcement
export const createHrAnnouncement = async (announcement: HrAnnouncement) => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .insert({
        title: announcement.title,
        body: announcement.body,
        target_role:
          announcement.scope === "by role" ? announcement.target_role : null,
        created_by: announcement.created_by,
        scope: announcement.scope,
      })
      .select(
        `
        id,
        title,
        body,
        target_role,
        created_by,
        created_at,
        scope,
        roles:target_role(id, name),
        created_by_profile:created_by(user_profiles(first_name, last_name, profile_image))
      `,
      )
      .single();

    if (error) throw new Error(error.message);

    return { data: data as unknown as AnnouncementWithDetails };
  } catch (error) {
    console.error("createHrAnnouncement error:", error);
    return { data: null, error };
  }
};

// Update announcement
export const updateHrAnnouncement = async (
  id: number,
  announcement: Partial<HrAnnouncement>,
) => {
  try {
    const updateData: Record<string, unknown> = {
      title: announcement.title,
      body: announcement.body,
      scope: announcement.scope,
    };

    if (announcement.scope === "by role") {
      updateData.target_role = announcement.target_role;
    } else {
      updateData.target_role = null;
    }

    const { data, error } = await supabase
      .from("announcements")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        id,
        title,
        body,
        target_role,
        created_by,
        created_at,
        scope,
        roles:target_role(id, name),
        created_by_profile:created_by(user_profiles(first_name, last_name, profile_image))
      `,
      )
      .single();

    if (error) throw new Error(error.message);

    return { data: data as unknown as AnnouncementWithDetails };
  } catch (error) {
    console.error("updateHrAnnouncement error:", error);
    return { data: null, error };
  }
};

// Delete announcement
export const deleteHrAnnouncement = async (id: number) => {
  try {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    return { success: true };
  } catch (error) {
    console.error("deleteHrAnnouncement error:", error);
    return { success: false, error };
  }
};

// Get roles for role selection
export const getRoles = async () => {
  try {
    const { data, error } = await supabase
      .from("roles")
      .select("id, name")
      .order("name");

    if (error) throw new Error(error.message);

    return { data: data || [] };
  } catch (error) {
    console.error("getRoles error:", error);
    return { data: [], error };
  }
};
