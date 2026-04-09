import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrder } from "@/lib/data";

const schema = z.object({
  customerName: z.string().min(2),
  whatsapp: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional().nullable(),
  deliveryDate: z.string().min(1),
  deliveryTime: z.string().min(1),
  note: z.string().optional().nullable(),
  deliveryMethod: z.enum(["DELIVERY", "PICKUP"]),
  items: z.array(
    z.object({
      menuItemId: z.string().min(1),
      quantity: z.number().min(1),
      note: z.string().optional().nullable()
    })
  )
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const result = await createOrder(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Gagal membuat order."
      },
      { status: 400 }
    );
  }
}
