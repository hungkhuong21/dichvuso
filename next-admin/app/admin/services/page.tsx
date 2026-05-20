"use client";

import * as React from "react";
import { Modal } from "@/components/admin/Modal";
import { fetchCategories, type Category as ApiCategory } from "@/lib/categories-api";
import { servicesApi, type ApiService } from "@/lib/services-api";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003").replace(/\/+$/, "");
const PAGE_SIZE = 8;

function Pagination({ page, total, pageSize, onChange }: {
  page: number; total: number; pageSize: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
      <span>Trang {page} / {totalPages} — Tổng {total} mục</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page === 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white disabled:opacity-40 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950">
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce<(number | string)[]>((acc, p, i, arr) => {
            if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...");
            acc.push(p); return acc;
          }, [])
          .map((p, i) => p === "..." ? (
            <span key={`d${i}`} className="px-1">...</span>
          ) : (
            <button key={p} onClick={() => onChange(p as number)}
              className={["inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold",
                page === p
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                  : "border-black/10 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950",
              ].join(" ")}>{p}</button>
          ))}
        <button onClick={() => onChange(page + 1)} disabled={page === Math.ceil(total / pageSize)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white disabled:opacity-40 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950">
          ›
        </button>
      </div>
    </div>
  );
}

function ServiceThumb({ url, name }: { url?: string | null; name: string }) {
  const src = url ? (url.startsWith("http") ? url : `${BASE}${url}`) : undefined;
  if (!src) return (
    <div className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-zinc-50 text-xs font-semibold text-zinc-500 dark:border-white/10 dark:bg-black">
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
  return <img src={src} alt={name} className="h-10 w-10 rounded-xl border border-black/10 object-cover dark:border-white/10" loading="lazy"
    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />;
}

function ServiceForm({ initial, categories, loading, onSubmit, onCancel }: {
  initial?: ApiService; categories: ApiCategory[]; loading: boolean;
  onSubmit: (d: { name: string; department: string; image: string; path: string; categoryIds: number[] }) => void;
  onCancel: () => void;
}) {
  const [name, setName]               = React.useState(initial?.name ?? "");
  const [department, setDepartment]   = React.useState(initial?.department ?? "");
  const [image, setImage]             = React.useState(initial?.image ?? "");
  const [path, setPath]               = React.useState(initial?.path ?? "");
  const [categoryIds, setCategoryIds] = React.useState<number[]>(initial?.categories.map((c) => c.id) ?? []);
  const [uploading, setUploading]     = React.useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { const res = await servicesApi.uploadImage(file); setImage(res.imageUrl); }
    catch (err: any) { alert(err.message ?? "Upload thất bại"); }
    finally { setUploading(false); }
  }

  const canSubmit = name.trim() && department.trim() && path.trim() && categoryIds.length > 0;

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (!canSubmit) return; onSubmit({ name, department, image, path, categoryIds }); }}>
      <label className="block">
        <span className="text-sm font-medium">Tên dịch vụ *</span>
        <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="E-Learning"
          className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-400 dark:border-white/10 dark:bg-black" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Đơn vị *</span>
        <input value={department} onChange={(e) => setDepartment(e.target.value)} required placeholder="Trung tâm Số và Học liệu"
          className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-400 dark:border-white/10 dark:bg-black" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Ảnh</span>
        <div className="mt-2 flex items-center gap-2">
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="/assets/png/ten-anh.png"
            className="flex-1 rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-400 dark:border-white/10 dark:bg-black" />
          <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-black/10 bg-white px-3 text-xs font-semibold hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
            {uploading ? "Đang upload..." : "Upload"}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
        {image && <img src={image.startsWith("http") ? image : `${BASE}${image}`} className="mt-2 h-16 rounded-lg border object-contain" alt="preview" />}
      </label>
      <label className="block">
        <span className="text-sm font-medium">Link dịch vụ *</span>
        <input value={path} onChange={(e) => setPath(e.target.value)} required placeholder="https://example.com"
          className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-400 dark:border-white/10 dark:bg-black" />
      </label>
      <div>
        <div className="text-sm font-medium">Danh mục *</div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-950">
              <input type="checkbox" checked={categoryIds.includes(c.id)}
                onChange={(e) => setCategoryIds((prev) => e.target.checked ? [...prev, c.id] : prev.filter((x) => x !== c.id))} />
              <span className="font-medium">{c.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50">
          Hủy
        </button>
        <button type="submit" disabled={!canSubmit || loading}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900">
          {loading ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </form>
  );
}

export default function AdminServicesPage() {
  const [services, setServices]     = React.useState<ApiService[]>([]);
  const [categories, setCategories] = React.useState<ApiCategory[]>([]);
  const [ready, setReady]           = React.useState(false);
  const [saving, setSaving]         = React.useState(false);
  const [query, setQuery]           = React.useState("");
  const [page, setPage]             = React.useState(1);
  const [open, setOpen]             = React.useState(false);
  const [editing, setEditing]       = React.useState<ApiService | null>(null);

  async function loadData() {
    try {
      const [svcRes, cats] = await Promise.all([servicesApi.list(), fetchCategories()]);
      setServices(svcRes.data); setCategories(cats);
    } catch (e: any) { alert(e.message ?? "Không tải được dữ liệu"); }
    finally { setReady(true); }
  }

  React.useEffect(() => { loadData(); }, []);
  React.useEffect(() => { setPage(1); }, [query]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) => {
      const cats = s.categories.map((c) => c.name).join(" ");
      return s.name.toLowerCase().includes(q) || s.department.toLowerCase().includes(q) || cats.toLowerCase().includes(q);
    });
  }, [services, query]);

  const paginated = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  async function handleSubmit(data: { name: string; department: string; image: string; path: string; categoryIds: number[] }) {
    setSaving(true);
    try {
      if (editing) await servicesApi.update(editing.id, data);
      else await servicesApi.create(data);
      setOpen(false); setEditing(null); await loadData();
    } catch (e: any) { alert(e.message ?? "Thao tác thất bại"); }
    finally { setSaving(false); }
  }

  async function handleDelete(s: ApiService) {
    if (!confirm(`Xóa dịch vụ "${s.name}"?`)) return;
    try { await servicesApi.remove(s.id); await loadData(); }
    catch (e: any) { alert(e.message ?? "Xóa thất bại"); }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold tracking-tight">Quản lý dịch vụ</div>
            <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Thêm / chỉnh sửa / xóa dịch vụ.</div>
          </div>
          <button type="button" onClick={() => { setEditing(null); setOpen(true); }}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
            + Thêm dịch vụ
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-zinc-400 dark:border-white/10 dark:bg-black sm:max-w-[380px]"
            placeholder="Tìm theo tên dịch vụ / danh mục..." />
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {ready ? <span>Tổng: <span className="font-semibold">{filtered.length}</span></span> : "Đang tải..."}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs text-zinc-500 dark:bg-black dark:text-zinc-400">
              <tr className="[&>th]:px-4 [&>th]:py-3">
                <th>Dịch vụ</th><th>Đơn vị</th><th>Danh mục</th><th>Link</th><th>Trạng thái</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-400">
                  {ready ? "Không có dữ liệu phù hợp." : "Đang tải..."}
                </td></tr>
              ) : paginated.map((s) => (
                <tr key={s.id} className="[&>td]:px-4 [&>td]:py-3">
                  <td>
                    <div className="flex items-center gap-3">
                      <ServiceThumb url={s.imageUrl ?? s.image} name={s.name} />
                      <span className="truncate font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="text-zinc-600 dark:text-zinc-300">{s.department}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {s.categories.map((c) => (
                        <span key={c.id} className="inline-flex items-center rounded-full border border-black/10 bg-zinc-50 px-2 py-1 text-xs font-semibold text-zinc-700 dark:border-white/10 dark:bg-black dark:text-zinc-200">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="max-w-[220px]">
                    <a href={s.path} target="_blank" rel="noreferrer" title={s.path}
                      className="block truncate text-sm font-medium underline-offset-4 hover:underline">
                      {s.path}
                    </a>
                  </td>
                  <td>
                    <span className={["inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold",
                      s.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                        : "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-white/10 dark:bg-white/5",
                    ].join(" ")}>{s.isActive ? "Active" : "Inactive"}</span>
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <button type="button" onClick={() => { setEditing(s); setOpen(true); }}
                        className="inline-flex h-9 items-center justify-center rounded-xl border border-black/10 bg-white px-3 text-xs font-semibold hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50">
                        Sửa
                      </button>
                      <button type="button" onClick={() => handleDelete(s)}
                        className="inline-flex h-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      <Modal open={open} title={editing ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
        description="Dữ liệu lưu thẳng vào database."
        onClose={() => { setOpen(false); setEditing(null); }}>
        <ServiceForm initial={editing ?? undefined} categories={categories} loading={saving}
          onCancel={() => { setOpen(false); setEditing(null); }}
          onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}