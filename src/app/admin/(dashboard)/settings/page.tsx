"use client";
import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Loading } from "@/components/ui/Loading";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data || {}))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminHeader title="网站设置" />
      <div className="p-4 md:p-8">
        {loading ? <Loading /> : <SettingsForm settings={settings} />}
      </div>
    </>
  );
}
