import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  unit: string;
  coverImage: string | null;
  category: { name: string; slug: string } | null;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="card overflow-hidden group block">
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        {product.coverImage ? (
          <img
            src={product.coverImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
            <svg className="w-12 h-12 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">暂无图片</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {product.category && (
          <span className="inline-block text-xs text-accent-500 bg-accent-50 px-2 py-0.5 rounded-full mb-2">
            {product.category.name}
          </span>
        )}
        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {product.description || "暂无描述"}
        </p>
        {product.price !== null && product.price !== undefined && (
          <span className="text-accent-500 font-bold text-lg">
            ¥{product.price.toLocaleString()} <span className="text-sm text-gray-400 font-normal">/ {product.unit}</span>
          </span>
        )}
      </div>
    </Link>
  );
}
