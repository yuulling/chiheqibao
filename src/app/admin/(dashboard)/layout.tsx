import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { ToastProvider } from "@/components/ui/Toast";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 校验当前会话是否有效（已被新登录挤掉则跳转登录页）
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="md:ml-64 flex-1 flex flex-col min-h-screen w-full">
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}
