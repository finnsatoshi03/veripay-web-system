import { useState } from "react";
import { supabase } from "@/services/supabase";
import { useUserStore } from "@/store/userStore";
import toast from "react-hot-toast";

export const useProfileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const identityId = useUserStore((state) => state.identity_id);
  const userId = useUserStore((state) => state.id);
  const role = useUserStore((state) => state.role);
  const fetchUserData = useUserStore((state) => state.fetchUserData);

  const uploadProfileImage = async (file: File): Promise<string | null> => {
    if (!userId) {
      toast.error("User not authenticated");
      return null;
    }

    try {
      setIsUploading(true);

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from("profiles").getPublicUrl(filePath);

      // Update user profile with new image URL
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ profile_image: data.publicUrl })
        .eq("user_id", userId);

      if (updateError) {
        throw updateError;
      }

      if (identityId) {
        fetchUserData(identityId, role, true);
      }

      toast.success("Profile image updated successfully");
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const selectDefaultImage = async (imageUrl: string): Promise<boolean> => {
    if (!userId) {
      toast.error("User not authenticated");
      return false;
    }

    try {
      setIsUploading(true);

      const { error } = await supabase
        .from("user_profiles")
        .update({ profile_image: imageUrl })
        .eq("user_id", userId);

      if (error) {
        throw error;
      }

      toast.success("Profile image updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating profile image:", error);
      toast.error("Failed to update profile image");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadProfileImage,
    selectDefaultImage,
    isUploading,
  };
};
