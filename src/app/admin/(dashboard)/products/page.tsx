"use client";
import { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { ProductTable } from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { Pagination } from "@/components/ui/Pagination";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchLoading, setBatchLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", page.toString());
      params.set("limit", "20");
      params.set("includeUnpublished", "true");
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Clear selection when page/search changes
  useEffect(() => {
    setSelectedIds(new Set());
  }, [products]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const allSelected = products.length > 0 && products.every((p: any) => selectedIds.has(p.id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p: any) => p.id)));
    }
  };

  const handleBatchAction = async (action: "delete" | "publish" | "unpublish") => {
    if (selectedIds.size === 0) return;

    const confirmMsg =
      action === "delete"
        ? `确定要删除选中的 ${selectedIds.size} 个产品吗？此操作不可恢复。`
        : `确定要${action === "publish" ? "发布" : "取消发布"}选中的 ${selectedIds.size} 个产品吗？`;

    if (!confirm(confirmMsg)) return;

    setBatchLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: Array.from(selectedIds) }),
      });
      if (res.ok) {
        setSelectedIds(new Set());
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.error || "操作失败");
      }
    } catch {
      alert("操作失败");
    } finally {
      setBatchLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.error || "删除失败");
      }
    } catch {
      alert("删除失败");
    }
  };

  return (
    <>
      <AdminHeader title="产品管理" />
      <div className="p-4 md:p-8">
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <a href="/admin/products/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">+ 添加产品</Button>
          </a>
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索产品..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field w-full"
            />
          </div>
        </div>

        {/* Batch Actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 mb-4 px-4 Py-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-600 mr-2">
              已选择 <strong>{selectedIds.size}</strong> 个产品
            </span>
            <Button
              onClick={() => handleBatchAction("publish")}
              disabled={batchLoading}
              className="text-xs !bg-green-600 hover:!bg-green-700 !py-1.5"
            >
              批量发布
            </Button>
            <Button
              onClick={() => handleBatchAction("unpublish")}
              disabled={batchLoading}
              className="text-xs !bg-gray-600 hover:!bg-gray-700 !py-1.5"
            >
              批量取消发布
            </Button>
            <Button
              onClick={() => handleBatchAction("delete")}
              disabled={batchLoading}
              className="text-xs !bg-red-600 hover:!bg-red-700 !py-1.5"
            >
              批量删除
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <Loading />
          ) : (
            <ProductTable
              products={products}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              onDelete={handleDelete}
            />
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </>
  );
}
