import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";

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
import { useForgotPassword } from "@/features/auth/mutations/forgot-password-service";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const ForgotPasswordForm = () => {
  const [isTimeoutActive, setIsTimeoutActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useForgotPassword();

  // Timer effect for countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimeoutActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setIsTimeoutActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimeoutActive, remainingTime]);

  const handleSubmit = (values: FormValues) => {
    forgotPasswordMutation.mutate(values.email, {
      onSuccess: () => {
        // Start 3-minute timeout (180 seconds)
        setIsTimeoutActive(true);
        setRemainingTime(180);
      },
    });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const isFormDisabled = forgotPasswordMutation.isPending || isTimeoutActive;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@email.com"
                  {...field}
                  disabled={isFormDisabled}
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
              disabled={isFormDisabled}
            >
              Back to Login
            </Button>
          </Link>
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={isFormDisabled}
          >
            {forgotPasswordMutation.isPending
              ? "Sending..."
              : isTimeoutActive
                ? `Resend in (${formatTime(remainingTime)})`
                : "Send Reset Link"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
