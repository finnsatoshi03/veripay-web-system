import { FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";

import { Header } from "@/features/auth/components/header";
import { Footer } from "@/features/auth/components/footer";
import { LoginForm } from "@/features/auth/components/login/login-form";

export default function LoginPage() {
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <Header signIn />
      <div className="mx-auto flex max-w-[450px] flex-col items-center justify-center gap-4 text-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Welcome back to Veripay</h1>
          <p className="text-muted-foreground text-sm">
            Manage your payroll, track attendance, and streamline HR tasks — all
            in one secure platform.
          </p>
        </div>
        <Button variant="outline" className="w-full">
          <FaGoogle />
          Continue with Google
        </Button>
        <div className="flex w-full items-center gap-2">
          <div className="bg-muted-foreground h-px w-full" />
          <span className="text-muted-foreground mb-1 text-sm">or</span>
          <div className="bg-muted-foreground h-px w-full" />
        </div>
        <LoginForm />
      </div>
      <Footer />
    </div>
  );
}
