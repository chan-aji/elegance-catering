import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getSession } from "@/lib/auth";

export default async function AdminEntryPage() {
  const session = await getSession();

  if (session) {
    redirect("/admin/dashboard");
  }

  return <AdminLoginForm />;
}
