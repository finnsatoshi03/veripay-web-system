import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  className?: string;
  size?: "default" | "sm";
}

export const Search = ({
  className,
  size = "default",
  ...props
}: SearchProps) => {
  const sizes = {
    default: "h-9 pl-9 md:w-[200px] lg:w-[300px]",
    sm: "h-8 pl-8 md:w-[200px] lg:w-[250px]",
  };

  return (
    <div className={cn("relative", className)}>
      <SearchIcon
        className={cn(
          "text-muted-foreground absolute h-4 w-4",
          sizes[size] === "default" ? "top-2.5 left-2.5" : "top-2 left-2",
        )}
      />
      <Input
        type="search"
        placeholder="Search..."
        className={cn(sizes[size], className)}
        {...props}
      />
    </div>
  );
};
