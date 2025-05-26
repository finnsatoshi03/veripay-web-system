import { useEffect } from "react";
import { useAuthStore, setupAuthListener } from "@/store/authStore";
import { initializeSession } from "@/services/supabase";

export const AuthInitializer = () => {
  const { checkSession } = useAuthStore();

  // Setup auth listener and initialize session on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First initialize session from stored tokens
        await initializeSession();

        // Then check current session
        await checkSession();
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Still check session even if initialization fails
        await checkSession();
      }
    };

    // Initialize authentication
    initializeAuth();

    // Setup listener for auth changes
    const unsubscribe = setupAuthListener();

    return () => unsubscribe();
  }, [checkSession]);

  return null; // This is a non-rendering component
};
