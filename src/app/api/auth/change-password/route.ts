import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/utils";
import { changePasswordSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse("未登录", 401);
    }

    const body = await request.json();
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "数据校验失败", 400);
    }
    const { oldPassword, newPassword } = parsed.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
    });

    if (!user) {
      return errorResponse("用户不存在", 404);
    }

    // Verify old password
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      return errorResponse("当前密码不正确", 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return jsonResponse({ success: true, message: "密码修改成功" });
  } catch {
    return errorResponse("修改密码失败", 500);
  }
}
