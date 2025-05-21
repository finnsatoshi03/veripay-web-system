import { cn } from "@/lib/utils";

export const AuthRightDisplay = ({
  header,
  description,
  className,
}: {
  header?: string;
  description?: string;
  className?: string;
}) => {
  return (
    <div className={cn("relative h-full w-full object-cover", className)}>
      <div
        className="from-primary via-primary/50 to-secondary/66 h-full w-full rounded-lg bg-gradient-to-br"
        style={{
          backgroundImage:
            "linear-gradient(200deg, var(--secondary) 0%, var(--primary) 66%)",
        }}
      ></div>
      <div className="absolute bottom-10 left-1/2 w-full -translate-x-1/2">
        <div className="flex w-full flex-col items-center gap-2 p-4">
          <img
            src="/icons/brand-logo-dark.png"
            alt="veripay-logo"
            className="size-12"
          />
          <div className="text-center">
            <h1 className="text-3xl font-bold">{header}</h1>
            <p className="px-4 text-sm">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
