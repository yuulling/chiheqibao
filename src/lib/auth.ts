import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  userId?: string;
  username?: string;
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || (() => { throw new Error("SESSION_SECRET environment variable is required"); })(),
  cookieName: "qibao-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    // 生产环境让 cookie 在 www 和非 www 域名下都生效，避免重定向后丢失登录态
    ...(process.env.NODE_ENV === "production" ? { domain: ".chiheqb.top" } : {}),
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  // Initialize session if empty
  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }

  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId) {
    return null;
  }
  return {
    id: session.userId,
    username: session.username || "",
  };
}
