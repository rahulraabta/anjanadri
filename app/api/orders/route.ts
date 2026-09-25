import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });
    }

    const sql = getDb();

    try {
      const orders = await sql`
        SELECT id, total_amount, status, created_at
        FROM orders
        WHERE user_email = ${email}
        ORDER BY created_at DESC;
      `;

      const ordersWithItems = [];
      for (const order of orders) {
        const items = await sql`
          SELECT product_id, quantity, price_at_purchase
          FROM order_items
          WHERE order_id = ${order.id};
        `;
        ordersWithItems.push({ ...order, items });
      }

      return NextResponse.json({ success: true, orders: ordersWithItems });
    } catch {
      return NextResponse.json({ success: true, orders: [] });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
