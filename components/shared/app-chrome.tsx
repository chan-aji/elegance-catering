"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CartDrawer } from "@/components/site/cart-drawer";
import { ToasterProvider } from "@/components/shared/toaster-provider";

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {children}
      {!isAdminRoute ? <CartDrawer /> : null}
      <ToasterProvider />
    </>
  );
}
