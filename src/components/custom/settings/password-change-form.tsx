import { useState } from "react";
import { z } from "zod";
import { Eye, EyeOff, Shield, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useChangePassword } from "@/features/auth/mutations/change-password-service";
import { useUser } from "@/store/userStore";

const formSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required.",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export const PasswordChangeForm = () => {
  const { identity_id: userId } = useUser();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useChangePassword();

  const handleSubmit = (values: FormValues) => {
    changePasswordMutation.mutate({
      newPassword: values.newPassword,
      currentPassword: values.currentPassword,
      userId: userId!,
    });

    // Reset form on success
    if (!changePasswordMutation.isError) {
      form.reset();
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-blue-100 p-2">
          <Shield className="size-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Security Settings</h2>
          <p className="text-muted-foreground text-sm">
            Manage your password and security preferences
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="size-4" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure. Make sure it's
            strong and unique.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Current Password</FormLabel>
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-xs"
                        tabIndex={0}
                        aria-label={
                          showCurrentPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          togglePasswordVisibility("current")
                        }
                      >
                        {showCurrentPassword ? (
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
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter your current password"
                        {...field}
                        disabled={changePasswordMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>New Password</FormLabel>
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-xs"
                        tabIndex={0}
                        aria-label={
                          showNewPassword ? "Hide password" : "Show password"
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && togglePasswordVisibility("new")
                        }
                      >
                        {showNewPassword ? (
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
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Minimum of 8 characters"
                        {...field}
                        disabled={changePasswordMutation.isPending}
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
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-xs"
                        tabIndex={0}
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          togglePasswordVisibility("confirm")
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
                        placeholder="Confirm your new password"
                        {...field}
                        disabled={changePasswordMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="min-w-32"
                >
                  {changePasswordMutation.isPending
                    ? "Updating..."
                    : "Update Password"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
