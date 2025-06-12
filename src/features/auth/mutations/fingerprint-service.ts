import { useEffect } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

export type FingerprintStatus = {
  id: number;
  status: "failed" | "done" | "pending" | "skipped" | "processing" | null;
  result: string | null;
  employee_id: number;
  created_at: string;
  updated_at: string;
};

export type FingerprintSettings = {
  force_fingerprint: boolean;
  skip_allowed: boolean;
  description: string;
};

// Query to check fingerprint status for a user with realtime updates
export const useFingerprintStatus = (employeeId: number | null) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["fingerprint-status", employeeId],
    queryFn: async (): Promise<FingerprintStatus | null> => {
      if (!employeeId) return null;

      // First check if there are multiple records and cleanup if needed
      const { data: allRecords } = await supabase
        .from("register_requests")
        .select("*")
        .eq("employee_id", employeeId);

      if (allRecords && allRecords.length > 1) {
        // Keep the most recent record and delete others
        const mostRecent = allRecords.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        )[0];

        const recordsToDelete = allRecords.filter(
          (record) => record.id !== mostRecent.id,
        );

        for (const record of recordsToDelete) {
          await supabase.from("register_requests").delete().eq("id", record.id);
        }

        return mostRecent;
      }

      const { data, error } = await supabase
        .from("register_requests")
        .select("*")
        .eq("employee_id", employeeId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error(`Failed to fetch fingerprint status: ${error.message}`);
      }

      return data;
    },
    enabled: !!employeeId,
  });

  // Set up realtime subscription
  useEffect(() => {
    if (!employeeId) return;

    const channel = supabase
      .channel("register_requests_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "register_requests",
          filter: `employee_id=eq.${employeeId}`,
        },
        () => {
          // Invalidate and refetch the query when data changes
          queryClient.invalidateQueries({
            queryKey: ["fingerprint-status", employeeId],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [employeeId, queryClient]);

  return query;
};

// Query to get fingerprint settings (for HR)
// Since there's no system_settings table, we'll use default settings for now
// You can later store this in user profiles or create a dedicated settings table
export const useFingerprintSettings = () => {
  return useQuery({
    queryKey: ["fingerprint-settings"],
    queryFn: async (): Promise<FingerprintSettings> => {
      // Return default settings - can be modified based on your requirements
      // You might want to store this in localStorage, user profile, or a dedicated table later
      return {
        force_fingerprint: false, // Set to false to allow skipping by default
        skip_allowed: true,
        description:
          "Fingerprint authentication enhances security. Please ensure you are near the IoT fingerprint scanner device to set up.",
      };
    },
  });
};

// Mutation to skip fingerprint setup
export const useSkipFingerprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId: number) => {
      // First, check if there's already a record for this employee
      const { data: existing } = await supabase
        .from("register_requests")
        .select("id")
        .eq("employee_id", employeeId)
        .single();

      let result;

      if (existing) {
        // Update existing record
        const { data, error } = await supabase
          .from("register_requests")
          .update({
            status: "skipped",
            result: "skipped_by_user",
            updated_at: new Date().toISOString(),
          })
          .eq("employee_id", employeeId)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to skip fingerprint: ${error.message}`);
        }
        result = data;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from("register_requests")
          .insert({
            employee_id: employeeId,
            status: "skipped",
            result: "skipped_by_user",
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to skip fingerprint: ${error.message}`);
        }
        result = data;
      }

      return result;
    },
    onSuccess: () => {
      toast.success(
        "Fingerprint setup skipped. You can set it up later in settings.",
      );
      queryClient.invalidateQueries({ queryKey: ["fingerprint-status"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to skip fingerprint: ${error.message}`);
    },
  });
};

// Mutation to update fingerprint settings (HR only)
// Since there's no system_settings table, this is commented out for now
// You can implement this later when you have a proper settings storage solution
/*
export const useUpdateFingerprintSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: FingerprintSettings) => {
      // Implement your settings storage logic here
      // For example, store in user profile or dedicated settings table
      throw new Error("Settings update not implemented yet");
    },
    onSuccess: () => {
      toast.success("Fingerprint settings updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["fingerprint-settings"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update settings: ${error.message}`);
    },
  });
};
*/

// Mutation to initiate fingerprint setup
export const useInitiateFingerprintSetup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId: number) => {
      // First, check if there's already a record for this employee
      const { data: existing } = await supabase
        .from("register_requests")
        .select("id")
        .eq("employee_id", employeeId)
        .single();

      let result;

      if (existing) {
        // Update existing record
        const { data, error } = await supabase
          .from("register_requests")
          .update({
            status: "pending", // Set to pending to indicate setup in progress
            result: "setup_initiated",
            updated_at: new Date().toISOString(),
          })
          .eq("employee_id", employeeId)
          .select()
          .single();

        if (error) {
          throw new Error(
            `Failed to initiate fingerprint setup: ${error.message}`,
          );
        }
        result = data;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from("register_requests")
          .insert({
            employee_id: employeeId,
            status: "pending", // Set to pending to indicate setup in progress
            result: "setup_initiated",
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          throw new Error(
            `Failed to initiate fingerprint setup: ${error.message}`,
          );
        }
        result = data;
      }

      return result;
    },
    onSuccess: () => {
      toast.success(
        "Fingerprint setup initiated. Please ensure you are near the IoT fingerprint scanner device.",
      );
      queryClient.invalidateQueries({ queryKey: ["fingerprint-status"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to initiate fingerprint setup: ${error.message}`);
    },
  });
};

// Mutation to mark fingerprint setup as timed out
export const useMarkFingerprintTimeout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId: number) => {
      const { data, error } = await supabase
        .from("register_requests")
        .update({
          status: "failed",
          result: "setup_timeout",
          updated_at: new Date().toISOString(),
        })
        .eq("employee_id", employeeId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to mark fingerprint timeout: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      toast.error(
        "Fingerprint setup timed out. Please ensure you are near the IoT device and try again.",
      );
      queryClient.invalidateQueries({ queryKey: ["fingerprint-status"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update fingerprint status: ${error.message}`);
    },
  });
};

// Mutation to delete fingerprint record for retry
export const useDeleteFingerprintRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId: number) => {
      const { error } = await supabase
        .from("register_requests")
        .delete()
        .eq("employee_id", employeeId);

      if (error) {
        throw new Error(
          `Failed to delete fingerprint record: ${error.message}`,
        );
      }

      return { success: true };
    },
    onSuccess: () => {
      toast.success(
        "Fingerprint record cleared. You can try setting up again.",
      );
      queryClient.invalidateQueries({ queryKey: ["fingerprint-status"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to clear fingerprint record: ${error.message}`);
    },
  });
};
