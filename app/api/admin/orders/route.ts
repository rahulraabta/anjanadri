export const runtime = 'edge';

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();
    try {
      const orders = await sql`
        SELECT id, user_email, total_amount, status, created_at
        FROM orders
        ORDER BY created_at DESC;
      `;
      return NextResponse.json({ success: true, orders });
    } catch {
      return NextResponse.json({ success: true, orders: [] });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: "orderId and status required" }, { status: 400 });
    }

    const sql = getDb();
    try {
      await sql`
        UPDATE orders SET status = ${status} WHERE id = ${orderId};
      `;
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ success: false, error: "DB update failed" }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
