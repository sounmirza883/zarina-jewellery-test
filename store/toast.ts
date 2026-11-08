"use client";

import { create } from "zustand";

export interface ToastMessage {
  id: number;
  text: string;
  tone: "success" | "info" | "error";
}

interface ToastState {
  toasts: ToastMessage[];
  push: (text: string, tone?: ToastMessage["tone"]) => void;
  dismiss: (id: number) => void;
}

let counter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (text, tone = "success") => {
    const id = ++counter;
    set((s) => ({ toasts: [...s.toasts, { id, text, tone }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3200);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
