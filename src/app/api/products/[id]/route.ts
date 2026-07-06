import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { jsonResponse, errorResponse, slugify } from "@/lib/utils";
import { productUpdateSchema } from "@/lib/validation";

// GET /api/products/[id] - Public
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        published: true,
      },
      include: { category: true },
    });

    if (!product) {
      return errorResponse("产品不存在", 404);
    }

    return jsonResponse(product);
  } catch {
    return errorResponse("获取产品详情失败", 500);
  }
}

// PUT /api/products/[id] - Protected
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
    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "数据校验失败", 400);
    }
    const { name, description, specs, price, unit, categoryId, coverImage, images, featured, published, sortOrder } = parsed.data;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("产品不存在", 404);
    }

    // Update slug if name changed
    let slug = existing.slug;
    if (name && name !== existing.name) {
      slug = slugify(name);
      const conflict = await prisma.product.findFirst({
        where: { slug, id: { not: id } },
      });
      if (conflict) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        slug,
        description: description !== undefined ? description : existing.description,
        specs: specs !== undefined ? specs : existing.specs,
        price: price !== undefined ? price : existing.price,
        unit: unit !== undefined ? unit : existing.unit,
        categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
        coverImage: coverImage !== undefined ? coverImage : existing.coverImage,
        images: images !== undefined ? images : existing.images,
        featured: featured !== undefined ? featured : existing.featured,
        published: published !== undefined ? published : existing.published,
        sortOrder: sortOrder !== undefined ? sortOrder : existing.sortOrder,
      },
      include: { category: true },
    });

    return jsonResponse(product);
  } catch (error) {
    console.error("Update product error:", error);
    return errorResponse("更新产品失败", 500);
  }
}

// DELETE /api/products/[id] - Protected
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
    try {
      await prisma.product.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return errorResponse("产品不存在", 404);
      }
      throw error;
    }
    return jsonResponse({ success: true });
  } catch {
    return errorResponse("删除产品失败", 500);
  }
}
