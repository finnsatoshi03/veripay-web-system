import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <main className="flex h-screen w-screen flex-col">
      <Outlet />
    </main>
  );
}
