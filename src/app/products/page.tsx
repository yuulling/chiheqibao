"use client";
import { useState, useEffect, useCallback } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/ui/Pagination";
import { Loading } from "@/components/ui/Loading";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set("category", selectedCategory);
      if (search) params.set("search", search);
      params.set("page", page.toString());
      params.set("limit", "12");

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "获取产品列表失败");
        setProducts([]);
        return;
      }
      setProducts(data.products || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      setError("网络错误，请检查连接后重试");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, search]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">产品中心</h1>
        <p className="text-gray-500">浏览我们的汽保设备产品</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="搜索产品..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field"
          />
        </div>
        <div>
          <select
            className="input-field min-w-[160px]"
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
          >
            <option value="">全部分类</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products */}
      {loading ? <Loading /> : error ? (
        <div className="text-center py-16">
          <div className="text-red-500 text-5xl mb-4">⚠</div>
          <p className="text-gray-500">{error}</p>
          <button
            onClick={() => fetchProducts()}
            className="btn-primary mt-4 text-sm"
          >
            重试
          </button>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
