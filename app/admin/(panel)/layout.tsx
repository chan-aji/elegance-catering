import { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";

export default async function AdminPanelLayout({
  children
}: {
  children: ReactNode;
}) {
  await requireAdmin();
  return children;
}
