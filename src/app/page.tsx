import { prisma } from "@/lib/prisma";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryNav } from "@/components/home/CategoryNav";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";

export default async function HomePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let categories: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let products: any[] = [];

  try {
    [categories, products] = await Promise.all([
      prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { products: true } } },
      }),
      prisma.product.findMany({
        where: { published: true, featured: true },
        include: { category: true },
        orderBy: { sortOrder: "asc" },
        take: 8,
      }),
    ]);
  } catch {
    // Show empty state on DB error
  }

  return (
    <>
      <HeroBanner />
      <CategoryNav categories={categories} />
      <FeaturedProducts products={products} />
    </>
  );
}
