"use client";
import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data || []))
      .catch(() => {});
  }, []);

  return (
    <>
      <AdminHeader title="添加产品" />
      <div className="p-4 md:p-8">
        <ProductForm categories={categories} />
      </div>
    </>
  );
}
