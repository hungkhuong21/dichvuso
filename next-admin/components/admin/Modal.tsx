"use client";

import * as React from "react";

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="Close modal"
        onClick={onClose}
        type="button"
      />
      <div className="absolute inset-x-0 top-12 mx-auto flex w-[calc(100%-2rem)] max-w-xl flex-col overflow-hidden rounded-2xl border border-black/10 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-zinc-950">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold">{title}</div>
            {description ? (
              <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {description}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 bg-white text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-white/5"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="mt-4 max-h-[calc(100dvh-160px)] overflow-y-auto overscroll-contain pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}

