"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import {
  IconBell,
  IconGrid,
  IconLayoutDashboard,
  IconPanelLeft,
  IconSearch,
  IconTag,
} from "@/components/admin/icons";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Thống kê",
    icon: <IconLayoutDashboard className="h-4 w-4" />,
  },
  {
    href: "/admin/services",
    label: "Dịch vụ",
    icon: <IconGrid className="h-4 w-4" />,
  },
  {
    href: "/admin/categories",
    label: "Danh mục",
    icon: <IconTag className="h-4 w-4" />,
  },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const current =
    navItems.find((i) => isActive(pathname, i.href)) ?? navItems[0];
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = React.useState(false);

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1400px] gap-4 p-4">
        {mobileOpen ? (
          <div className="lg:hidden">
            <button
              className="fixed inset-0 z-40 bg-black/40"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              type="button"
            />
            <div className="fixed inset-y-4 left-4 z-50 w-[280px] max-w-[calc(100vw-2rem)] rounded-2xl border border-black/10 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-zinc-950">
              <div className="flex items-center justify-between gap-2 px-2 py-2">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                    <span className="text-sm font-semibold">DV</span>
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold">Dịch Vụ Số</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Admin
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 bg-white text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-white/5"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="mt-3 space-y-1">
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={[
                        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                        active
                          ? "bg-zinc-100 text-zinc-950 dark:bg-white/10 dark:text-zinc-50"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/5",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "grid h-7 w-7 place-items-center rounded-lg",
                          active
                            ? "bg-white shadow-sm dark:bg-zinc-950"
                            : "bg-transparent",
                        ].join(" ")}
                      >
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        <aside
          className={[
            "hidden w-[260px] shrink-0 rounded-2xl border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-950 lg:block",
            desktopCollapsed ? "lg:hidden" : "",
          ].join(" ")}
        >
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              <span className="text-sm font-semibold">DV</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Dịch Vụ Số</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Admin
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                    active
                      ? "bg-zinc-100 text-zinc-950 dark:bg-white/10 dark:text-zinc-50"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/5",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "grid h-7 w-7 place-items-center rounded-lg",
                      active
                        ? "bg-white shadow-sm dark:bg-zinc-950"
                        : "bg-transparent",
                    ].join(" ")}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-zinc-950">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (window.matchMedia("(min-width: 1024px)").matches) {
                    setDesktopCollapsed((v) => !v);
                  } else {
                    setMobileOpen(true);
                  }
                }}
                className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-white/5"
                aria-label={desktopCollapsed ? "Open sidebar" : "Toggle menu"}
              >
                <IconPanelLeft className="h-4 w-4" />
              </button>
              <div className="text-sm font-semibold">{current.label}</div>
              <div className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">
                / Overview
              </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2">
              <div className="hidden w-full max-w-[420px] items-center gap-2 rounded-xl border border-black/10 bg-zinc-50 px-3 py-2 text-sm text-zinc-600 dark:border-white/10 dark:bg-black dark:text-zinc-300 md:flex">
                <IconSearch className="h-4 w-4" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                  placeholder="Search..."
                />
                <kbd className="rounded-lg border border-black/10 bg-white px-2 py-0.5 text-[11px] text-zinc-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400">
                  Ctrl K
                </kbd>
              </div>

              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-white/5"
                aria-label="Notifications"
              >
                <IconBell className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-2 py-1.5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-200 text-xs font-semibold text-zinc-900 dark:bg-white/10 dark:text-zinc-100">
                  AD
                </div>
                <div className="hidden leading-tight sm:block">
                  <div className="text-xs font-semibold">Admin</div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    admin@example.com
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

