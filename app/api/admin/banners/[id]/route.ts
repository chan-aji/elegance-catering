import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deleteBanner, updateBanner } from "@/lib/data";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json();
  return NextResponse.json(await updateBanner(id, body));
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await params;
  await deleteBanner(id);
  return NextResponse.json({ ok: true });
}
