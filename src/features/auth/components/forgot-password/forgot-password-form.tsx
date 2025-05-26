import { Link } from "react-router-dom";
import { z } from "zod";
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
import { useForgotPassword } from "@/features/auth/mutations/forgot-password-service";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const ForgotPasswordForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = (values: FormValues) => {
    forgotPasswordMutation.mutate(values.email);
  };

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
                  disabled={forgotPasswordMutation.isPending}
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
              disabled={forgotPasswordMutation.isPending}
            >
              Back to Login
            </Button>
          </Link>
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending
              ? "Sending..."
              : "Send Reset Link"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
