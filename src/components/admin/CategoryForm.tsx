"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Category {
  id: string;
  name: string;
  slug?: string;
  description: string | null;
  sortOrder: number;
}

interface CategoryFormProps {
  category?: Category;
  onSave: () => void;
  onCancel: () => void;
}

export function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
  const isEdit = !!category;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
    sortOrder: category?.sortOrder?.toString() || "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/categories/${category!.id}` : "/api/categories";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sortOrder: parseInt(form.sortOrder) || 0,
        }),
      });

      if (res.ok) {
        onSave();
      } else {
        const data = await res.json();
        alert(data.error || "保存失败");
      }
    } catch {
      alert("保存失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="分类名称 *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        placeholder="例如：举升机"
      />
      <Input
        label="描述"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="简短描述"
      />
      <Input
        label="排序"
        type="number"
        value={form.sortOrder}
        onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
      />
      <div className="flex gap-3 mt-4">
        <Button type="submit" disabled={loading} size="sm">
          {loading ? "保存中..." : isEdit ? "更新" : "创建"}
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          取消
        </Button>
      </div>
    </form>
  );
}
