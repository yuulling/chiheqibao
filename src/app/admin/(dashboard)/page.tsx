"use client";
import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { Loading } from "@/components/ui/Loading";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, categories: 0, published: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/products?limit=1&includeUnpublished=true").then((r) => r.json()),
      fetch("/api/products?limit=1").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([allData, publishedData, categoriesData]) => {
      setStats({
        products: allData.pagination?.total || 0,
        categories: (categoriesData || []).length,
        published: publishedData.pagination?.total || 0,
      });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminHeader title="仪表盘" />
      <div className="p-4 md:p-8">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard title="产品总数" value={stats.products} icon="📦" />
              <StatsCard title="产品分类" value={stats.categories} icon="🏷️" />
              <StatsCard title="已发布产品" value={stats.published} icon="✅" />
            </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">快速操作</h3>
            <div className="space-y-3">
              <a href="/admin/products/new" className="block px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium">
                ➕ 添加新产品
              </a>
              <a href="/admin/products" className="block px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                📦 管理产品
              </a>
              <a href="/admin/categories" className="block px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                🏷️ 管理分类
              </a>
              <a href="/admin/settings" className="block px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                ⚙️ 网站设置
              </a>
              <a href="/" target="_blank" className="block px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                🏠 查看网站前台
              </a>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">系统信息</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">默认管理员</span>
                <span className="text-gray-900">admin</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">技术栈</span>
                <span className="text-gray-900">Next.js + Prisma + SQLite</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">部署平台</span>
                <span className="text-gray-900">Vercel (免费)</span>
              </div>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </>
  );
}
