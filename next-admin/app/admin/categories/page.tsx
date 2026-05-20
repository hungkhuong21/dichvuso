"use client";

import * as React from "react";
import { Modal } from "@/components/admin/Modal";
import { CategoryForm } from "@/components/admin/forms";
import type { Category } from "@/components/admin/forms";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "@/lib/categories-api";

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

export default function AdminCategoriesPage() {
  const [ready, setReady]           = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [query, setQuery]           = React.useState("");
  const [page, setPage]             = React.useState(1);
  const [open, setOpen]             = React.useState(false);
  const [editing, setEditing]       = React.useState<Category | null>(null);

  async function load() {
    try {
      const api = await fetchCategories();
      setCategories(api.map((c) => ({ id: c.id, name: c.name, createdAt: c.createdAt, serviceCount: c.serviceCount })));
    } catch (e) {
      console.error("Failed to load categories:", e);
      setCategories([]);
    } finally {
      setReady(true);
    }
  }

  React.useEffect(() => { load(); }, []);
  React.useEffect(() => { setPage(1); }, [query]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? categories.filter((c) => c.name.toLowerCase().includes(q)) : categories;
  }, [categories, query]);

  const paginated = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold tracking-tight">Quản lý danh mục dịch vụ</div>
            <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Thêm / chỉnh sửa / xóa danh mục.</div>
          </div>
          <button type="button" onClick={() => { setEditing(null); setOpen(true); }}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
            + Thêm danh mục
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-zinc-400 dark:border-white/10 dark:bg-black sm:max-w-[380px]"
            placeholder="Tìm theo tên danh mục..." />
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {ready ? <span>Tổng: <span className="font-semibold">{filtered.length}</span></span> : "Đang tải..."}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs text-zinc-500 dark:bg-black dark:text-zinc-400">
              <tr className="[&>th]:px-4 [&>th]:py-3">
                <th>Tên danh mục</th><th>Số dịch vụ</th><th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {paginated.map((c) => {
                const used = c.serviceCount ?? 0;
                return (
                  <tr key={c.id} className="[&>td]:px-4 [&>td]:py-3">
                    <td className="font-medium">{c.name}</td>
                    <td className="text-zinc-600 dark:text-zinc-300">{used}</td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <button type="button" onClick={() => { setEditing(c); setOpen(true); }}
                          className="inline-flex h-9 items-center justify-center rounded-xl border border-black/10 bg-white px-3 text-xs font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50">
                          Sửa
                        </button>
                        <button type="button" disabled={used > 0} title={used > 0 ? "Đang được sử dụng" : "Xóa"}
                          onClick={async () => {
                            if (used > 0) { alert(`Không thể xóa vì đang có ${used} dịch vụ.`); return; }
                            if (!confirm(`Xóa danh mục "${c.name}"?`)) return;
                            try { await deleteCategory(c.id); await load(); }
                            catch (e: any) { alert(e.message ?? "Xóa thất bại"); }
                          }}
                          className="inline-flex h-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-10 text-center text-sm text-zinc-400">
                  {ready ? "Không có dữ liệu phù hợp." : "Đang tải..."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      <Modal open={open} title={editing ? "Chỉnh sửa danh mục" : "Thêm danh mục"} onClose={() => setOpen(false)}>
        <CategoryForm initial={editing ?? {}} onCancel={() => setOpen(false)}
          onSubmit={async (next) => {
            try {
              if (editing) await updateCategory(editing.id, next.name);
              else await createCategory(next.name);
              setOpen(false); await load();
            } catch (e: any) { alert(e.message ?? "Thao tác thất bại"); }
          }} />
      </Modal>
    </div>
  );
}