import { Calendar1 } from "lucide-react";

import { formatInitials } from "@/lib/helpers/formatters";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface AnnouncementCardProps {
  target: string;
  date: string;
  title: string;
  author: string;
  department: string;
  content: string;
}

export const AnnouncementCard = ({
  target,
  date,
  title,
  author,
  department,
  content,
}: AnnouncementCardProps) => {
  return (
    <div className="bg-input/80 space-y-2 rounded-md p-2">
      <div className="flex items-center gap-2">
        <Badge>{target}</Badge>
        <div className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
          <Calendar1 className="size-4" /> {date}
        </div>
      </div>
      <h3 className="text-4xl font-semibold">{title}</h3>
      <div className="flex items-center gap-2">
        <Avatar className="size-6 rounded-md">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback className="rounded-md">
            {formatInitials(author)}
          </AvatarFallback>
        </Avatar>
        <p className="text-muted-foreground text-sm">{department}</p>
      </div>
      <p className="text-muted-foreground text-sm">{content}</p>
    </div>
  );
};
