import { Header } from "@/features/auth/components/header";
import { Footer } from "@/features/auth/components/footer";
import { RegisterForm } from "@/features/auth/components/register/register-form";

export default function RegisterPage() {
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <Header signUp />
      <div className="mx-auto flex max-w-[450px] flex-col items-center justify-center gap-4 text-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Request Access to Veripay</h1>
          <p className="text-muted-foreground text-sm">
            Join your team on Veripay to access your payslips, attendance logs,
            and leave requests — all in one place.
          </p>
        </div>
        <RegisterForm />
      </div>
      <Footer />
    </div>
  );
}
