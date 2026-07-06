import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "赤赫汽保工具 - 后台管理",
  robots: "noindex, nofollow",
};

// Light wrapper only — no sidebar; login page renders standalone
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
