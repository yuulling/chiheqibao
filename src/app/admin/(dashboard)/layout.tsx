import type { Metadata } from "next";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
