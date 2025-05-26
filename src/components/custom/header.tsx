import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";

import { formatInitials } from "@/lib/helpers/formatters";

import { DateRangePicker } from "@/components/custom/date-range-picker";
import { SingleDatePicker } from "@/components/custom/single-date-picker";
import { ThemeToggle } from "@/components/custom/theme-toggle";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SpotlightSearch } from "@/components/custom/spotlight-search";
import { Badge } from "@/components/ui/badge";

import { useUser } from "@/store/userStore";
import { NotificationsPopover } from "@/features/notifs/components/notifications-popover";
import { useNotificationStats } from "@/features/notifs/mutations/useNotifications";

export const Header = () => {
  const { pathname } = useLocation();
  const { fullName, email, profile, id: userId } = useUser();
  const navigate = useNavigate();

  const isDashboard = pathname.includes("dashboard");
  const isActiveEmployeePage = pathname.includes("/hr/active-employee");

  // Get notification stats for badge
  const { data: notificationStats } = useNotificationStats(userId || 0);

  const userData = {
    name: fullName || "User",
    email: email || "",
    image: profile?.profile_image || "",
  };

  return (
    <div className="flex items-center justify-between p-4">
      {isDashboard ? (
        <div className="flex items-center gap-2">
          <Avatar className="size-10">
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

      <div className="flex items-center gap-2">
        {isDashboard && <SpotlightSearch />}

        {/* Conditionally render date pickers based on route */}
        {isActiveEmployeePage ? <SingleDatePicker /> : <DateRangePicker />}

        <ThemeToggle />

        {/* Notifications */}
        {userId && (
          <NotificationsPopover
            userId={userId}
            trigger={
              <button
                aria-label="Notifications"
                className="relative cursor-pointer"
              >
                <Bell className="size-6" />
                {notificationStats && notificationStats.unread > 0 && (
                  <Badge
                    className="absolute -top-1 -right-0.5 flex size-5 h-fit w-fit items-center justify-center rounded-full bg-red-600 px-0.5 py-0 text-xs text-white"
                    // variant="destructive"
                  >
                    {notificationStats.unread > 9
                      ? "9+"
                      : notificationStats.unread}
                  </Badge>
                )}
              </button>
            }
          />
        )}
      </div>
    </div>
  );
};
