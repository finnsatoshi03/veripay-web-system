import { Calendar1 } from "lucide-react";

import { formatInitials } from "@/lib/helpers/formatters";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface BirthdayCardProps {
  date: string;
  name: string;
  avatarUrl: string;
}

export const BirthdayCard = ({ date, name, avatarUrl }: BirthdayCardProps) => {
  return (
    <div className="bg-input/80 space-y-2 rounded-md p-2">
      <div className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
        <Calendar1 className="size-4" /> {date}
      </div>
      <div className="flex items-center gap-2">
        <Avatar className="size-12 rounded-md">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="rounded-md">
            {formatInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-3xl font-semibold">{name}</h3>
          <p className="text-muted-foreground text-sm">
            With {name} a happy birthday on{" "}
            <span className="font-semibold">{date}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
