"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (form.newPassword !== form.confirmPassword) {
      setError("两次密码输入不一致");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("新密码至少6位");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          router.push("/admin");
        }, 2000);
      } else {
        setError(data.error || "修改失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="修改密码" />
      <div className="p-4 md:p-8 max-w-md">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg">
                密码修改成功！即将返回仪表盘...
              </div>
            )}

            <Input
              label="当前密码"
              type="password"
              value={form.oldPassword}
              onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
              placeholder="请输入当前密码"
              required
            />

            <Input
              label="新密码"
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              placeholder="至少6位"
              required
            />

            <Input
              label="确认新密码"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="再次输入新密码"
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "保存中..." : "修改密码"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
