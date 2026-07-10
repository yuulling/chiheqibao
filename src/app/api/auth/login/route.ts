import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/utils";
import { loginSchema } from "@/lib/validation";

// Simple in-memory rate limiter
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000; // 1 minute

// Clean up stale entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of Array.from(loginAttempts)) {
    if (val.lockedUntil < now) loginAttempts.delete(key);
  }
}, 5 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "请输入用户名和密码", 400);
    }
    const { username, password } = parsed.data;

    // Rate limit check (by username)
    const attemptKey = `login_${username.toLowerCase()}`;
    const attempt = loginAttempts.get(attemptKey);
    if (attempt && attempt.count >= MAX_ATTEMPTS && attempt.lockedUntil > Date.now()) {
      const remaining = Math.ceil((attempt.lockedUntil - Date.now()) / 1000);
      return errorResponse(`登录尝试过多，请 ${remaining} 秒后再试`, 429);
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      recordFailedAttempt(attemptKey);
      return errorResponse("用户名或密码错误", 401);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      recordFailedAttempt(attemptKey);
      return errorResponse("用户名或密码错误", 401);
    }

    // Successful login — clear attempts
    loginAttempts.delete(attemptKey);

    // 生成唯一会话 token（实现单管理员登录：新登录会使旧会话失效）
    const sessionToken = randomUUID();
    await prisma.user.update({
      where: { id: user.id },
      data: { sessionToken },
    });

    const session = await getSession();
    session.userId = user.id;
    session.username = user.username;
    session.sessionToken = sessionToken;
    session.isLoggedIn = true;
    await session.save();

    return jsonResponse({
      success: true,
      user: { id: user.id, username: user.username },
    });
  } catch {
    return errorResponse("登录失败", 500);
  }
}

function recordFailedAttempt(key: string) {
  const entry = loginAttempts.get(key) || { count: 0, lockedUntil: 0 };
  entry.count++;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
  }
  loginAttempts.set(key, entry);
}
