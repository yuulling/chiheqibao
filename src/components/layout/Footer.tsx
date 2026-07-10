"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data || {}))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">赤赫汽保工具</h4>
            <p className="text-sm leading-relaxed">
              专业汽保设备供应商，提供举升机、拆胎机、平衡机、四轮定位仪等各类汽保设备及配件。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">产品中心</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">关于我们</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">联系方式</h4>
            <ul className="space-y-2 text-sm">
              <li>电话：{settings.companyPhone || "请致电咨询"}</li>
              <li>地址：{settings.companyAddress || "欢迎来访"}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} 赤赫汽保工具. All rights reserved.</p>
          {settings.icpNumber && (
            <p className="mt-1 text-gray-500">{settings.icpNumber}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
