import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });
    }

    const sql = getDb();
    const customerId = `cust_${Date.now().toString(36)}`;

    try {
      await sql`
        INSERT INTO customers (id, email, name)
        VALUES (${customerId}, ${email}, ${name || ""})
        ON CONFLICT (email) DO NOTHING;
      `;
    } catch {
    }

    const response = NextResponse.json({ success: true, email, name: name || "" });
    response.cookies.set("anjanadri_session", JSON.stringify({ email, name: name || "" }), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Sign-in failed" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("anjanadri_session", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  return response;
}
