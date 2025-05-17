import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Search = ({ className, ...props }: SearchProps) => {
  return (
    <div className={cn("relative", className)}>
      <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
      <Input
        type="search"
        placeholder="Search..."
        className="h-9 pl-9 md:w-[200px] lg:w-[300px]"
        {...props}
      />
    </div>
  );
};
