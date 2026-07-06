"use client";
import { useState, useEffect } from "react";

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.aboutContent) {
          setAboutContent(data.aboutContent);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">关于我们</h1>
        <p className="text-gray-500">了解我们的故事和服务</p>
      </div>

      <div className="prose prose-gray max-w-none">
        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-4">
          {aboutContent ? (
            <div
              className="text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: aboutContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ""),
              }}
            />
          ) : (
            <>
              <p className="text-gray-600 leading-relaxed">
                我们是一家专业从事汽保设备销售与服务的公司，拥有多年的行业经验。
              </p>
              <p className="text-gray-600 leading-relaxed">
                主营产品包括举升机、拆胎机、平衡机、四轮定位仪等各类汽保设备及配件。我们为汽车维修厂、
                4S店、轮胎店、汽车美容店等提供一站式汽保设备解决方案。
              </p>
              <p className="text-gray-600 leading-relaxed">
                我们坚持品质至上、服务为本的经营理念，为客户提供优质的设备和完善的售后服务。
                选择我们，就是选择专业和放心。
              </p>
            </>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 not-prose">
          {[
            { icon: "🏆", title: "品质保证", desc: "严格筛选优质设备，确保每一件产品都经得起考验" },
            { icon: "🤝", title: "专业服务", desc: "多年行业经验，提供专业的设备选购和使用指导" },
            { icon: "⚡", title: "快速响应", desc: "及时响应客户需求，快速解决问题" },
          ].map((item, i) => (
            <div key={i} className="card p-6 text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
