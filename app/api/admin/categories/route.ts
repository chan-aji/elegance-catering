import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createCategory } from "@/lib/data";

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json();
  return NextResponse.json(await createCategory(body));
}
