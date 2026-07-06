"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

interface Settings {
  [key: string]: string;
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: settings.companyName || "",
    companyAddress: settings.companyAddress || "",
    companyPhone: settings.companyPhone || "",
    companyEmail: settings.companyEmail || "",
    homeBannerTitle: settings.homeBannerTitle || "",
    homeBannerSubtitle: settings.homeBannerSubtitle || "",
    aboutContent: settings.aboutContent || "",
    footerText: settings.footerText || "",
    icpNumber: settings.icpNumber || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("设置已保存");
      } else {
        alert("保存失败");
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
        <h3 className="font-semibold text-gray-900 text-lg mb-2">公司信息</h3>
        <Input
          label="公司名称"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
        />
        <Input
          label="公司地址"
          value={form.companyAddress}
          onChange={(e) => setForm({ ...form, companyAddress: e.target.value })}
        />
        <Input
          label="联系电话"
          value={form.companyPhone}
          onChange={(e) => setForm({ ...form, companyPhone: e.target.value })}
        />
        <Input
          label="联系邮箱"
          type="email"
          value={form.companyEmail}
          onChange={(e) => setForm({ ...form, companyEmail: e.target.value })}
        />

        <h3 className="font-semibold text-gray-900 text-lg pt-4 mb-2">首页设置</h3>
        <Input
          label="Banner 标题"
          value={form.homeBannerTitle}
          onChange={(e) => setForm({ ...form, homeBannerTitle: e.target.value })}
        />
        <Input
          label="Banner 副标题"
          value={form.homeBannerSubtitle}
          onChange={(e) => setForm({ ...form, homeBannerSubtitle: e.target.value })}
        />

        <h3 className="font-semibold text-gray-900 text-lg pt-4 mb-2">页面内容</h3>
        <Textarea
          label="关于我们 (支持HTML)"
          value={form.aboutContent}
          onChange={(e) => setForm({ ...form, aboutContent: e.target.value })}
          rows={6}
        />

        <h3 className="font-semibold text-gray-900 text-lg pt-4 mb-2">其他</h3>
        <Input
          label="页脚文字"
          value={form.footerText}
          onChange={(e) => setForm({ ...form, footerText: e.target.value })}
        />
        <Input
          label="ICP 备案号"
          value={form.icpNumber}
          onChange={(e) => setForm({ ...form, icpNumber: e.target.value })}
          placeholder="例如：粤ICP备XXXXXXXX号"
        />
      </div>

      <div className="mt-6">
        <Button type="submit" disabled={loading}>
          {loading ? "保存中..." : "保存设置"}
        </Button>
      </div>
    </form>
  );
}
