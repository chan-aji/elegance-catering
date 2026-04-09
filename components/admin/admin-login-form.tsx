"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/field";

export function AdminLoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("admin@catring.local");
  const [password, setPassword] = useState("admin12345");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        toast.error("Login gagal. Cek email dan password.");
        return;
      }

      toast.success("Login berhasil.");
      router.push("/admin/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#edf7ea_0%,#d9edd8_100%)] p-4">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">
          Admin Login
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">Masuk ke Dashboard</h1>
        <p className="mt-3 text-sm leading-6 text-ink/60">
          Halaman ini khusus admin. Website customer tetap dipisahkan dari panel pengelolaan.
        </p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <span className="mb-2 block text-sm font-medium text-ink/70">Email</span>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div>
            <span className="mb-2 block text-sm font-medium text-ink/70">Password</span>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Memproses..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
