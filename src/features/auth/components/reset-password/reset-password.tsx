import { useState } from "react";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useResetPassword();

  const handleSubmit = (values: FormValues) => {
    resetPasswordMutation.mutate(values.password);
  };

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

        <div className="grid w-full grid-cols-[0.4fr_1fr] gap-2">
          <Link to="/login">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={resetPasswordMutation.isPending}
            >
              Back to Login
            </Button>
          </Link>
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
        </div>
      </form>
    </Form>
  );
};
