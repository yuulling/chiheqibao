import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { jsonResponse, errorResponse, slugify } from "@/lib/utils";
import { productCreateSchema, batchActionSchema } from "@/lib/validation";

// GET /api/products - Public
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const includeUnpublished = searchParams.get("includeUnpublished") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "12") || 12));

    const where: Record<string, unknown> = includeUnpublished ? {} : { published: true };

    if (category) {
      where.category = { slug: category };
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (featured === "true") {
      where.featured = true;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { sortOrder: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return jsonResponse({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return errorResponse("获取产品列表失败", 500);
  }
}

// POST /api/products - Protected
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("未登录", 401);
    }

    const body = await request.json();
    const parsed = productCreateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "数据校验失败", 400);
    }
    const { name, description, specs, price, unit, categoryId, coverImage, images, featured, published, sortOrder } = parsed.data;

    if (!name) {
      return errorResponse("产品名称不能为空", 400);
    }

    // Generate unique slug
    let slug = slugify(name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        specs: specs || "[]",
        price: price || null,
        unit: unit || "台",
        categoryId: categoryId || null,
        coverImage: coverImage || null,
        images: images || "[]",
        featured: featured || false,
        published: published !== false,
        sortOrder: sortOrder || 0,
      },
      include: { category: true },
    });

    return jsonResponse(product, 201);
  } catch (error) {
    console.error("Create product error:", error);
    return errorResponse("创建产品失败", 500);
  }
}

// PATCH /api/products - Protected batch actions
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("未登录", 401);
    }

    const body = await request.json();
    const parsed = batchActionSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "数据校验失败", 400);
    }
    const { action, ids } = parsed.data;

    if (action === "delete") {
      await prisma.product.deleteMany({ where: { id: { in: ids } } });
      return jsonResponse({ success: true, count: ids.length });
    }

    if (action === "publish") {
      await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { published: true },
      });
      return jsonResponse({ success: true, count: ids.length });
    }

    if (action === "unpublish") {
      await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { published: false },
      });
      return jsonResponse({ success: true, count: ids.length });
    }

    return errorResponse("未知操作", 400);
  } catch (error) {
    console.error("Batch action error:", error);
    return errorResponse("批量操作失败", 500);
  }
}
