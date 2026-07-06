"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageLoading } from "@/components/ui/Loading";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${id}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([productData, categoriesData]) => {
      setProduct(productData);
      setCategories(categoriesData || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoading />;

  return (
    <>
      <AdminHeader title="编辑产品" />
      <div className="p-4 md:p-8">
        {product ? (
          <ProductForm product={product} categories={categories} />
        ) : (
          <p>产品不存在</p>
        )}
      </div>
    </>
  );
}
