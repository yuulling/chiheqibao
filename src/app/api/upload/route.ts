import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { saveFile, ALLOWED_TYPES, MAX_FILE_SIZE } from "@/lib/upload";
import { jsonResponse, errorResponse } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("未登录", 401);
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return errorResponse("请选择文件", 400);
    }

    if (file.size === 0) {
      return errorResponse("不能上传空文件", 400);
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse("不支持的文件类型，请上传 JPG/PNG/GIF/WebP 图片", 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return errorResponse("文件大小不能超过 5MB", 400);
    }

    const url = await saveFile(file);
    return jsonResponse({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return errorResponse("上传失败", 500);
  }
}
