import { useState, useEffect } from "react";
import { z } from "zod";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/services/supabase";
import toast from "react-hot-toast";

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetStatus, setResetStatus] = useState<
    "loading" | "ready" | "error" | "success"
  >("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const handleResetPasswordSession = async () => {
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");

      // Check for errors first
      if (error) {
        console.error(
          "Reset password error from URL:",
          error,
          errorDescription,
        );
        setResetStatus("error");
        return;
      }

      try {
        // If we have tokens in the URL, set the session
        if (accessToken && refreshToken) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

          if (sessionError) {
            console.error("Session error:", sessionError);
            setResetStatus("error");
            return;
          }

          // Session set successfully, user can now reset password
          if (sessionData.user) {
            setResetStatus("ready");
            return;
          }
        }

        // If no tokens, check if user already has a valid session
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session check error:", sessionError);
          setResetStatus("error");
          return;
        }

        // If user has a valid session, they can reset password
        if (sessionData.session?.user) {
          setResetStatus("ready");
          return;
        }

        // No valid session or tokens
        setResetStatus("error");
      } catch (error) {
        console.error("Reset password session error:", error);
        setResetStatus("error");
      }
    };

    // Add a small delay to ensure URL processing is complete
    const timer = setTimeout(handleResetPasswordSession, 500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        throw error;
      }

      setResetStatus("success");
      toast.success("Password updated successfully!");

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: unknown) {
      console.error("Password update error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update password. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (resetStatus) {
      case "loading":
        return (
          <div className="w-full space-y-6">
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Preparing Password Reset</h1>
              <p className="text-muted-foreground text-sm">
                Please wait while we prepare your password reset...
              </p>
            </div>
          </div>
        );

      case "ready":
        return (
          <div className="w-full space-y-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Reset Your Password</h1>
              <p className="text-muted-foreground text-sm">
                Enter a new password for your Veripay account. Make sure it's
                strong and something only you would know.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-full space-y-6"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>New Password</FormLabel>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-xs"
                          tabIndex={0}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" && setShowPassword(!showPassword)
                          }
                        >
                          {showPassword ? (
                            <>
                              Hide
                              <EyeOff className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Show
                              <Eye className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="minimum of 8 characters"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Confirm New Password</FormLabel>
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-xs"
                          tabIndex={0}
                          aria-label={
                            showConfirmPassword
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <>
                              Hide
                              <EyeOff className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Show
                              <Eye className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="minimum of 8 characters"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating Password..." : "Update Password"}
                </Button>
              </form>
            </Form>
          </div>
        );

      case "success":
        return (
          <div className="w-full space-y-6">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">
                Password Updated Successfully!
              </h1>
              <p className="text-muted-foreground text-sm">
                Your password has been updated. You will be redirected to the
                login page shortly.
              </p>
            </div>

            <div className="flex gap-2">
              <Link to="/login" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Go to Login Now
                </Button>
              </Link>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="w-full space-y-6">
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <div className="flex-1">
                <h3 className="font-medium text-red-800">Invalid Reset Link</h3>
                <p className="mt-1 text-sm text-red-700">
                  This password reset link is invalid, expired, or has already
                  been used. Please request a new one.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link to="/forgot-password" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Request New Reset Link
                </Button>
              </Link>
              <Link to="/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderContent();
};
