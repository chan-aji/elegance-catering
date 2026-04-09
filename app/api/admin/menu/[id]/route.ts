import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deleteMenuItem, updateMenuItem } from "@/lib/data";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    return NextResponse.json(await updateMenuItem(id, body));
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

    console.error("Admin update menu error", {
      status,
      message
    });

    return NextResponse.json({ error: userMessage }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await params;
  await deleteMenuItem(id);
  return NextResponse.json({ ok: true });
}
