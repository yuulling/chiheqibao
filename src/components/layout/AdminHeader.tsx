"use client";
export function AdminHeader({ title }: { title: string }) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between">
      <h1 className="text-lg md:text-xl font-semibold text-gray-900 ml-10 md:ml-0">{title}</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>管理员</span>
      </div>
    </div>
  );
}
