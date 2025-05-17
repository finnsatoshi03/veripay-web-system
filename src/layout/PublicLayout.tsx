import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { displayInfoPerPage } from "@/features/auth/lib/const";

import { useTheme } from "@/components/custom/theme-provider";

import { AuthRightDisplay } from "@/features/auth/components/auth-right-display";

export default function PublicLayout() {
  const { pathname } = useLocation();

  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  const currentPageInfo =
    displayInfoPerPage[pathname as keyof typeof displayInfoPerPage];

  return (
    <main className="text-primary-foreground bg-primary grid h-screen w-screen gap-2 p-2 md:grid-cols-[minmax(350px,0.4fr)_1fr]">
      <AuthRightDisplay
        header={currentPageInfo?.header || ""}
        description={currentPageInfo?.description || ""}
        className="hidden md:block"
      />
      <div className="bg-background h-full w-full rounded-lg p-4 text-black">
        <Outlet />
      </div>
    </main>
  );
}
