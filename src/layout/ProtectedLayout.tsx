import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  return (
    <main className="flex h-screen w-screen flex-col">
      <Outlet />
    </main>
  );
}
