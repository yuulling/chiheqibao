"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string | null;
  specs: string;
  price: number | null;
  unit: string;
  coverImage: string | null;
  images: string;
  featured: boolean;
  published: boolean;
  categoryId: string | null;
  sortOrder: number;
}

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    specs: product?.specs || "[]",
    price: product?.price?.toString() || "",
    unit: product?.unit || "台",
    categoryId: product?.categoryId || "",
    coverImage: product?.coverImage || "",
    images: product?.images || "[]",
    featured: product?.featured || false,
    published: product?.published !== false,
    sortOrder: product?.sortOrder?.toString() || "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/products/${product!.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.price ? parseFloat(form.price) : null,
          sortOrder: parseInt(form.sortOrder) || 0,
        }),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
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
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <Input
          label="产品名称 *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          placeholder="例如：双柱举升机 S-30A"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="价格 (¥)"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="0.00"
            step="0.01"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">单位</label>
            <select
              className="input-field"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            >
              <option value="台">台</option>
              <option value="套">套</option>
              <option value="个">个</option>
              <option value="件">件</option>
              <option value="组">组</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
            <select
              className="input-field"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">无分类</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <Input
            label="排序"
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
          />
        </div>

        <ImageUpload
          currentImage={form.coverImage || undefined}
          onUpload={(url) => setForm({ ...form, coverImage: url })}
        />

        <Textarea
          label="产品描述"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="输入产品描述..."
          rows={4}
        />

        <Textarea
          label="规格参数 (JSON数组)"
          value={form.specs}
          onChange={(e) => setForm({ ...form, specs: e.target.value })}
          placeholder='[{"label":"举升重量","value":"3.0吨"}]'
          rows={4}
        />

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="text-sm text-gray-700">已发布</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="text-sm text-gray-700">首页推荐</span>
          </label>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button type="submit" disabled={loading}>
          {loading ? "保存中..." : isEdit ? "更新产品" : "创建产品"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  );
}
