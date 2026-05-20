"use client";

import * as React from "react";
import { servicesApi, type ApiService } from "@/lib/services-api";

export default function AdminDashboardPage() {
  const [totalServices, setTotalServices] = React.useState(0);
  const [totalVisits, setTotalVisits] = React.useState(0);
  const [topServices, setTopServices] = React.useState<(ApiService & { visitCount: number })[]>([]);
  const [recentServices, setRecentServices] = React.useState<ApiService[]>([]);

  React.useEffect(() => {
    servicesApi.list()
      .then((res) => setTotalServices(res.total))
      .catch(() => { });

    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"}/services/stats/visits`)
      .then((r) => r.json())
      .then((d) => setTotalVisits(d.totalVisits ?? 0))
      .catch(() => { });

    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"}/services/popular?limit=5`)
      .then((r) => r.json())
      .then((d) => setTopServices(d.data ?? []))
      .catch(() => { });

    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"}/services/recent?limit=5`)
      .then((r) => r.json())
      .then((d) => setRecentServices(Array.isArray(d) ? d : []))
      .catch(() => { });
  }, []);

  const stats = [
    { title: "Tổng dịch vụ", value: totalServices.toLocaleString("vi-VN"), note: "Đang hiển thị" },
    { title: "Tổng lượt truy cập", value: totalVisits.toLocaleString("vi-VN"), note: "All-time" },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div className="text-xl font-semibold tracking-tight">Hi, Welcome back</div>
        <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Tổng quan hoạt động hệ thống.</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((c) => (
          <div key={c.title} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{c.title}</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight">{c.value}</div>
              </div>
              <div className="rounded-full border border-black/10 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-black dark:text-zinc-200">
                {c.note}
              </div>
            </div>
            <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">Quick stats</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="text-sm font-semibold">Top dịch vụ được truy cập</div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Dịch vụ / Lượt truy cập.</div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs text-zinc-500 dark:bg-black dark:text-zinc-400">
                <tr className="[&>th]:px-3 [&>th]:py-2.5">
                  <th>Dịch vụ</th>
                  <th className="text-right">Lượt truy cập</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {topServices.length > 0 ? topServices.map((x) => (
                  <tr key={x.id} className="[&>td]:px-3 [&>td]:py-2.5">
                    <td className="font-medium">{x.name}</td>
                    <td className="text-right font-semibold">{x.visitCount.toLocaleString("vi-VN")}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={2} className="px-3 py-6 text-center text-xs text-zinc-400">Chưa có dữ liệu.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="text-sm font-semibold">Dịch vụ gần đây</div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Hiển thị vài dịch vụ mới thêm.</div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs text-zinc-500 dark:bg-black dark:text-zinc-400">
                <tr className="[&>th]:px-3 [&>th]:py-2.5">
                  <th>Dịch vụ</th>
                  <th>Danh mục</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {recentServices.length > 0 ? recentServices.map((s) => (
                  <tr key={s.id} className="[&>td]:px-3 [&>td]:py-2.5">
                    <td className="font-medium">{s.name}</td>
                    <td className="text-zinc-600 dark:text-zinc-300">
                      {s.categories?.length > 0 ? s.categories[0].name : "—"}
                    </td>
                    <td>
                      <span className={["inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold",
                        s.isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                          : "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-white/10 dark:bg-white/5",
                      ].join(" ")}>
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-3 py-8 text-center text-sm text-zinc-400">Chưa có dịch vụ nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}