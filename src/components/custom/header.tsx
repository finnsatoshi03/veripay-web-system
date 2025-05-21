import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";

import { formatInitials } from "@/lib/helpers/formatters";

import { DateRangePicker } from "@/components/custom/date-range-picker";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/custom/search";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isDashboard = pathname.includes("dashboard");

  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    image: "https://github.com/shadcn.png",
  };

  return (
    <div className="flex items-center justify-between p-4">
      {isDashboard ? (
        <div className="flex items-center gap-2">
          <Avatar className="size-10 rounded-lg">
            <AvatarImage src={userData.image} />
            <AvatarFallback>{formatInitials(userData.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg leading-none font-semibold">
              {userData.name}
            </h1>
            <p className="text-muted-foreground text-xs">
              Welcome back to Veripay! 👋
            </p>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      )}

      <div className="flex items-center gap-4">
        {isDashboard && <Search />}
        <DateRangePicker />
        <div aria-label="Notifications" className="relative size-6">
          <Bell className="size-6" />
          <Badge
            className="absolute -top-1.5 -right-1.5 h-fit w-fit p-px"
            variant="destructive"
          >
            9+
          </Badge>
        </div>
      </div>
    </div>
  );
};
