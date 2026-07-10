"use client";
import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchLoading, setBatchLoading] = useState(false);

  const fetchCategories = () => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  // Clear selection when categories change
  useEffect(() => {
    setSelectedIds(new Set());
  }, [categories]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const allSelected = categories.length > 0 && categories.every((c) => selectedIds.has(c.id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(categories.map((c) => c.id)));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 个分类吗？`)) return;

    setBatchLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      if (res.ok) {
        setSelectedIds(new Set());
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || "删除失败");
      }
    } catch {
      alert("删除失败");
    } finally {
      setBatchLoading(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditing(cat);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || "删除失败");
      }
    } catch {
      alert("删除失败");
    }
  };

  const handleSaved = () => {
    setModalOpen(false);
    setEditing(null);
    fetchCategories();
  };

  const allSelected = categories.length > 0 && categories.every((c) => selectedIds.has(c.id));

  return (
    <>
      <AdminHeader title="分类管理" />
      <div className="p-4 md:p-8">
        <div className="mb-6">
          <Button onClick={() => { setEditing(null); setModalOpen(true); }}>+ 添加分类</Button>
        </div>

        {/* Batch Actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-600 mr-2">
              已选择 <strong>{selectedIds.size}</strong> 个分类
            </span>
            <Button
              onClick={handleBatchDelete}
              disabled={batchLoading}
              className="text-xs !bg-red-600 hover:!bg-red-700 !py-1.5"
            >
              批量删除
            </Button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm min-w-[540px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-10 py-3 px-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">名称</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Slug</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500">产品数</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500">排序</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(cat.id)}
                      onChange={() => toggleSelect(cat.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{cat.name}</td>
                  <td className="py-3 px-4 text-gray-500">{cat.slug}</td>
                  <td className="py-3 px-4 text-center text-gray-500">{cat._count?.products || 0}</td>
                  <td className="py-3 px-4 text-center text-gray-500">{cat.sortOrder}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleEdit(cat)} className="text-primary-600 hover:text-primary-800 mr-3">编辑</button>
                    <button onClick={() => { if (confirm("确定删除？")) handleDelete(cat.id); }} className="text-red-500 hover:text-red-700">删除</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && !loading && (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400">暂无分类</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          title={editing ? "编辑分类" : "添加分类"}
        >
          <CategoryForm
            category={editing || undefined}
            onSave={handleSaved}
            onCancel={() => { setModalOpen(false); setEditing(null); }}
          />
        </Modal>
      </div>
    </>
  );
}
