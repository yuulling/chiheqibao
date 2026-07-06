import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";

async function getSession(request: NextRequest) {
  const response = NextResponse.next();
  return getIronSession<SessionData>(request, response, sessionOptions);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Protect /admin/* routes (except login page)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = await getSession(request);
    if (!session.isLoggedIn) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin API routes — non-GET methods require auth
  const protectedApiPatterns = [
    { prefix: "/api/products", methods: ["POST", "PUT", "DELETE"] },
    { prefix: "/api/categories", methods: ["POST", "PUT", "DELETE"] },
    { prefix: "/api/upload", methods: ["POST"] },
    { prefix: "/api/settings", methods: ["PUT"] },
  ];

  for (const { prefix, methods } of protectedApiPatterns) {
    if (pathname.startsWith(prefix) && methods.includes(method)) {
      const session = await getSession(request);
      if (!session.isLoggedIn) {
        return NextResponse.json({ error: "未登录" }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
