import { Header } from "@/features/auth/components/header";
import { Footer } from "@/features/auth/components/footer";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <Header signIn />
      <div className="mx-auto flex max-w-[450px] flex-col items-center justify-center gap-4 text-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Forgot Your Password?</h1>
          <p className="text-muted-foreground text-sm">
            No worries — we’ll send you a secure link to reset your password.
            Just enter your registered email address below.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
      <Footer isForgotPassword />
    </div>
  );
}
