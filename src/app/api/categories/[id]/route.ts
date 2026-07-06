import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { jsonResponse, errorResponse, slugify } from "@/lib/utils";
import { categorySchema } from "@/lib/validation";

// PUT /api/categories/[id] - Protected
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("未登录", 401);
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = categorySchema.partial().safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "数据校验失败", 400);
    }
    const { name, description, imageUrl, sortOrder } = parsed.data;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("分类不存在", 404);
    }

    let slug = existing.slug;
    if (name && name !== existing.name) {
      slug = slugify(name);
      const conflict = await prisma.category.findFirst({
        where: { slug, id: { not: id } },
      });
      if (conflict) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        slug,
        description: description !== undefined ? description : existing.description,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
        sortOrder: sortOrder !== undefined ? sortOrder : existing.sortOrder,
      },
    });

    return jsonResponse(category);
  } catch {
    return errorResponse("更新分类失败", 500);
  }
}

// DELETE /api/categories/[id] - Protected
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("未登录", 401);
    }

    const { id } = await params;

    // Check if category has products
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });
    if (productCount > 0) {
      return errorResponse("该分类下还有产品，请先删除或移动产品", 400);
    }

    try {
      await prisma.category.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return errorResponse("分类不存在", 404);
      }
      throw error;
    }
    return jsonResponse({ success: true });
  } catch {
    return errorResponse("删除分类失败", 500);
  }
}
