import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export interface SessionData {
  userId?: string;
  username?: string;
  isLoggedIn: boolean;
  sessionToken?: string;
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
  if (!session.isLoggedIn || !session.userId || !session.sessionToken) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, username: true, sessionToken: true },
  });
  // 会话 token 与数据库不一致（被新登录挤掉或已登出）→ 视为无效
  if (!user || user.sessionToken !== session.sessionToken) {
    return null;
  }
  return {
    id: user.id,
    username: user.username,
  };
}
