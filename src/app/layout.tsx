import type { Metadata } from "next";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "赤赫汽保工具 - 专业汽保设备供应商",
  description: "提供举升机、拆胎机、平衡机、四轮定位仪等各类汽保设备及配件",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "赤赫汽保工具 - 专业汽保设备供应商",
    description: "提供举升机、拆胎机、平衡机、四轮定位仪等各类汽保设备及配件",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
