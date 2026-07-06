"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { PageLoading } from "@/components/ui/Loading";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  specs: string;
  price: number | null;
  unit: string;
  coverImage: string | null;
  images: string;
  category: { id: string; name: string; slug: string } | null;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError("产品不存在"); setProduct(null); } else { setProduct(data); }
      })
      .catch(() => setError("网络错误，请稍后重试"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <PageLoading />;
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className={error ? "text-red-500" : "text-gray-400"}>
          <div className="text-5xl mb-4">{error ? "⚠" : "📦"}</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "产品不存在"}
          </h1>
          <p className="text-gray-500 mb-4">
            {error ? "请检查网络连接后重试" : "该产品可能已下架或不存在"}
          </p>
          <Link href="/products" className="btn-primary">返回产品列表</Link>
        </div>
      </div>
    );
  }

  const imageList = (() => {
    try { return JSON.parse(product.images); } catch { return []; }
  })();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-primary-600">首页</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600">产品中心</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary-600">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <ProductGallery coverImage={product.coverImage} images={imageList} productName={product.name} />

        {/* Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          {product.category && (
            <Link
              href={`/products?category=${product.category.slug}`}
              className="inline-block text-sm text-accent-500 bg-accent-50 px-3 py-1 rounded-full mb-4 hover:bg-accent-100"
            >
              {product.category.name}
            </Link>
          )}

          {product.price !== null && product.price !== undefined && (
            <div className="mb-6">
              <span className="text-3xl font-bold text-accent-500">
                ¥{product.price.toLocaleString()}
              </span>
              <span className="text-gray-500 ml-2">/ {product.unit}</span>
            </div>
          )}

          {product.description && (
            <div className="prose prose-gray max-w-none mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">产品描述</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {/* Contact CTA */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">对该产品感兴趣？</h3>
            <p className="text-sm text-gray-500 mb-4">欢迎联系我们了解更多产品详情和价格信息</p>
            <Link href="/contact" className="btn-primary inline-flex items-center text-sm">
              联系我们
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Specs */}
      {product.specs && (
        <div className="mt-12 max-w-3xl">
          <ProductSpecs specs={product.specs} />
        </div>
      )}
    </div>
  );
}
