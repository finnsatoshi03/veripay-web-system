import { useState, useEffect } from "react";
import { z } from "zod";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, Link } from "react-router-dom";

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
import { useResetPassword } from "@/features/auth/mutations/reset-password-service";

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
  const [hasValidTokens, setHasValidTokens] = useState(false);
  const [searchParams] = useSearchParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useResetPassword();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    setHasValidTokens(!!(accessToken && refreshToken));
  }, [searchParams]);

  const handleSubmit = (values: FormValues) => {
    resetPasswordMutation.mutate(values.password);
  };

  // Show error message if no valid tokens
  if (!hasValidTokens) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
          <div className="flex-1">
            <h3 className="font-medium text-red-800">Invalid Reset Link</h3>
            <p className="mt-1 text-sm text-red-700">
              This password reset link is invalid or has expired. Please request
              a new one.
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
  }

  return (
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
                  disabled={resetPasswordMutation.isPending}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  disabled={resetPasswordMutation.isPending}
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
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending
            ? "Updating Password..."
            : "Update Password"}
        </Button>
      </form>
    </Form>
  );
};
