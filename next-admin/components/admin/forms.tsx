"use client";

import * as React from "react";

export type Service = {
  id: number;
  name: string;
  slug?: string;
  department: string;
  image: string | null;
  path: string;
  sub: number[];
  softname?: string;
  active: number | boolean;
  isActive?: number;
  categories?: { id: number; name: string; slug: string }[];
  createdAt?: string;
};

export type Category = {
  id: number;
  name: string;
  slug?: string;
  createdAt?: string;
  serviceCount?: number;
};

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-400 dark:border-white/10 dark:bg-black dark:focus:border-white/30"
        placeholder={placeholder}
      />
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium">{label}</div>
      <input
        value={Number.isFinite(value) ? String(value) : ""}
        onChange={(e) => onChange(Number(e.target.value || 0))}
        className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-400 dark:border-white/10 dark:bg-black dark:focus:border-white/30"
        placeholder={placeholder}
        inputMode="numeric"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-400 dark:border-white/10 dark:bg-black dark:focus:border-white/30"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SwitchField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-black/10 bg-zinc-50 px-3 py-2.5 dark:border-white/10 dark:bg-black">
      <div className="text-sm font-medium">{label}</div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={[
          "relative h-6 w-11 rounded-full border border-black/10 transition dark:border-white/10",
          checked
            ? "bg-zinc-900 dark:bg-white"
            : "bg-white dark:bg-zinc-950",
        ].join(" ")}
        aria-pressed={checked}
      >
        <span
          className={[
            "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full shadow-sm transition",
            checked
              ? "left-[calc(100%-1.25rem-2px)] bg-white dark:bg-zinc-900"
              : "left-[2px] bg-zinc-900 dark:bg-white",
          ].join(" ")}
        />
      </button>
    </label>
  );
}

export function ServiceForm({
  initial,
  categories,
  onSubmit,
  onCancel,
}: {
  initial: Partial<Service>;
  categories: Category[];
  onSubmit: (next: {
    name: string;
    department: string;
    image: string;
    path: string;
    sub: number[];
    softname?: string;
    active: boolean;
  }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = React.useState(initial.name ?? "");
  const [department, setDepartment] = React.useState(initial.department ?? "");
  const [image, setImage] = React.useState(initial.image ?? "");
  const [path, setPath] = React.useState(initial.path ?? "");
  const [softname, setSoftname] = React.useState(initial.softname ?? "");
  const [sub, setSub] = React.useState<number[]>(
    Array.isArray(initial.sub) ? initial.sub : categories[0] ? [categories[0].id] : []
  );
  const [active, setActive] = React.useState<boolean>(Boolean(initial.active ?? 1));

  const canSubmit =
    name.trim().length > 0 &&
    department.trim().length > 0 &&
    image.trim().length > 0 &&
    path.trim().length > 0 &&
    sub.length > 0;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({
          name: name.trim(),
          department: department.trim(),
          image: image.trim(),
          path: path.trim(),
          sub,
          softname: softname.trim() || undefined,
          active,
        });
      }}
    >
      <TextField label="Tên dịch vụ" value={name} onChange={setName} />
      <TextField
        label="Đơn vị/Phòng ban (department)"
        value={department}
        onChange={setDepartment}
        placeholder="Ví dụ: Trung tâm Số và Học liệu"
      />
      <TextField
        label="Ảnh (image URL)"
        value={image}
        onChange={setImage}
        placeholder="https://..."
      />
      <TextField
        label="Link (path)"
        value={path}
        onChange={setPath}
        placeholder="https://..."
      />
      <TextField
        label="Tên nhóm (softname)"
        value={softname}
        onChange={setSoftname}
        placeholder="Ví dụ: Trợ lý AI - Dịch vụ số"
      />

      <div className="rounded-2xl border border-black/10 bg-zinc-50 p-3 dark:border-white/10 dark:bg-black">
        <div className="text-sm font-medium">Danh mục (sub)</div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {categories.map((c) => {
            const checked = sub.includes(c.id);
            return (
              <label
                key={c.id}
                className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-950"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    setSub((prev) => {
                      if (e.target.checked) return [...prev, c.id];
                      return prev.filter((x) => x !== c.id);
                    });
                  }}
                />
                <span className="font-medium">{c.name}</span>
                <span className="ml-auto text-xs text-zinc-500 dark:text-zinc-400">
                  #{c.id}
                </span>
              </label>
            );
          })}
        </div>
      </div>
      <SwitchField label="Kích hoạt" checked={active} onChange={setActive} />

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-white/5"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Lưu
        </button>
      </div>
    </form>
  );
}

export function CategoryForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: Partial<Category>;
  onSubmit: (next: { name: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = React.useState(initial.name ?? "");
  const canSubmit = name.trim().length > 0;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({ name: name.trim() });
      }}
    >
      <TextField label="Tên danh mục" value={name} onChange={setName} />
      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-white/5"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Lưu
        </button>
      </div>
    </form>
  );
}

