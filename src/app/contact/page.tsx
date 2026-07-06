"use client";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data || {}))
      .catch(() => {});
  }, []);

  const contactItems = [
    { icon: "📞", label: "电话", value: settings.companyPhone || "请致电咨询" },
    { icon: "📧", label: "邮箱", value: settings.companyEmail || "请邮件联系" },
    { icon: "📍", label: "地址", value: settings.companyAddress || "欢迎来访" },
    { icon: "🕐", label: "工作时间", value: "周一至周六 8:00-18:00" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">联系我们</h1>
        <p className="text-gray-500">期待与您的合作</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">联系方式</h2>
          {contactItems.map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="text-2xl w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{item.label}</h3>
                <p className="text-gray-500 text-sm">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">发送消息</h2>
          <p className="text-sm text-gray-500 mb-6">如果您有任何问题或需求，欢迎随时联系我们。您也可以通过电话直接与我们沟通。</p>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("感谢您的留言！我们会尽快与您联系。"); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
              <input type="text" className="input-field" placeholder="请输入您的姓名" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
              <input type="tel" className="input-field" placeholder="请输入您的电话" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">留言内容</label>
              <textarea className="input-field min-h-[100px]" placeholder="请输入您的需求或问题" rows={4} />
            </div>
            <button type="submit" className="btn-primary w-full">
              提交留言
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
