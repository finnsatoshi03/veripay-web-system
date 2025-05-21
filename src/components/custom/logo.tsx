import { useTheme } from "./theme-provider";

export const Logo = () => {
  const { theme } = useTheme();

  return (
    <div className="flex items-center gap-1">
      <img
        src={
          theme === "dark"
            ? "/icons/brand-logo-dark.png"
            : "/icons/brand-logo.png"
        }
        alt="veripay-logo"
        className="size-6"
      />
      <span className="font-logo text-xl font-semibold">Veripay</span>
    </div>
  );
};
