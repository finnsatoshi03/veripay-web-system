import toast from "react-hot-toast";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useUser, useUserStore } from "@/store/userStore";

export type EditProfileParams = {
  profile: {
    first_name?: string;
    last_name?: string;
    contact_number?: string;
    address?: string;
    birth_date?: string;
    gender?: string;
  };
  user?: {
    email?: string;
  };
};

// Edit profile service function
export const editProfile = async (
  params: EditProfileParams & { userId: string },
) => {
  const { userId, profile, user } = params;
  let profileData = null;
  let userData = null;

  try {
    // Update user_profiles table
    if (profile && Object.keys(profile).length > 0) {
      const { data, error: profileError } = await supabase
        .from("user_profiles")
        .update(profile)
        .eq("user_id", userId)
        .select()
        .single();

      if (profileError) throw profileError;
      profileData = data;
    }

    // Update users table
    if (user && Object.keys(user).length > 0) {
      const { data, error: userError } = await supabase
        .from("users")
        .update(user)
        .eq("id", userId)
        .select()
        .single();

      if (userError) throw userError;
      userData = data;
    }

    // Return the updated data
    return {
      profile: profileData,
      user: userData,
    };
  } catch (error) {
    console.error("Edit profile error:", error);
    throw error;
  }
};

// React Query mutation hook
export const useEditProfile = () => {
  const queryClient = useQueryClient();
  const { identity_id, id: userId, role } = useUser();
  const fetchUserData = useUserStore((state) => state.fetchUserData);

  return useMutation({
    mutationFn: (data: EditProfileParams) =>
      editProfile({ ...data, userId: userId?.toString() || "" }),

    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userData"] });

      if (identity_id) {
        fetchUserData(identity_id.toString(), role, true);
      }
    },

    onError: (error) => {
      toast.error(
        `Failed to update profile: ${error.message || "Unknown error"}`,
      );
    },
  });
};
