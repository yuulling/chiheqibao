import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { jsonResponse, errorResponse, slugify } from "@/lib/utils";
import { categorySchema } from "@/lib/validation";

const categoryDeleteSchema = z.object({
  ids: z.array(z.string()).min(1, "至少选择一个分类"),
});

// GET /api/categories - Public
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return jsonResponse(categories);
  } catch {
    return errorResponse("获取分类列表失败", 500);
  }
}

// POST /api/categories - Protected
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("未登录", 401);
    }

    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "数据校验失败", 400);
    }
    const { name, description, imageUrl, sortOrder } = parsed.data;

    let slug = slugify(name);
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        imageUrl: imageUrl || null,
        sortOrder: sortOrder || 0,
      },
    });

    return jsonResponse(category, 201);
  } catch {
    return errorResponse("创建分类失败", 500);
  }
}

// PATCH /api/categories - Protected batch delete
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("未登录", 401);
    }

    const body = await request.json();
    const parsed = categoryDeleteSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "数据校验失败", 400);
    }
    const { ids } = parsed.data;

    // Check which categories have products (can't delete those)
    const categoriesWithProducts = await prisma.category.findMany({
      where: { id: { in: ids } },
      include: { _count: { select: { products: true } } },
    });

    const blocked = categoriesWithProducts.filter((c) => c._count.products > 0);
    if (blocked.length > 0) {
      return errorResponse(
        `以下分类还有产品，无法删除：${blocked.map((c) => c.name).join("、")}`,
        400
      );
    }

    await prisma.category.deleteMany({ where: { id: { in: ids } } });
    return jsonResponse({ success: true, count: ids.length });
  } catch {
    return errorResponse("批量操作失败", 500);
  }
}
