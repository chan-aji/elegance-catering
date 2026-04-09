"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 rounded-full border border-white/14 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
