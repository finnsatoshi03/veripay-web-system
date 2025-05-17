import { Link } from "react-router-dom";
import { Logo } from "@/components/custom/logo";

export const Header = ({
  signIn = false,
  signUp = false,
}: {
  signIn?: boolean;
  signUp?: boolean;
}) => {
  return (
    <div className="flex w-full items-center justify-between">
      <Logo />
      {signIn && (
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="hover:underline">
            Sign up
          </Link>
        </p>
      )}
      {signUp && (
        <p>
          Already have an account?{" "}
          <Link to="/login" className="hover:underline">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
};
