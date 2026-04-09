import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { updateSettings } from "@/lib/data";

export async function PATCH(request: Request) {
  await requireAdmin();
  const body = await request.json();
  return NextResponse.json(await updateSettings(body));
}
