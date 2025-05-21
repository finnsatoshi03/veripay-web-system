import { useEffect } from "react";
import { useAuthStore, setupAuthListener } from "@/store/authStore";

export const AuthInitializer = () => {
  const { checkSession } = useAuthStore();

  // Setup auth listener on component mount
  useEffect(() => {
    // First check current session
    checkSession();

    // Then setup listener for auth changes
    const unsubscribe = setupAuthListener();
    return () => unsubscribe();
  }, [checkSession]);

  return null; // This is a non-rendering component
};
