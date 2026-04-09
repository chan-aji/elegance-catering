import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createMenuItem } from "@/lib/data";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    return NextResponse.json(await createMenuItem(body));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan menu.";
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as { status?: unknown }).status === "number"
        ? ((error as { status: number }).status)
        : 500;
    const userMessage =
      typeof error === "object" &&
      error !== null &&
      "userMessage" in error &&
      typeof (error as { userMessage?: unknown }).userMessage === "string"
        ? ((error as { userMessage: string }).userMessage)
        : "Gagal menyimpan menu.";

    console.error("Admin create menu error", {
      status,
      message
    });

    return NextResponse.json({ error: userMessage }, { status });
  }
}
