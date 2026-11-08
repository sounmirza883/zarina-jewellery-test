"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToastStore } from "@/store/toast";

const icons = { success: CheckCircle2, info: Info, error: XCircle } as const;

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      className="pointer-events-none fixed bottom-24 left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const Icon = icons[t.tone];
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-3 rounded-sm border border-gold/40 bg-navy px-4 py-3 text-sm text-ivory shadow-lg"
          >
            <Icon className="h-5 w-5 shrink-0 text-gold-light" aria-hidden="true" />
            <span className="flex-1">{t.text}</span>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss message" className="text-ivory/60 hover:text-ivory">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
