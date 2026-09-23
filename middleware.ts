import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 100;
const CHECKOUT_RATE_LIMIT_MAX = 20;

const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();

function getIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const ip = getIp(request);
  const now = Date.now();
  const isCheckout = pathname.startsWith("/api/checkout");
  const maxRequests = isCheckout ? CHECKOUT_RATE_LIMIT_MAX : RATE_LIMIT_MAX_REQUESTS;
  const key = `${ip}:${pathname.startsWith("/api/checkout") ? "checkout" : "general"}`;

  let record = ipRequestCounts.get(key);

  if (!record || now > record.resetAt) {
    record = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    ipRequestCounts.set(key, record);
  }

  record.count++;

  if (record.count > maxRequests) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many requests, please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(maxRequests),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(maxRequests));
  response.headers.set("X-RateLimit-Remaining", String(Math.max(0, maxRequests - record.count)));
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
