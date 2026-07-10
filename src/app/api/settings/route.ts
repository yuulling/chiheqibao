import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/utils";
import { settingsKeys } from "@/lib/validation";

// GET /api/settings - Public
export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return jsonResponse(result);
  } catch {
    return errorResponse("获取设置失败", 500);
  }
}

// PUT /api/settings - Protected
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("未登录", 401);
    }

    const body = await request.json();
    const allowedKeys = new Set(settingsKeys);

    for (const [key, value] of Object.entries(body)) {
      if (!allowedKeys.has(key as typeof settingsKeys[number])) {
        continue; // skip unknown keys
      }
      if (typeof value === "string") {
        await prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Settings update error:", error);
    return errorResponse("更新设置失败", 500);
  }
}
