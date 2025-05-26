import { Header } from "@/features/auth/components/header";
import { Footer } from "@/features/auth/components/footer";
import { EmailVerificationHandler } from "./components/email-verification/email-verification-handler";

export default function VerifyEmailPage() {
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <Header signIn />
      <div className="mx-auto flex max-w-[450px] flex-col items-center justify-center gap-4 text-center">
        <EmailVerificationHandler />
      </div>
      <Footer />
    </div>
  );
}
