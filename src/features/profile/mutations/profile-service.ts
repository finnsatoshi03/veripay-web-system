import toast from "react-hot-toast";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useUserStore } from "@/store/userStore";
import { queryKeys } from "@/lib/configs/query-keys";

type ProfileData = {
  first_name: string;
  last_name: string;
  contact_number: string;
  address: string;
  birth_date: string;
  gender: string;
  profile_image?: string;
};

type UpdateProfileParams = {
  userId: number;
  profileData: ProfileData;
};

const updateProfile = async ({ userId, profileData }: UpdateProfileParams) => {
  const { data: existingProfile, error: fetchError } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw fetchError;
  }

  // If profile exists, update it
  if (existingProfile) {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(profileData)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  }
  // Otherwise, create a new profile
  else {
    const { data, error } = await supabase
      .from("user_profiles")
      .insert({ ...profileData, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const fetchUserData = useUserStore((state) => state.fetchUserData);
  const userId = useUserStore((state) => state.id);
  const role = useUserStore((state) => state.role);

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: [queryKeys.USER_DATA] });

      if (userId) {
        fetchUserData(userId.toString(), role);
      }
    },
  });
};
