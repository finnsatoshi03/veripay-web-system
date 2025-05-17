import { Header } from "@/features/auth/components/header";
import { Footer } from "@/features/auth/components/footer";
import { ResetPasswordForm } from "@/features/auth/components/reset-password/reset-password";

export default function ResetPasswordPage() {
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <Header signUp />
      <div className="mx-auto flex max-w-[450px] flex-col items-center justify-center gap-4 text-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Reset Your Password</h1>
          <p className="text-muted-foreground text-sm">
            Enter a new password for your Veripay account. Make sure it’s strong
            and something only you would know.
          </p>
        </div>
        <ResetPasswordForm />
      </div>
      <Footer />
    </div>
  );
}
