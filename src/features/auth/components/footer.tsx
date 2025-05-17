import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div className="flex w-full justify-end">
      <div className="flex gap-6">
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/support">Support</Link>
      </div>
    </div>
  );
};
